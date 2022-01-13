<?php

defined('ABSPATH') or die('No script kiddies please!');

/**
 * Class which contains the functionality that is required
 * in the admin part of the plugin
 *
 */

class NRDQ_LimitUploadSize_Admin extends NRDQ_LimitUploadSize_Controller
{

    private $plugin_admin_credentials;

    private $admin_notices;
    
    private $sanitizer;


    public function run()
    {
        $this->sanitizer = new enshrined\svgSanitize\Sanitizer();
        $this->sanitizer->minify( true );

        $this->add_admin_hooks();
    }


    private function add_admin_hooks()
    {
        if (get_option('NRDQ_LimitUploadSize_size')) {
            add_filter('upload_size_limit', array($this, 'filter_site_upload_size_limit'));
        }

        if (get_option('NRDQ_LimitUploadSize_types')) {
            add_filter('upload_mimes', array($this, 'filter_site_upload_file_types'), 1, 1);
            add_filter('wp_handle_upload_prefilter', array( $this, 'check_for_svg' ));
            add_filter('wp_prepare_attachment_for_js', array( $this, 'fix_admin_preview' ), 10, 3 );
            add_filter('wp_get_attachment_image_src', array( $this, 'one_pixel_fix' ), 10, 4 );
        }

        if (get_option('NRDQ_LimitUploadSize_dimensions_width') || get_option('NRDQ_LimitUploadSize_dimensions_height')) {
            add_filter('wp_handle_upload_prefilter', array($this, 'filter_site_upload_dimensions_limit'));
        }

        add_action('admin_menu', array($this, 'add_admin_pages'));
    }

    public function add_admin_pages()
    {
        $this->plugin_admin_credentials = apply_filters('nrdq_limituploadsize_permissions', 'manage_options');
        $visible_for_accounts = apply_filters('nrdq_limituploadsize_accounts', array('nordique', 'Nordique'));
        if (apply_filters('nrdq_show_admin_pages', true) && (count($visible_for_accounts) == 0 || in_array(wp_get_current_user()->user_login, $visible_for_accounts))) {
            add_submenu_page('options-general.php', $this->get_formal_name(), "Limiteer Media Upload", $this->plugin_admin_credentials, "limit-upload", array($this, 'router'));
        }
    }

    public function router($posted = false)
    {
        $result = '';
        $fn = 'page_' . $this->get('subpage', 'index');

        if (method_exists($this, $fn)) {
            $result = $this->$fn();
        }

        echo $result;
        die();
    }

    public function filter_site_upload_dimensions_limit($file)
    {
        $image = getimagesize($file['tmp_name']);

        $maximum = array(
        'width' => (get_option('NRDQ_LimitUploadSize_dimensions_width')) ? get_option('NRDQ_LimitUploadSize_dimensions_width') : '9999',
        'height' => (get_option('NRDQ_LimitUploadSize_dimensions_height')) ? get_option('NRDQ_LimitUploadSize_dimensions_height') : '9999'
        );

        $image_width = $image[0];
        $image_height = $image[1];

        $too_large = "De afmetingen van deze afbeelding zijn te groot. Maximale grootte is {$maximum['width']} bij {$maximum['height']} pixels. De afbeelding is $image_width bij $image_height pixels.";

        if ($image_width > $maximum['width'] || $image_height > $maximum['height']) {
            $file['error'] = $too_large;
            return $file;
        } else {
            return $file;
        }
    }

    public function filter_site_upload_file_types($mime_types)
    {
        foreach (get_option('NRDQ_LimitUploadSize_types') as $type => $mime) {
            if (!array_key_exists($type, $mime_types)) {
                $mime_types[$type] = $mime;
            }
        }
        return $mime_types;
    }

    public function check_for_svg($file)
    {
        if ($file['type'] === 'image/svg+xml') {
            if (! $this->sanitize($file['tmp_name'])) {
                $file['error'] = __("Sorry, het controleren van de geldigheid van deze SVG is mislukt.", 'nrdq-limit-upload');
            }
        }

        return $file;
    }

    private function sanitize($file)
    {
        $dirty = file_get_contents($file);

            // Is the SVG gzipped? If so we try and decode the string
        if ($is_zipped = $this->is_gzipped($dirty)) {
            $dirty = gzdecode($dirty);

            // If decoding fails, bail as we're not secure
            if ($dirty === false) {
                return false;
            }
        }


/*
        $this->sanitizer->setAllowedTags(new safe_svg_tags());
        $this->sanitizer->setAllowedAttrs(new safe_svg_attributes());
*/

        $clean = $this->sanitizer->sanitize($dirty);

        if ($clean === false) {
            return false;
        }

            // If we were gzipped, we need to re-zip
        if ($is_zipped) {
            $clean = gzencode($clean);
        }

        file_put_contents($file, $clean);

        return true;
    }
    
    private function is_gzipped( $contents ) {
        if ( function_exists( 'mb_strpos' ) ) {
            return 0 === mb_strpos( $contents, "\x1f" . "\x8b" . "\x08" );
        } else {
            return 0 === strpos( $contents, "\x1f" . "\x8b" . "\x08" );
        }
    }

    public function filter_site_upload_size_limit()
    {
        $size = 1024 * get_option('NRDQ_LimitUploadSize_size') * 1000;
        return $size;
    }

    private function get_mime_type($filetype)
    {
        foreach (explode("\n", file_get_contents(plugin_dir_path(__FILE__) . "../../includes/mime-types")) as $line) {
            if (isset($line[0]) && $line[0] !== '#' && preg_match_all('#([^\s]+)#', $line, $out) && isset($out[1]) && (count($out[1])) > 1) {
                if ($filetype == $out[1][1]) {
                    return $out[1][0];
                }
            }
        }
        return false;
    }
    
    public function fix_admin_preview( $response, $attachment, $meta ) {

        if ( $response['mime'] == 'image/svg+xml' ) {
            $dimensions = $this->svg_dimensions( get_attached_file( $attachment->ID ) );
        
            if ( $dimensions ) {
                $response = array_merge( $response, $dimensions );
            }
        
            $possible_sizes = apply_filters( 'image_size_names_choose', array(
                'full'      => __( 'Full Size' ),
                'thumbnail' => __( 'Thumbnail' ),
                'medium'    => __( 'Medium' ),
                'large'     => __( 'Large' ),
            ) );
        
            $sizes = array();
        
            foreach ( $possible_sizes as $size => $label ) {
                $default_height = 2000;
                $default_width  = 2000;
        
                if ( 'full' === $size && $dimensions ) {
                    $default_height = $dimensions['height'];
                    $default_width  = $dimensions['width'];
                }
        
                $sizes[ $size ] = array(
                    'height'      => get_option( "{$size}_size_w", $default_height ),
                    'width'       => get_option( "{$size}_size_h", $default_width ),
                    'url'         => $response['url'],
                    'orientation' => 'portrait',
                );
            }
        
            $response['sizes'] = $sizes;
            $response['icon']  = $response['url'];
        }
        
        return $response;
    }
    
    public function one_pixel_fix( $image, $attachment_id, $size, $icon ) {
        if ( get_post_mime_type( $attachment_id ) == 'image/svg+xml' ) {
            $image['1'] = false;
            $image['2'] = false;
        }

        return $image;
    }

    private function save()
    {
        foreach ($_POST as $name => $value) {
            if ($name == 'NRDQ_LimitUploadSize_types') {
                if ($_POST['NRDQ_LimitUploadSize_types']) {
                    $types_to_upload = array();
                    $types = explode(',', preg_replace('/[^A-Za-z0-9\,]/', '', $_POST['NRDQ_LimitUploadSize_types']));
                    foreach ($types as $type) {
                        if (!$this->get_mime_type($type)) {
                            $this->add_admin_notice('error', 'Het bestandstype ' . $type . ' heeft geen bekend mime type. Dit bestandstype kan niet toegevoegd worden.');
                            return;
                        } else {
                            $types_to_upload[$type] = $this->get_mime_type($type);
                        }
                    }
                    if (count($types_to_upload)) {
                        update_option($name, $types_to_upload);
                    }
                } else {
                    update_option($name, array());
                }
            } else {
                update_option($name, $value);
            }
        }
    }

    public function page_index()
    {

        if (isset($_POST['submit'])) {
            $this->save();
        }

        $current_size = get_option('NRDQ_LimitUploadSize_size');
        $type_list = get_option('NRDQ_LimitUploadSize_types', array());
        $current_dimensions_width = get_option('NRDQ_LimitUploadSize_dimensions_width');
        $current_dimensions_height = get_option('NRDQ_LimitUploadSize_dimensions_height');
        $current_ext_list = array();

        foreach ($type_list as $item => $value) {
            $current_ext_list []= $item;
        }

        $current_types = implode(', ', $current_ext_list);

        $notice = $this->retrieve_admin_notices();

        return \NRDQ_LimitUploadSize\View::render(compact('current_size', 'current_types', 'current_dimensions_width', 'current_dimensions_height', 'notice'), 'admin', 'index');
    }

    private function retrieve_admin_notices()
    {
        $notices = $this->admin_notices;
        $this->admin_notices = array();
        return $notices;
    }

    public function add_admin_notice($type, $text)
    {
        $notice = array();
        $notice['notice'] = true;
        $notice['notice_type'] = $type;
        $notice['notice_text'] = $text;
        $this->admin_notices []= $notice;
    }
}

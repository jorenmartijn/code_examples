<?php

namespace Nordique;

class ImportDB {

    private $prefix;
    private $db;

    public function __construct($db, $user, $pass, $prefix, $host = 'localhost')
    {
        $this->db = new \wpdb($user, $pass, $db, $host);
        $this->prefix = $prefix;
    }

    public function import($postType, $mapping, $taxMapping, $language = 'nl', $limit = 10, $offset = 0) {
        if($this->checkWPML()) {
            $stmt = "SELECT * FROM " . $this->prefix . "posts 
                    LEFT JOIN " . $this->prefix . "icl_translations ON " . $this->prefix . "icl_translations.element_id = " . $this->prefix . "posts.ID
                    WHERE post_type = '" . $postType . "'
                    AND post_status IN ('publish', 'draft', 'private')
                    AND " . $this->prefix . "icl_translations.language_code = '" . $language . "'
                    ";
        } else {
            $stmt = "SELECT * FROM " . $this->prefix . "posts WHERE post_type = '" . $postType . "' AND post_status IN ('publish', 'draft', 'private')";
        }

        if($limit) {
            $stmt .= " LIMIT " . $limit;
        }

        if($offset) {
            $stmt .= " OFFSET " . $offset;
        }

        $results = $this->db->get_results($stmt); // Posts

        foreach($results as $post) {
            if (!isset($post->post_title)) {
                continue;
            }

            // Set post meta
            $meta = array();
            $metaStmt = "SELECT * FROM " . $this->prefix . "postmeta WHERE post_id = " . $post->ID;
            $metaDB = $this->db->get_results($metaStmt);

            foreach($metaDB as $metaObj) {
                $meta[$metaObj->meta_key] = $metaObj->meta_value;
            }

            $id = $this->insertPost($post, $meta, $postType, $mapping, $taxMapping);
            echo "Inserted or updated post with ID: " . $id . " and title: " . get_the_title($id) . "<br>";
        }
    }

    public function checkWPML(){
        $wpdb = $this->db;
        $active_plugins = $wpdb->get_var('SELECT option_value FROM ' . $this->prefix . 'options WHERE option_name = "active_plugins"');
        if($active_plugins && strpos($active_plugins, 'sitepress-multilingual-cms') !== false) {
            return true;
        }

        return false;
    }

    private function insertPost($post, $meta, $postType, $mapping, $taxMapping) {


        list($post, $meta) = $this->setContentAttachments($post, $meta);

        if ($id = $this->getByOriginalId($post->ID)) {

            // Update post
            wp_update_post(array(
                'ID'  => $id,
                'post_content'  => $post->post_content
            ));

            update_post_meta($id,'post_content',  $post->post_content);

        } else {

            // Insert new post
            $data = array(
                'post_type'           => $postType,
                'post_title'          => wp_strip_all_tags($post->post_title),
                'post_status'         => $post->post_status,
                'post_author'         => 3, // Change this to the correct user ID
                'post_date'           => $post->post_date,
                'post_date_gmt'       => $post->post_date_gmt,
                'post_name'           => $post->post_name,
                'post_content'        => $post->post_content, // If site uses post content
                'post_modified'       => $post->post_modified,
                'post_modified_gmt'   => $post->post_modified_gmt,
                'post_excerpt'        => str_replace('[&hellip;]', '', $post->post_excerpt)
            );

            $args = $this->parseDefaults($data);

            // Insert post
            $id = wp_insert_post($args);
            update_post_meta($id,'post_content',  $post->post_content);
            update_post_meta($id, 'original_id', $post->ID);
        }

        // Insert thumbnail
        $this->setThumbnail($post, $id);

        // Set categories
        $this->setCategories($post, $id, $taxMapping, $postType);

        $mapping = $this->parseDefaultsMeta($mapping);

        if($mapping) {
            foreach($mapping as $field => $value) {

                if (isset($meta[$field])) {
                    if (is_array($value)) {
                        if(isset($value['type']) && $value['type'] == 'image') {
                            $oldId = $meta[$field];
                            $obj_stmt = "SELECT * FROM " . $this->prefix . "posts WHERE ID = " . $oldId; // Change this to get the correct posts
                            $obj = $this->db->get_row($obj_stmt);
                            $url = $this->db->get_var('SELECT meta_value FROM ' . $this->prefix . 'postmeta WHERE meta_key = "_wp_attached_file" AND post_id=' . $oldId);


                            if ($obj && $url) {
                                $url = $this->getUploadsDir() . $url;
                                $attach_id = $this->importExternalAttachment($url, $oldId);
                                update_post_meta($id, $value['field'], $attach_id);
                            }
                        }
                    } else {
                        update_post_meta($id, $value, $meta[$field]);
                    }
                }
            }
        }

        return $id;
    }

    private function setCategories($post, $newID, $taxMapping, $postType) {
        // Get attached terms
        $stmt = 'SELECT term_taxonomy_id FROM ' . $this->prefix . 'term_relationships WHERE object_id=' . $post->ID;
        $categories = $this->db->get_results($stmt);

        foreach($categories as $category) {
            $tax_id = $category->term_taxonomy_id;

            // Get tax contents
            $stmt = 'SELECT * FROM ' . $this->prefix . 'term_taxonomy WHERE term_id=' . $tax_id;
            $tax = $this->db->get_row($stmt);

            if(!isset($taxMapping[$tax->taxonomy]) || !taxonomy_exists($taxMapping[$tax->taxonomy])) {
                continue; // Taxonomy does not exist on this site
            }

            $newTax = get_taxonomy($taxMapping[$tax->taxonomy]);
            if(!in_array($postType, $newTax->object_type)){
                continue; // Posttype not attached to this taxonomy
            }

            // Get term contents
            $stmt = 'SELECT * FROM ' . $this->prefix . 'terms WHERE term_id=' . $tax_id;
            $term = $this->db->get_row($stmt);

            $createdTerm = term_exists($term->slug, $taxMapping[$tax->taxonomy]);
            if(!$createdTerm) {
                $createdTerm = wp_insert_term($term->name, $taxMapping[$tax->taxonomy], array(
                    'slug'  => $term->slug
                ));
            }

            wp_set_post_terms($newID, array($createdTerm['term_id']), $taxMapping[$tax->taxonomy], true);
        }
    }

    private function setThumbnail($post, $newID) {
        $stmt = "SELECT meta_value FROM " . $this->prefix . "postmeta WHERE post_id = " . $post->ID . " AND meta_key = '_thumbnail_id' LIMIT 1";
        $id = $this->db->get_var($stmt);

        if($id){
            $obj_stmt = "SELECT * FROM " . $this->prefix . "posts WHERE ID = " . $id; // Change this to get the correct posts
            $obj = $this->db->get_row($obj_stmt);
            $url = $this->db->get_var('SELECT meta_value FROM ' . $this->prefix . 'postmeta WHERE meta_key = "_wp_attached_file" AND post_id=' . $id);

            if($obj && $url){
                $url = $this->getUploadsDir() . $url;
                $attach_id = $this->importExternalAttachment($url, $id);

                update_post_meta( $newID, '_thumbnail_id', $attach_id);
            }
        }
    }

    private function setContentAttachments($post, $meta){

        // Get correct content
        $url        = $this->getSiteUrl();                 // Change to correct URL
        $img_size   = 'full';                              // Change to correct image size

        $content = $post->post_content . implode('', $meta);



        $urls = $this->findImageUrls($content, $url);
        $urls = array_merge($urls, $this->findPdfUrls($content, $url));


        if($urls && count($urls) > 0){
            foreach ($urls as $image) {

                //Import and upload
                $attach_id = $this->importExternalAttachment($image['url']);
                if ($attach_id) {

                    // Check if image
                    $isImage = $this->isImage(get_attached_file($attach_id));

                    if($isImage) {
                        $attachment_url = wp_get_attachment_image_src($attach_id, $img_size)[0];
                    } else {
                        $attachment_url = wp_get_attachment_url($attach_id);
                    }

                    // Set alt
                    if($isImage && isset($image['alt']) && $image['alt'])
                        update_post_meta( $attach_id, '_wp_attachment_image_alt', $image['alt']);

                    // Replace URL in postcontent
                    $post->post_content = preg_replace('/'. preg_quote($image['url'], '/') .'/', $attachment_url, $post->post_content);
                    $post->post_content = preg_replace('/'. preg_quote(str_replace($this->getSiteUrl(), '', $image['url']), '/') .'/', $attachment_url, $post->post_content);

                    if($isImage)
                        $post->post_content = preg_replace('/alt=["\']'. preg_quote($image['alt'], '/') .'["\']/', "alt='" . get_post_meta($attach_id, '_wp_attachment_image_alt', true) . "'", $post->post_content);

                    // Replace URL in meta
                    foreach($meta as $key => $value) {
                        $meta[$key] = preg_replace('/'. preg_quote($image['url'], '/') .'/', $attachment_url, $value);
                        $meta[$key] = preg_replace('/'. preg_quote(str_replace($this->getSiteUrl(), '', $image['url']), '/') .'/', $attachment_url, $value);

                        if($isImage)
                            $meta[$key] = preg_replace('/alt=["\']'. preg_quote($image['alt'], '/') .'["\']/', "alt='" . get_post_meta($attach_id, '_wp_attachment_image_alt', true) . "'", $value);
                    }
                }
            }
        }

        return array($post, $meta);
    }

    private function getByOriginalId($id) {
        // Check if post already exists in current DB
        global $wpdb; // Use default db connection
        $post_id = $wpdb->get_var('SELECT post_id from ' . $wpdb->prefix .  'postmeta WHERE meta_value = "' . $id . '" AND meta_key = "original_id"');
        if($post_id) {
            return $post_id;
        }
        return 0;
    }

    private function getByOriginalUrl($url) {
        // Check if post already exists in current DB
        global $wpdb; // Use default db connection
        $post_id = $wpdb->get_var('SELECT post_id from ' . $wpdb->prefix .  'postmeta WHERE meta_value = "' . $url . '" AND meta_key = "original_url"');
        if($post_id) {
            return $post_id;
        }
        return 0;
    }


    private function parseDefaults($postArr) {
        $defaults = array(
            'post_author'           => 1,
            'post_content'          => '',
            'post_content_filtered' => '',
            'post_title'            => '',
            'post_excerpt'          => '',
            'post_status'           => 'draft',
            'post_type'             => 'post',
            'comment_status'        => '',
            'ping_status'           => '',
            'post_password'         => '',
            'to_ping'               => '',
            'pinged'                => '',
            'post_parent'           => 0,
            'menu_order'            => 0,
            'guid'                  => '',
            'import_id'             => 0,
            'context'               => '',
        );

        return wp_parse_args( $postArr, $defaults );
    }


    private function parseDefaultsMeta($metaArr) {
        $defaults = array(
            '_edit_lock'            => '_edit_lock',
            '_edit_last'            => '_edit_last',
        );

        return wp_parse_args( $metaArr, $defaults );
    }

    private function getSiteUrl() {
        $siteurl = $this->db->get_var('SELECT option_value from ' . $this->prefix .  'options WHERE option_name = "siteurl"');
        if($siteurl) {
            return $siteurl;
        }
        return '';
    }

    private function getUploadsDir(){
        $upload_dir = $this->db->get_var('SELECT option_value from ' . $this->prefix .  'options WHERE option_name = "upload_url_path"');
        if($upload_dir) {
            return $upload_dir;
        }

        return $this->getSiteUrl() . '/wp-content/uploads/';
    }

    private function isImage($url) {
        return getimagesize($url) ? true : false;
    }

    private function importExternalAttachment($url, $id = ''){

        if($id && $image_id = $this->getByOriginalId($id)) {
            return $image_id;
        }

        if($image_id = $this->getByOriginalUrl($url)) {
            return $image_id;
        }

        $parsed_url = parse_url($url);

        if($parsed_url){
            $url = $parsed_url['scheme'] . '://' . $parsed_url['host'] . $parsed_url['path'];
        }

        // Credit: https://gist.github.com/m1r0/f22d5237ee93bcccb0d9
        if( !class_exists( 'WP_Http' ) )
            include_once( ABSPATH . WPINC . '/class-http.php' );

        $http = new \WP_Http();
        $response = $http->request( $url );
        if( $response['response']['code'] != 200 ) {
            error_log("Image " . $url . " not found");
            return false;
        }

        $upload = wp_upload_bits( basename($url), null, $response['body'] );
        if( !empty( $upload['error'] ) ) {
            error_log("Image " . $url . " could not be uploaded " . serialize($upload));
            return false;
        }

        $file_path = $upload['file'];
        $file_name = basename( $file_path );
        $file_type = wp_check_filetype( $file_name, null );
        $attachment_title = sanitize_file_name( pathinfo( $file_name, PATHINFO_FILENAME ) );
        $wp_upload_dir = wp_upload_dir();

        $post_info = array(
            'guid'				=> $wp_upload_dir['url'] . '/' . $file_name,
            'post_mime_type'	=> $file_type['type'],
            'post_title'		=> $attachment_title,
            'post_content'		=> '',
            'post_status'		=> 'inherit',
        );

        // Create the attachment
        $attach_id = wp_insert_attachment( $post_info, $file_path );

        // Include image.php
        require_once( ABSPATH . 'wp-admin/includes/image.php' );

        // Define attachment metadata
        $attach_data = wp_generate_attachment_metadata( $attach_id, $file_path );

        // Assign metadata to attachment
        wp_update_attachment_metadata( $attach_id,  $attach_data );

        // Update initial values
        if($id) {
            update_post_meta( $attach_id, 'original_id', $id);
        }

        update_post_meta( $attach_id, 'original_url', $url);

        return $attach_id;
    }

    private function findImageUrls($content, $source = ''){
        $urls1 = $unique_array = array();
        preg_match_all('/<img[^>]*srcset=["\']([^"\']*)[^"\']*["\'][^>]*>/i', $content, $srcsets, PREG_SET_ORDER);
        if (count($srcsets) > 0) {
            $count = 0;
            foreach ($srcsets as $key => $srcset) {
                preg_match_all('/[^\s,]+/i', $srcset[1], $srcsetUrls, PREG_SET_ORDER);
                if (count($srcsetUrls) == 0) {
                    continue;
                }
                foreach ($srcsetUrls as $srcsetUrl) {
                    $urls1[$count][] = $srcset[0];
                    $urls1[$count][] = $srcsetUrl[0];
                    $count++;
                }
            }
        }

        preg_match_all('/<img[^>]*src=["\']([^"\']*)[^"\']*["\'][^>]*>/i', $content, $urls, PREG_SET_ORDER);
        $urls = array_merge($urls, $urls1);


        foreach ($urls as $index => &$url) {
            if(!$this->isAbsoluteUrl($url[1]))
                $url[1] = $this->getSiteUrl() . $url[1];
        }

        if($source){
            foreach ($urls as $index => &$url) {
                if(strpos($url[1], $source) === false)
                    unset($urls[$index]);
            }
        }

        if (count($urls) == 0) {
            return array();
        }

        foreach ($urls as $index => &$url) {
            $images[$index]['alt'] = preg_match('/<img[^>]*alt=["\']([^"\']*)[^"\']*["\'][^>]*>/i', $url[0], $alt) ? $alt[1] : null;
            $images[$index]['url'] = $url = $url[1];
        }
        foreach (array_unique($urls) as $index => $url) {
            $unique_array[] = $images[$index];
        }
        return $unique_array;
    }

    function findPdfUrls($content, $source = ''){
        $urls = $unique_array = $pdfs =array();
        preg_match_all('/((https?:\/\/)?(www\.)?([\da-z\.-]+)\.([a-z\.]{2,6}))?\/[\w \.\-\/\d]+?\.pdf/i', $content, $urls, PREG_SET_ORDER);


        if (count($urls) == 0) {
            return array();
        }

        foreach ($urls as $index => &$url) {
            if(!$this->isAbsoluteUrl($url[0]))
                $url[0] = $this->getSiteUrl() . $url[0];
        }

        if($source){
            foreach ($urls as $index => &$url) {
                if(strpos($url[0], $source) === false)
                    unset($urls[$index]);
            }
        }


        foreach ($urls as $index => &$url) {
            $pdfs[$index]['url'] = $url = $url[0];
        }
        foreach (array_unique($urls) as $index => $url) {
            $unique_array[] = $pdfs[$index];
        }

        return $unique_array;
    }

    private function isAbsoluteUrl($url)
    {
        $pattern = "/^(?:ftp|https?|feed)?:?\/\/(?:(?:(?:[\w\.\-\+!$&'\(\)*\+,;=]|%[0-9a-f]{2})+:)*
        (?:[\w\.\-\+%!$&'\(\)*\+,;=]|%[0-9a-f]{2})+@)?(?:
        (?:[a-z0-9\-\.]|%[0-9a-f]{2})+|(?:\[(?:[0-9a-f]{0,4}:)*(?:[0-9a-f]{0,4})\]))(?::[0-9]+)?(?:[\/|\?]
        (?:[\w#!:\.\?\+\|=&@$'~*,;\/\(\)\[\]\-]|%[0-9a-f]{2})*)?$/xi";

        return (bool) preg_match($pattern, $url);
    }

}
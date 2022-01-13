<?php

namespace NRDQ_Dash;

defined('ABSPATH') or die('No script kiddies please!');

/**
 * Helper class for accessing and altering the database
 *
 */

class XML
{

    private static function array_to_xml($root, &$xml_data)
    {
        foreach ($root as $key => $value) {
            if (is_numeric($key)) {
                $key = 'item';
            }
            
            if(is_numeric(substr($key, 0, 1))) {
	            $key = 'item-' . $key;
            }
            
            $key = preg_replace('/[^0-9\-\_A-Za-z\.]/', '', $key);
            
            if (is_array($value)) {
                $subnode = $xml_data->addChild($key);
                self::array_to_xml($value, $subnode);
            } else {
                $xml_data->addChild("$key", htmlspecialchars("$value"));
            }
        }
    }

    private static function check_define($define, $default = 'undefined')
    {
        if (defined($define)) {
            if (!is_bool(constant($define))) {
                return constant($define);
            }
            if (constant($define)) {
                return 'true';
            } else {
                return 'false';
            }
        } else {
            return $default;
        }
    }

    private static function write_xml($array)
    {
        $xml_data = new \SimpleXMLElement('<?xml version="1.0"?><data></data>');
        self::array_to_xml($array, $xml_data);

        echo $xml_data->asXML();
        exit();
    }

    private static function get_maps_api_key()
    {
        $data = array();

        $data['define'] = self::check_define('GOOGLE_MAPS_API_KEY', '');
        if (function_exists('acf_get_setting')) {
            $data['acf'] = acf_get_setting('google_api_key');
        }
        return $data;
    }

    private static function get_all_themes()
    {
        $data = array();
        $current_theme = wp_get_theme();
        $themes = wp_get_themes(array('errors' => null, 'allowed' => null));
        foreach ($themes as $slug => $theme) {
            $data []= array(
            'name'          => $theme->get('Name'),
            'slug'			=> $slug,
            'uri'           => $theme->get('ThemeURI'),
            'description'   => $theme->get('Description'),
            'parent'        => ($theme->parent()) ? $theme->parent()->get('Name') : '',
            'version'       => $theme->get('Version'),
            'status'        => $theme->get('Status'),
            'active'        => ($theme->get('Name') === $current_theme->get('Name')) ? 'true' : 'false',
            'screenshot'    => $theme->get_screenshot(),
            'files'         => $theme->get_files(),
            );
        }
        return $data;
    }

    private static function get_all_plugins()
    {
        $data = array();
        if ( ! function_exists( 'get_plugins' ) ) {
		    require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
        
        $plugins = get_plugins();
        foreach ($plugins as $path => $plugin) {
            $data []= array(
            'name'          => $plugin['Name'],
            'uri'           => $plugin['PluginURI'],
            'path'          => $path,
            'author'        => $plugin['Author'],
            'version'       => $plugin['Version'],
            'active'        => (is_plugin_active($path)) ? 'true' : 'false'
            );
        }
        return $data;
    }

    private static function get_all_users()
    {
        $data = array();
		$users = count_users();
		
		$data['total_users'] = $users['total_users'];

        foreach($users['avail_roles'] as $role => $count){
	        $data []= array(
            'role'        => $role,
            'count'        => $count
            );
        }

        return $data;
    }
    
    private static function get_all_post_types()
    {
        $data = array();
        $args = array(
        'public'   => true,
        '_builtin' => true
        );

        $post_types = get_post_types($args, OBJECT);
        foreach ($post_types as $type) {
            $count = wp_count_posts($type->name);
            $data []= array(
            'slug'        => $type->name,
            'name'        => $type->labels->name,
            'draft'       => $count->draft,
            'published'   => $count->publish
            );
        }
        return $data;
    }

    public static function nrdq_generate_status_xml()
    {
        setlocale(LC_TIME, 'NL_nl');
        global $wpdb;        
        $root = array(
        'site'          => array(
        'name'                => get_bloginfo('name'),
        'description'		  => get_bloginfo('description'),
        'url'                 => get_bloginfo('url'),
        'admin_email'		  => get_bloginfo('admin_email'),
        'version'			  => get_bloginfo('version'),
        'rss2_url'			  => get_bloginfo('rss2_url'),
        'language'			  => get_bloginfo('language'),
        'public'			  => (get_option( 'blog_public' )) ? 'true' : 'false',
        'login_url'			  => wp_login_url(),
        'wpdb_prefix'		  => $wpdb->prefix,
        'multisite'           => (is_multisite()) ? 'true' : 'false',
        'auto_update_core'    => self::check_define('WP_AUTO_UPDATE_CORE', 'disabled'),
        'auto_update_disabled'=> self::check_define('AUTOMATIC_UPDATER_DISABLED', 'enabled'),
        'wp_debug'            => self::check_define('WP_DEBUG', 'disabled'),
        'revisions'           => self::check_define('WP_POST_REVISIONS', 'true'),
        'autosave'            => self::check_define('AUTOSAVE_INTERVAL', '60'),
        ),
        'meta'          => array(
        'generated_timestamp' => time(),
        ),
        'server'          => array(
	    'host'					  => gethostbyaddr(gethostbyname(preg_replace('/http[s]?\:\/{2}/', '', home_url()))),
        'name'                    => $_SERVER['SERVER_NAME'],
        'software'                => $_SERVER['SERVER_SOFTWARE'],
        'protocol'                => $_SERVER['SERVER_PROTOCOL'],
        'ip'                      => $_SERVER['SERVER_ADDR'],
        'encoding'                => $_SERVER['HTTP_ACCEPT_ENCODING'],
        'php'                     => phpversion(),
        'php_memory'              => return_bytes(ini_get('memory_limit')),
        'php_post_max_size'       => return_bytes(ini_get('post_max_size')),
        'php_max_execution_time'  => ini_get('max_execution_time') . 's',
        'php_upload_max_filesize' => return_bytes(ini_get('upload_max_filesize')),
        'mysql'                   => $wpdb->db_version(),
        ),
        'themes'          => self::get_all_themes(),
        'plugins'         => self::get_all_plugins(),
        'post_types'      => self::get_all_post_types(),
        'users'			  => self::get_all_users(),
        'other'         => array(
        'google_maps'   => self::get_maps_api_key()
        )
        );
        self::write_xml($root);
    }
}

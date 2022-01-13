<?php
/*
Plugin Name: ACF YOAST SEO Validation
Plugin URI: https://github.com/dachcom-digital/acf-yoast-seo-validation.git
Description: Add a YOAST SEO (3+) Validation to ACF.
Version: 5.3.5
Author: Stefan Hagspiel
Author URI: http://www.dachcom.com
Copyright: DACHCOM.DIGITAL, Stefan Hagspiel
*/


Class AcfYoastSeoValidator {

    public function __construct() {
      
      require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';  
      
      $check_for_updates = Puc_v4_Factory::buildUpdateChecker(
      	'http://update.nrdq.nl/wp-update-server/?action=get_metadata&slug=acf-yoast-seo-validation-master', //Metadata URL.
      	__FILE__, //Full path to the main plugin file.
      	'acf-yoast-seo-validation-master' //Plugin slug. Usually it's the same as the name of the directory.
      );

      add_action( 'admin_enqueue_scripts',  array($this, 'bind_js'));


    }

    public static function bind_js() {

        if (defined('WPSEO_VERSION')) {
            wp_enqueue_script('acf_yoast_seo_validator', plugin_dir_url( __FILE__ ) . 'assets/js/acf_yoast.js', false, false, true);
        }
    }
}

$cl = new AcfYoastSeoValidator();

<?php

namespace NRDQ_Cookie;


defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Helper class for rendering the views of the plugin
 *
 */


class View {

	static public function render($data, $type, $file){
    $m = new \Mustache_Engine(array(
			'helpers' => array(
        'i18n' => function($text) {
            return __($text, 'nrdq-cookie');
        },
        'view_sanitize_title' => function($text) {
            return sanitize_title($text);
        },
        'wp_editor' => function($id){
          wp_editor( '', $id, array( 'media_buttons' => false, 'wpautop' => false ) );
        },
        'check_level' => function($val, \Mustache_LambdaHelper $helper){

          if(is_numeric($val)){
            if(isset($_COOKIE['cookie_settings'])){
              $cookies = \NRDQ_Cookie_Controller::break_cookie($_COOKIE['cookie_settings']);
              if($cookies['level'] == $val){
                return 'checked';
              }
            } elseif($level == 0){
              return 'checked';
            }
            return '';
          }

          $val = $helper->render($val);

          if(isset($_COOKIE['cookie_settings'])){
            $cookies = \NRDQ_Cookie_Controller::break_cookie($_COOKIE['cookie_settings']);
            if($cookies[$val] == 'true'){
              return 'checked';
            }
          }
          return '';
        },
        'active_tab' => function($tab){
          if((isset($_GET['tab']) && $tab == $_GET['tab']) || (!isset($_GET['tab']) && $tab == 'settings')){
            return 'nav-tab-active';
          }
          return '';
        }
			),
    ));
    $template = file_get_contents(plugin_dir_path( __DIR__ ) . 'views/' . $type . '/' . $file . '.html');
    
    //Add PRO setting to data
    $data['nrdq_cookie_is_pro'] = (defined('NRDQ_COOKIE_IS_PRO') && NRDQ_COOKIE_IS_PRO);   
    return $m->render($template, $data);
	}

}

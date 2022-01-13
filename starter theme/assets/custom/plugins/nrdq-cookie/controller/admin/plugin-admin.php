<?php

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Class which contains the functionality that is required
 * in the admin part of the plugin
 *
 */

class NRDQ_Cookie_Admin extends NRDQ_Cookie_Controller{

	private $plugin_admin_credentials;

	private $admin_notices;




	public function run(){

		$this->add_admin_hooks();

	}



	private function add_admin_hooks(){
		add_action( 'admin_menu', array($this, 'add_admin_pages') );
		add_action( 'plugins_loaded', array($this, 'set_types_enabled_on_update'), 99 );
	}

	public function add_admin_pages(){
		$this->plugin_admin_credentials = apply_filters('nrdq_cookie_permissions', 'manage_options');
		if (apply_filters('nrdq_show_admin_pages', true))
			add_menu_page( $this->get_formal_name(), "Cookiemelding", $this->plugin_admin_credentials, "nrdq-cookie-notice", array($this, 'router'), 'dashicons-warning');
	}

	public function router($posted = false){
    $result = '';
    $fn = 'page_' . $this->get('subpage', 'index');

    if (method_exists($this, $fn)) {
        $result = $this->$fn();
    }

    echo $result;

	}

	private function save($page){
  	$fields = array(
    	'nrdq_cookie_hidden' => 'settings',
    	'nrdq_cookie_position'=> 'settings',
    	'nrdq_cookie_ajax' => 'settings',
    	'nrdq_cookie_debug'=> 'settings',
    	'nrdq_cookie_ip'=> 'settings',
    	'nrdq_cookie_text'=> 'texts-notice',
    	'nrdq_cookie_title'=> 'texts-notice',  
    	'nrdq_cookie_save' => 'texts-notice', 
    	'nrdq_cookie_allow' => 'texts-notice',
    	'nrdq_cookie_disallow' => 'texts-notice',	
    	'nrdq_cookie_settings_text'=> 'texts-popup',
    	'nrdq_cookie_settings_title'=> 'texts-popup',  
    	'nrdq_cookie_settings_save' => 'texts-popup', 
    	'nrdq_cookie_settings_allow' => 'texts-popup',
    	'nrdq_cookie_settings_disallow' => 'texts-popup',	
    	'nrdq_cookie_type_functional' => 'cookie-types',
    	'nrdq_cookie_type_analytics' => 'cookie-types',
    	'nrdq_cookie_type_social' => 'cookie-types',
    	'nrdq_cookie_type_ads' => 'cookie-types',
  	);

		foreach($fields as $value => $tab){
  		if($tab != $page) continue;
  		if(isset($_POST[$value]) && !empty($_POST[$value])) {
		    update_option($this->language_code . $value, stripslashes($_POST[$value]));
      } else {
        update_option($this->language_code . $value, '');
      }
		}
		$this->add_admin_notice('success', 'Instellingen opgeslagen');
	}

	public function page_index(){
  	if(isset($_POST['submit'])){
    	$page = (isset($_GET['tab'])) ? $_GET['tab'] : 'settings';
			$this->save($page);
		}

		$data = array(
		  'plugin_name' => $this->plugin_name,
		  'nrdq_cookie_hidden' => (get_option($this->language_code . 'nrdq_cookie_hidden', "0") == '1') ? 'checked' : '',
		  'nrdq_cookie_position' => array(
  		  'top' => (get_option($this->language_code . 'nrdq_cookie_position', "0") == 'top') ? 'checked' : '',
  		  'bottom' => (get_option($this->language_code . 'nrdq_cookie_position', "0") == 'bottom') ? 'checked' : ''
		  ),
		  'nrdq_cookie_ajax' => (get_option($this->language_code . 'nrdq_cookie_ajax', "0") == '1') ? 'checked' : '',
		  'nrdq_cookie_debug' => (get_option($this->language_code . 'nrdq_cookie_debug', "0") == '1') ? 'checked' : '',
		  'nrdq_cookie_ip' => get_option($this->language_code . 'nrdq_cookie_ip', ""), 
		  'nrdq_cookie_title' => get_option($this->language_code . 'nrdq_cookie_title', ""),
		  'nrdq_cookie_text' => get_option($this->language_code . 'nrdq_cookie_text', ""),
		  'nrdq_cookie_save' => get_option($this->language_code . 'nrdq_cookie_save', ""),
    	'nrdq_cookie_allow' => get_option($this->language_code . 'nrdq_cookie_allow', ""),
    	'nrdq_cookie_disallow' => get_option($this->language_code . 'nrdq_cookie_disallow', ""),
		  'nrdq_cookie_settings_text' => get_option($this->language_code . 'nrdq_cookie_settings_text', ""),
		  'nrdq_cookie_settings_title'=> get_option($this->language_code . 'nrdq_cookie_settings_title', ""),
    	'nrdq_cookie_settings_save' => get_option($this->language_code . 'nrdq_cookie_settings_save', ""), 
    	'nrdq_cookie_settings_allow' => get_option($this->language_code . 'nrdq_cookie_settings_allow', ""),
    	'nrdq_cookie_settings_disallow' => get_option($this->language_code . 'nrdq_cookie_settings_disallow', ""),
    	'nrdq_cookie_type_functional' => (get_option($this->language_code . 'nrdq_cookie_type_functional', "0") == '1') ? 'checked' : '',
    	'nrdq_cookie_type_analytics' => (get_option($this->language_code . 'nrdq_cookie_type_analytics', "0") == '1') ? 'checked' : '',
    	'nrdq_cookie_type_social' => (get_option($this->language_code . 'nrdq_cookie_type_social', "0") == '1') ? 'checked' : '',
    	'nrdq_cookie_type_ads' => (get_option($this->language_code . 'nrdq_cookie_type_ads', "0") == '1') ? 'checked' : '',
		);
				
		if(isset($_GET['tab']) && !empty($_GET['tab'])){
  		$content = \NRDQ_Cookie\View::render(compact('data', 'notice'), 'admin', 'index-' . $_GET['tab']);
		} else {
  		$content = \NRDQ_Cookie\View::render(compact('data', 'notice'), 'admin', 'index-settings');
		}

		$notice = $this->retrieve_admin_notices();

		return \NRDQ_Cookie\View::render(compact('notice', 'content'), 'admin', 'index');
	}

	private function retrieve_admin_notices(){
		$notices = $this->admin_notices;
		$this->admin_notices = array();
		return $notices;
	}

	public function add_admin_notice($type, $text){
		$notice = array();
		$notice['notice'] = true;
		$notice['notice_type'] = $type;
		$notice['notice_text'] = $text;
		$this->admin_notices []= $notice;
	}
	
	public function set_types_enabled_on_update(){
  	if(!get_option($this->language_code . 'nrdq_cookie_update_set_variables') || get_option($this->language_code . 'nrdq_cookie_update_set_variables') != 'true'){
    	update_option($this->language_code . 'nrdq_cookie_type_analytics', '1');
    	update_option($this->language_code . 'nrdq_cookie_type_social', '1');
    	update_option($this->language_code . 'nrdq_cookie_type_ads', '1');
    	update_option($this->language_code . 'nrdq_cookie_update_set_variables', 'true');
  	}
	}

}

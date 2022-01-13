<?php 
	
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Class which contains the functionality that is required
 * in the public part of the plugin
 *
 */

class NRDQ_Dash_Controller {
	
	protected $plugin_name;
	protected $version;
	
	function __construct($plugin_name, $version){
		$this->plugin_name = $plugin_name;
		$this->version = $version;
		$this->enqueue_custom_files();
	}
	
	public function get($var, $default_value = ''){
    return isset($_GET[$var]) ? $_GET[$var] : $default_value;
  }
  
  public function get_formal_name(){
	  return ucfirst(str_replace('_', ' ', $this->plugin_name));
	}
  
  private function enqueue_custom_files(){
	  if(NRDQ_DASH_ADMIN_CSS_REQUIRED) add_action( 'admin_enqueue_scripts', array($this, 'add_admin_styles') );	 
		if(NRDQ_DASH_ADMIN_JS_REQUIRED) add_action( 'admin_enqueue_scripts', array($this, 'add_admin_scripts'));
		if(NRDQ_DASH_CSS_REQUIRED) add_action( 'wp_enqueue_scripts', array($this, 'add_frontend_styles') );	 
	  if(NRDQ_DASH_JS_REQUIRED) add_action( 'wp_enqueue_scripts', array($this, 'add_frontend_scripts') );
  }
  
  public function add_admin_scripts($val){
		wp_enqueue_script( $this->plugin_name . "_admin", plugin_dir_url( __DIR__  ) . 'includes/js/custom-admin.js', array( 'jquery' ), $this->version, false );
	}
	
	public function add_admin_styles($val){
		wp_enqueue_style( $this->plugin_name . "_admin", plugin_dir_url( __DIR__  ) . 'includes/css/custom-admin.css', array(), $this->version, 'all' );
	}
	

	public function add_frontend_scripts(){
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __DIR__  ) . 'includes/js/custom.js', array( 'jquery' ), $this->version, false );
	}
	
	public function add_frontend_styles(){
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __DIR__  ) . 'includes/css/custom.css', array(), $this->version, 'all' );
	}


	
}
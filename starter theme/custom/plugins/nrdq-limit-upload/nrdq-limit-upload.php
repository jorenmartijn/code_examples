<?php
/*
Plugin Name: Nordique Limit Media Upload Size
Version:1.0
Plugin URI: https://www.nordique.nl
Description: With this plugin you can control the maximum size of media uploads.
Author: Jelte Hoving
Author URI: https://www.nordique.nl
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: nrdq
*/

/**
 * Start the plugin, register the activation and deactivation hooks.
 * See config.php for the configuration options for this plugin
 *
 */

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

class NRDQ_LimitUploadSize {
	
	const plugin_name = "NRDQ_LimitUploadSize";
	
	const version = "1.0";
	
	
	private $plugin_path;
	
	
	function __construct(){
		$this->plugin_path = plugin_dir_path( __FILE__ );
	}

	/**
	 * The main function of the plugin. It loads the base classes and starts
	 * the main functions of the admin and front-end classes
	 *
	 */

	public function run() {
		
		$this->require_base_classes();
		
		register_activation_hook( __FILE__, array( $this, 'activate_NRDQ_LimitUploadSize' ));
		register_deactivation_hook( __FILE__, array( $this, 'deactivate_NRDQ_LimitUploadSize' ) );
		
		//Initialize Admin Plugin part
		if (NRDQ_LIMITUPLOADSIZE_ADMIN_REQUIRED && is_admin()) {
			$plugin_admin = new NRDQ_LimitUploadSize_Admin(self::plugin_name, self::version);	
			$plugin_admin->run();
		}
  }
  
  
  private function require_base_classes(){
	  
	  require_once $this->plugin_path . 'config.php';
	  
	  //Require helper and config files
	  if (is_admin()){
		  require_once $this->plugin_path . 'vendor/autoload.php';
		  
		  require_once $this->plugin_path . 'helpers/view.php';
			require_once $this->plugin_path . 'helpers/db.php';
		  
		  if (NRDQ_LIMITUPLOADSIZE_ENABLE_EMAIL) {
		  	require_once $this->plugin_path . 'helpers/email.php';
		  }
		  
		  //Require controller classes
		  require_once $this->plugin_path . 'controller/controller.php';
		  require_once $this->plugin_path . 'controller/admin/plugin-admin.php';
		  require_once $this->plugin_path . 'controller/front-end/plugin-public.php';
	  }
	}
  
  
  public function activate_NRDQ_LimitUploadSize() {
		require_once plugin_dir_path( __FILE__ ) . 'includes/plugin-activator.php';
		NRDQ_LimitUploadSize_Activator::activate();
	}
	
	
	public function deactivate_NRDQ_LimitUploadSize() {
		require_once plugin_dir_path( __FILE__ ) . 'includes/plugin-deactivator.php';
		NRDQ_LimitUploadSize_Deactivator::activate();
	}
}


function run_NRDQ_LimitUploadSize() {
	$plugin = new NRDQ_LimitUploadSize();
	$plugin->run();
}

run_NRDQ_LimitUploadSize();

?>

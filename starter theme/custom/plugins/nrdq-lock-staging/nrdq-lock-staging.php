<?php
/*
Plugin Name: Nordique Lock Staging
Version:1.2
Plugin URI: https://www.nordique.nl
Description: With this plugin the staging environment can be locked when migrating to the live server.
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

class NRDQ_LockStaging {
	
	const plugin_name = "NRDQ_LockStaging";
	
	const version = "1.2";
	
	
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
		$this->start_update_service();
		
		register_activation_hook( __FILE__, array( $this, 'activate_NRDQ_LockStaging' ));
		register_deactivation_hook( __FILE__, array( $this, 'deactivate_NRDQ_LockStaging' ) );
		
		//Initialize Admin Plugin part
		if (NRDQ_LOCKSTAGING_ADMIN_REQUIRED) {
			$plugin_admin = new NRDQ_LockStaging_Admin(self::plugin_name, self::version);	
			$plugin_admin->run();
		}
		
		//Initialize Public Plugin part
		if (NRDQ_LOCKSTAGING_FRONTEND_REQUIRED && !is_admin()) {
			$plugin_public = new NRDQ_LockStaging_Public(self::plugin_name, self::version);
			$plugin_public->run();		
		}
  }
  
  
  private function require_base_classes(){
	  
	  //Require helper and config files
		require_once $this->plugin_path . 'vendor/autoload.php';
	  require_once $this->plugin_path . 'config.php';
	  require_once $this->plugin_path . 'helpers/view.php';

	  //Require controller classes
	  require_once $this->plugin_path . 'controller/controller.php';
	  require_once $this->plugin_path . 'controller/admin/plugin-admin.php';
	  require_once $this->plugin_path . 'controller/front-end/plugin-public.php';

  }
  
  private function start_update_service(){
    $check_for_updates = Puc_v4_Factory::buildUpdateChecker(
    	'https://update.nrdq.nl/wp-update-server/?action=get_metadata&slug=nrdq-lock-staging',
    	__FILE__, 
    	'nrdq-lock-staging' 
    );
  }
  
  
  
  public function activate_NRDQ_LockStaging() {
		require_once plugin_dir_path( __FILE__ ) . 'includes/plugin-activator.php';
		NRDQ_LockStaging_Activator::activate();
	}
	
	
	public function deactivate_NRDQ_LockStaging() {
		require_once plugin_dir_path( __FILE__ ) . 'includes/plugin-deactivator.php';
		NRDQ_LockStaging_Deactivator::activate();
	}
}


function run_NRDQ_LockStaging() {
	$plugin = new NRDQ_LockStaging();
	$plugin->run();
}

run_NRDQ_LockStaging();

?>
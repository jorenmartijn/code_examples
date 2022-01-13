<?php
/*
Plugin Name: Nordique cookiemelding
Version: 3.1.10
Plugin URI: https://www.nordique.nl
Description: Deze plugin toont een cookiemelding die voldoet aan de AVG.
Author: Nordique
Author URI: https://www.nordique.nl
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: nrdq-cookie
Domain Path: /languages
*/

/**
 * Start the plugin, register the activation and deactivation hooks.
 * See config.php for the configuration options for this plugin
 *
 */

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

class NRDQ_Cookie {

	const plugin_name = "Nordique cookiemelding";

	const version = "3.1.10";


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
		add_action('init', array($this, 'nrdq_load_translations'));

		register_activation_hook( __FILE__, array( $this, 'activate_NRDQ_Cookie' ));
		register_deactivation_hook( __FILE__, array( $this, 'deactivate_NRDQ_Cookie' ) );

		//Initialize Admin Plugin part
		if (NRDQ_COOKIE_ADMIN_REQUIRED) {
			$plugin_admin = new NRDQ_Cookie_Admin(self::plugin_name, self::version);
			$plugin_admin->run();
		}

		//Initialize Public Plugin part
		if (NRDQ_COOKIE_FRONTEND_REQUIRED) {
			$plugin_public = new NRDQ_Cookie_Public(self::plugin_name, self::version);
			$plugin_public->run();
		}

  }


  private function require_base_classes(){



	  //Require helper and config files
	  require_once $this->plugin_path . 'vendor/autoload.php';
	  require_once $this->plugin_path . 'config.php';
	  require_once $this->plugin_path . 'helpers/view.php';
		require_once $this->plugin_path . 'helpers/db.php';
		require_once $this->plugin_path . 'helpers/api.php';

	  //Require controller classes
	  require_once $this->plugin_path . 'controller/controller.php';
	  require_once $this->plugin_path . 'controller/admin/plugin-admin.php';
	  require_once $this->plugin_path . 'controller/front-end/plugin-public.php';

	  //Require models when used within this plugin
	  if (NRDQ_COOKIE_MODELS_REQUIRED) {
		  require_once $this->plugin_path . 'model/model.php';
	  }

	  $check_for_updates = Puc_v4_Factory::buildUpdateChecker(
    	'http://update.nrdq.nl/wp-update-server/?action=get_metadata&slug=nrdq-cookie', //Metadata URL.
    	__FILE__, //Full path to the main plugin file.
    	'nrdq-cookie' //Plugin slug. Usually it's the same as the name of the directory.
    );

  }

  public function nrdq_load_translations(){
    load_plugin_textdomain( 'nrdq-cookie', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
  }


  public function activate_NRDQ_Cookie() {
		require_once plugin_dir_path( __FILE__ ) . 'includes/plugin-activator.php';
		NRDQ_Cookie_Activator::activate();
	}


	public function deactivate_NRDQ_Cookie() {
		require_once plugin_dir_path( __FILE__ ) . 'includes/plugin-deactivator.php';
		NRDQ_Cookie_Deactivator::activate();
	}
}


function run_NRDQ_Cookie() {
	$plugin = new NRDQ_Cookie();
	$plugin->run();
}

run_NRDQ_Cookie();

?>

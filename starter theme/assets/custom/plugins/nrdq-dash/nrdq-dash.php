<?php
/*
Plugin Name: Nordique Dash
Version: 1.2.11
Plugin URI: https://www.nordique.nl
Description: Met deze plugin worden een aantal statistieken opgehaald en standaardinstellingen geautomatiseerd
Author: Nordique
Author URI: https://www.nordique.nl
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: nrdq-dash
Domain Path: /languages
*/

/**
 * Start the plugin, register the activation and deactivation hooks.
 * See config.php for the configuration options for this plugin
 *
 */

defined('ABSPATH') or die('No script kiddies please!');

class NRDQ_Dash
{

    const plugin_name = "NRDQ_Dash";

    const version = "1.2.11";


    private $plugin_path;


    function __construct()
    {
        $this->plugin_path = plugin_dir_path(__FILE__);
    }

    /**
     * The main function of the plugin. It loads the base classes and starts
     * the main functions of the admin and front-end classes
     *
     */

    public function run()
    {

        $this->require_base_classes();
        $this->start_update_service();
        add_action('init', array($this, 'nrdq_load_translations'));

        register_activation_hook(__FILE__, array( $this, 'activate_NRDQ_Dash' ));
        register_deactivation_hook(__FILE__, array( $this, 'deactivate_NRDQ_Dash' ));

        //Initialize Admin Plugin part
        if (NRDQ_DASH_ADMIN_REQUIRED) {
            $plugin_admin = new NRDQ_Dash_Admin(self::plugin_name, self::version);
            $plugin_admin->run();
        }

        //Initialize Public Plugin part
        if (NRDQ_DASH_FRONTEND_REQUIRED) {
            $plugin_public = new NRDQ_Dash_Public(self::plugin_name, self::version);
            $plugin_public->run();
        }
    }


    private function require_base_classes()
    {

        //Require helper and config files
        require_once $this->plugin_path . 'vendor/autoload.php';
        require_once $this->plugin_path . 'config.php';
        require_once $this->plugin_path . 'helpers/view.php';
        require_once $this->plugin_path . 'helpers/db.php';
        require_once $this->plugin_path . 'helpers/xml.php';
        require_once $this->plugin_path . 'helpers/curl.php';
        require_once $this->plugin_path . 'helpers/logging.php';
        require_once $this->plugin_path . 'helpers/api.php';

        if (NRDQ_DASH_ENABLE_EMAIL) {
            require_once $this->plugin_path . 'helpers/email.php';
        }

        //Require controller classes
        require_once $this->plugin_path . 'controller/controller.php';
        require_once $this->plugin_path . 'controller/admin/plugin-admin.php';
        require_once $this->plugin_path . 'controller/front-end/plugin-public.php';
        require_once $this->plugin_path . 'controller/inc/class-utils.php';

        //Require models when used within this plugin
        if (NRDQ_DASH_MODELS_REQUIRED) {
            require_once $this->plugin_path . 'model/model.php';
        }
    }

    private function start_update_service()
    {
        $check_for_updates = Puc_v4_Factory::buildUpdateChecker(
            'https://update.nrdq.nl/wp-update-server/?action=get_metadata&slug=nrdq-dash',
            __FILE__,
            'nrdq-dash'
        );
    }

    public function nrdq_load_translations()
    {
        load_plugin_textdomain('nrdq-dash', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }

    public function activate_NRDQ_Dash($network_wide)
    {
        require_once plugin_dir_path(__FILE__) . 'includes/plugin-activator.php';
        NRDQ_Dash_Activator::activate($network_wide);
    }


    public function deactivate_NRDQ_Dash($network_wide)
    {
        require_once plugin_dir_path(__FILE__) . 'includes/plugin-deactivator.php';
        NRDQ_Dash_Deactivator::activate($network_wide);
    }
}


function run_NRDQ_Dash()
{
    $plugin = new NRDQ_Dash();
    $plugin->run();
}

run_NRDQ_Dash();
<?php

defined('ABSPATH') or die('No script kiddies please!');

/**
 * Class which contains the functionality that is required
 * in the admin part of the plugin
 *
 */

class NRDQ_Dash_Admin extends NRDQ_Dash_Controller
{

    private $plugin_admin_credentials;

    private $admin_notices;


    public function run()
    {

        $this->add_admin_hooks();
    }


    private function add_admin_hooks()
    {
        add_action('admin_menu', array($this, 'add_admin_pages'));

        add_action('activated_plugin', array($this, 'nrdq_log_plugin_activation'), 99, 2);
        add_action('deactivated_plugin', array($this, 'nrdq_log_plugin_deactivation'), 99, 2);
    }

    public function add_admin_pages()
    {
        $this->plugin_admin_credentials = apply_filters('nrdq_dash_permissions', 'manage_options');
        if (apply_filters('nrdq_show_admin_pages', true) && nrdq_dash_is_dev()) {
            add_menu_page($this->get_formal_name(), "Nordique Onderhoud", $this->plugin_admin_credentials, "nrdq-dash", array($this, 'router'), 'dashicons-admin-tools');
        }
    }

    public function router($posted = false)
    {
        $result = '';
        $fn = 'page_' . $this->get('subpage', 'index');

        if (method_exists($this, $fn)) {
            $result = $this->$fn();
        }

        echo $result;
    }

    public function page_index()
    {
        $data = array('plugin_name' => $this->plugin_name);
        $notice = $this->retrieve_admin_notices();

        return \NRDQ_Dash\View::render(compact('data', 'notice'), 'admin', 'index');
    }


  /*
  * Log plugin activation and deactivation actions in de options table
  *
  *
  */
    private function nrdq_log_plugin_action($action, $plugin, $network)
    {
        $plugin = preg_replace('/[^A-Za-z\_0-9\s]/', '', $plugin);
        update_option('NRDQ_Dash_plugin_' . $plugin, ($action == 'activation') ? 'active' : 'inactive', false);
        update_option('NRDQ_Dash_plugin_' . $plugin . '_network', $network, false);
        $data = get_option('NRDQ_Dash_plugin_' . $plugin . '_' . $action, array());
        $data []= array(
        'time'        => time(),
        'id'          => get_current_user_id(),
        'network'     => $network
        );
        update_option('NRDQ_Dash_plugin_' . $plugin . '_' . $action, $data, false);
    }

    public function nrdq_log_plugin_activation($plugin, $network_wide)
    {
        //General plugin info
        $network = ($network_wide) ? 'network' : 'single';
        $plugin_name = preg_replace('/\/(.*)$/', '', $plugin);
        $this->nrdq_log_plugin_action('activation', $plugin_name, $network);
    }

    public function nrdq_log_plugin_deactivation($plugin, $network_wide)
    {
        //General plugin info
        $network = ($network_wide) ? 'network' : 'single';
        $plugin_name = preg_replace('/\/(.*)$/', '', $plugin);
        $this->nrdq_log_plugin_action('deactivation', $plugin_name, $network);
    }



    private function retrieve_admin_notices()
    {
        $notices = $this->admin_notices;
        $this->admin_notices = array();
        return $notices;
    }

    public function add_admin_notice($type, $text)
    {
        $notice = array();
        $notice['notice'] = true;
        $notice['notice_type'] = $type;
        $notice['notice_text'] = $text;
        $this->admin_notices []= $notice;
    }
}

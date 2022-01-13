<?php 
	
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Class which contains the functionality that is required
 * in the admin part of the plugin
 *
 */

class NRDQ_LockStaging_Admin extends NRDQ_LockStaging_Controller{
	
	private $plugin_admin_credentials;
	
	private $admin_notices;
	
	
	public function run(){
				
		$this->add_admin_hooks();
		
		if (get_option('NRDQ_LockStaging_lock_state', false) && (!defined('NRDQ_LOCKSTAGING_DISABLED') || !NRDQ_LOCKSTAGING_DISABLED) && is_admin())
			$this->restrict_admin();
		
	}
	
	
	private function add_admin_hooks(){
		add_action( 'admin_menu', array($this, 'add_admin_pages') );
	}
	
	public function add_admin_pages(){
		$this->plugin_admin_credentials = apply_filters('nrdq_lockstaging_permissions', 'manage_options');
		if (apply_filters('nrdq_show_admin_pages', true))
			add_menu_page( $this->get_formal_name(), "Lock Staging", $this->plugin_admin_credentials, "lock-staging", array($this, 'router'), ((get_option('NRDQ_LockStaging_lock_state', false)) ? 'dashicons-lock' : 'dashicons-unlock'));
	}
	
	public function router($posted = false){
    $result = '';
    $fn = 'page_' . $this->get('subpage', 'index');
    
    if (method_exists($this, $fn)) {
        $result = $this->$fn();
    }

    echo $result;
    die();

	}
	
	public function restrict_admin(){
		
		$lock_type = get_option('NRDQ_LockStaging_lock_type');
		$fn = 'restrict_on_' . $lock_type;

    if (method_exists($this, $fn)) {
        $this->$fn();
    }
	}
	
	private function lock_redirect(){
		add_action('admin_init', function() {
			wp_logout();
			wp_redirect( home_url('/gesloten.html') ); 
			exit;
		});
		
	}

	
	private function restrict_on_ip_lock(){
		$ip_list = explode(',', get_option('NRDQ_LockStaging_lock_exceptions'));
		if (!in_array($_SERVER['REMOTE_ADDR'], $ip_list)){
			$this->lock_redirect();			
		}
	}
	
	private function restrict_on_role_lock(){
		add_action('init', function() {
			$role_list = get_option('NRDQ_LockStaging_lock_exceptions');
			$roles = wp_get_current_user()->roles;
			if (!array_intersect($role_list, $roles)){
				$this->lock_redirect();
			}		
		});
		
	}
	
	private function restrict_on_user_lock(){	
		add_action('init', function() {
			$id_list = get_option('NRDQ_LockStaging_lock_exceptions');
			$id = get_current_user_id();
			if (!in_array($id, $id_list)){
				$this->lock_redirect();
			}		
		});
	}
	
	private function create_html_file(){
		$html_file = fopen(get_home_path() . 'gesloten.html', "w") or die("Unable to open file!");
		$locked_content = get_option('NRDQ_LockStaging_locked_text');
		$html_data = \NRDQ_LockStaging\View::render(compact('locked_content'), 'front-end', 'locked');
		fwrite($html_file, $html_data);
	}
	
	
	private function set_lock_state(){
		$lock_state = get_option('NRDQ_LockStaging_lock_state', false);
		if (!$lock_state) {
    		
			update_option('NRDQ_LockStaging_lock_state', true);
			update_option('NRDQ_LockStaging_lock_type', $_POST['lock_type']);
			$exceptions = $_POST[$_POST['lock_type'] . '_exceptions'];
			
			if ($_POST['lock_type'] == "ip_lock")
				$exceptions = preg_replace('/[^A-Za-z0-9\.\,\:]/', '', $exceptions);
			update_option('NRDQ_LockStaging_lock_exceptions', $exceptions);
			
			$content = stripslashes($_POST['lock_content']);
			$content_bar = stripslashes($_POST['lock_bar_content']);
			update_option('NRDQ_LockStaging_locked_text', $content);
			update_option('NRDQ_LockStaging_locked_bar_text', $content_bar);
			
			$show_bar = (isset($_POST['NRDQ_LockStaging_visibility']) && $_POST['NRDQ_LockStaging_visibility'] == 'Yes') ? 1 : 0;
			update_option('NRDQ_LockStaging_visibility', $show_bar);			
			
			$this->create_html_file();
		} else {
			update_option('NRDQ_LockStaging_lock_state', false);
		}
		
	}
	
	public function page_index(){
				
		if(isset($_POST['save'])) {
			$this->set_lock_state();
		}
		
				
		$this->add_admin_notice('warning', "Let op: met deze plugin is het ook mogelijk om je eigen account of pc de toegang tot deze website te ontzeggen. Controleer goed of je de gegevens juist hebt ingevuld.");
		$exceptions = get_option('NRDQ_LockStaging_lock_exceptions', false);
		
		$lock_type = get_option('NRDQ_LockStaging_lock_type', "");
		$data = array('plugin_name' => $this->plugin_name, 'locked' => get_option('NRDQ_LockStaging_lock_state', false));
		if (get_option('NRDQ_LockStaging_lock_state', false)) {
			$this->add_admin_notice('info', "Unlock staging om de instellingen aan te passen.");
		}
		
		$show_bar = get_option('NRDQ_LockStaging_visibility', true);
		
		$cur_object = $this;
		
		$users = get_users();
				
		foreach ($users as $user){
			$user->selected = (is_array($exceptions)) ? in_array($user->ID, $exceptions) : false;
		}
		
		$roles = get_editable_roles();
	
		foreach($roles as $role => $val){
			$single_role = array('role' => $role, 'name' => $val['name'], 'selected' => ((is_array($exceptions)) ? in_array($role, $exceptions) : false));
			$user_roles []= $single_role;
		}
		
		
		$lock = array();
	
		switch ($lock_type) {
			case 'ip_lock':
				$lock['ip_lock'] = true;
				$lock['ip_lock_exceptions'] = $exceptions;
				break;
			case 'role_lock':
				$lock['role_lock'] = true;
				foreach($exceptions as $exception){
					$lock[$exception] = true;
				}
				break;
			case 'user_lock':
				$lock['user_lock'] = true;
				foreach($exceptions as $exception){
					$lock[$exception] = true;
				}
				break;
		}
				
		$lock_content = get_option('NRDQ_LockStaging_locked_text');
		$lock_bar_content = get_option('NRDQ_LockStaging_locked_bar_text');
		
		$current_ip = $_SERVER['REMOTE_ADDR'];
						
		$notice = $this->retrieve_admin_notices();
				
		return \NRDQ_LockStaging\View::render(compact('data', 'cur_object', 'notice', 'users', 'user_roles', 'lock_content', 'lock_bar_content', 'lock', 'current_ip', 'show_bar'), 'admin', 'index');
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

}
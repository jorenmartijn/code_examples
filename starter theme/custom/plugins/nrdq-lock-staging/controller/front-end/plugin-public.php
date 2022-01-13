<?php 
	
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Class which contains the functionality that is required
 * in the public part of the plugin
 *
 */

class NRDQ_LockStaging_Public extends NRDQ_LockStaging_Controller {
	
	public function run(){
		
		add_action( 'login_enqueue_scripts', array($this, 'add_frontend_styles') );
		
 		if (get_option('NRDQ_LockStaging_lock_state', false))
			$this->add_notice_bar();
	}
	

	public function add_notice_bar(){
    	if(get_option('NRDQ_LockStaging_visibility', false)){
            add_action('wp_footer', function() {
    			$locked_bar_content = get_option('NRDQ_LockStaging_locked_bar_text');
    			echo \NRDQ_LockStaging\View::render(compact('locked_bar_content'), 'front-end', 'notice-bar');
    		});	
    	}

		add_action('login_footer', function() {
			$locked_bar_content = get_option('NRDQ_LockStaging_locked_bar_text');
			echo \NRDQ_LockStaging\View::render(compact('locked_bar_content'), 'front-end', 'notice-bar');
		});			
	}	
}
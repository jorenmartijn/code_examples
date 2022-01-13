<?php 
	
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );


/**
 * Class which contains the functionality that is required
 * when activating the plugin
 *
 */

class NRDQ_LockStaging_Activator {
	
	public static function activate(){
		
		update_option('NRDQ_LockStaging', 'active');
		update_option('NRDQ_LockStaging_last_activation_time', time());
		update_option('NRDQ_LockStaging_last_user_activated_id', get_current_user_id());
		update_option('NRDQ_LockStaging_locked_text','Dit is de testomgeving! Hier kunnen op het moment geen wijzigingen gedaan worden.');
		update_option('NRDQ_LockStaging_locked_bar_text','Dit is de testomgeving! Hier kunnen op het moment geen wijzigingen gedaan worden.');
	}
}
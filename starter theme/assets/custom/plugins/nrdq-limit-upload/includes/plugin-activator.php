<?php 
	
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );


/**
 * Class which contains the functionality that is required
 * when activating the plugin
 *
 */

class NRDQ_LimitUploadSize_Activator {
	
	public static function activate(){
		
		update_option('NRDQ_LimitUploadSize', 'active');
		update_option('NRDQ_LimitUploadSize_last_activation_time', time());
		update_option('NRDQ_LimitUploadSize_last_user_activated_id', get_current_user_id());
		if (!get_option('NRDQ_LimitUploadSize_last_user_activated_id_size'))
			update_option('NRDQ_LimitUploadSize_size', 64);
	}
}
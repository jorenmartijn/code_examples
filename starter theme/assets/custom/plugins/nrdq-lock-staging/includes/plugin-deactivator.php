<?php 

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );
	
/**
 * Class which contains the functionality that is required
 * when deactivating the plugin
 *
 */
 
class NRDQ_LockStaging_Deactivator {
	
	public static function activate(){
		delete_option('NRDQ_LockStaging');
		update_option('NRDQ_LockStaging_last_deactivation_time', time());
		update_option('NRDQ_LockStaging_last_user_deactivated_id', get_current_user_id());
	}
}
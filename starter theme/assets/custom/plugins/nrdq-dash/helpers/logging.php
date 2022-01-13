<?php 
	
namespace NRDQ_Dash;
	
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Helper class for downloading files
 *
 */
 

class Logging {
	
	public static function db_log($action, $user_id, $message){
		global $wpdb;
		$wpdb->insert(
			'wpn_nrdq_dash_db_log', 
			array( 
				'action' => $action, 
				'user' => $user_id,
				'message' => $message,
				'time' => date_i18n('Y-m-d H:i:s')
			), 
			array( 
				'%s', 
				'%d',
				'%s',
				'%s' 
			) 			
		);
	}
	
}
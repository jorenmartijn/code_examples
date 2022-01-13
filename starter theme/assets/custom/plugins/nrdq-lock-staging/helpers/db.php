<?php 
	
namespace NRDQ_LockStaging;
	
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Helper class for accessing and altering the database
 *
 */
 
class DB {
	
	static public function wpdb(){
      global $wpdb;
      return $wpdb;
  }
	
	static public function create_table($custom_table_name, $custom_table_data){
		$table_name = self::wpdb()->prefix . $custom_table_name;
	
		$charset_collate = self::wpdb()->get_charset_collate();
		
		$sql = "CREATE TABLE $table_name (" . $custom_table_data . ") $charset_collate;";
		
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );
	}
	
	static public function get_result($custom_sql){
		return self::wpdb()->get_var($custom_sql);
	}
	
	static public function get_multiple_results($custom_sql){
		return self::wpdb()->get_results($custom_sql, ARRAY_A);
	}
	
	static public function insert_or_update($custom_table_name, $custom_data, $custom_formats){
		self::wpdb()->replace( 
			self::wpdb()->prefix . $custom_table_name, 
			array( 
		    $custom_data
			), 
			array( 
		    $custom_formats
			) 
		);
	}
	
	static public function remove_table($custom_table_name){
		$sql = "DROP TABLE IF EXISTS " . self::wpdb()->prefix . $custom_table_name;
		self::wpdb()->query( $sql );
	}
		
}
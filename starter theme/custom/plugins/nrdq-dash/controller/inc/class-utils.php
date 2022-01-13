<?php 
	
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Class which contains the functionality that is required
 * in the public part of the plugin
 *
 */

class NRDQ_Dash_Utils {
	
  public static $instance;
  
  public static function get_instance() {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
	  
  private static function format_date($date, $format = 'j F Y'){
    $timestamp = strtotime($date);
    return date($format, $timestamp);
  }
  
  public static function str_lreplace($search, $replace, $subject){
    $pos = strrpos($subject, $search);

    if($pos !== false){
        $subject = substr_replace($subject, $replace, $pos, strlen($search));
    }

    return $subject;
  }
  
  public static function starts_with($haystack, $needle){
     $length = strlen($needle);
     return (substr($haystack, 0, $length) === $needle);
  }

  public static function ends_with($haystack, $needle){
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }
  
    return (substr($haystack, -$length) === $needle);
  }
  
  public static function get_dev_ip_whitelist(){
    if(defined('NRDQ_DASH_DEV_IP_WHITELIST')){
      return explode(',', NRDQ_DASH_DEV_IP_WHITELIST);
    }
    return array();
  }
  
  public static function db_log($action, $user_id, $message){
		\NRDQ_Dash\Logging::db_log($action, $user_id, $message);
	}
	
	
}
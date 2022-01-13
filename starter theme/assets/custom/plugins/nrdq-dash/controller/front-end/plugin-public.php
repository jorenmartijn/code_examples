<?php 
	
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Class which contains the functionality that is required
 * in the public part of the plugin
 *
 */

class NRDQ_Dash_Public extends NRDQ_Dash_Controller {
	
	public function run(){
		add_action('init', array($this, 'serve_data'));
	}
	
	public function serve_data(){
		$ip_whitelist = array(
			'185.67.203.210',
			'127.0.0.1',
			'2a05:1180:1:605:185:67:203:210'
		);
		
		$url_path = trim(parse_url(add_query_arg(array()), PHP_URL_PATH), '/');
		
		if($url_path === 'nrdq-dash-status' && $_SERVER['REQUEST_METHOD'] === 'GET') {
			if(!in_array($_SERVER['REMOTE_ADDR'], $ip_whitelist)) {
				\NRDQ_Dash\Logging::db_log('access_xml_blocked', 0, 'Access blocked to XML for IP: ' . $_SERVER['REMOTE_ADDR']);
				header('HTTP/1.0 403 Forbidden');
				exit; //just for good measure
			}
			
			define('DONOTCACHEPAGE', true);
			\NRDQ_Dash\XML::nrdq_generate_status_xml();
		}

	}

	
}
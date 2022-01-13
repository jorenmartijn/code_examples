<?php 

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );
	
/**
 * Class which contains the functionality that is required
 * when deactivating the plugin
 *
 */
 
class NRDQ_Dash_Deactivator {
	
	public static function activate($network_wide){
		delete_option('NRDQ_Dash');
		update_option('NRDQ_Dash_last_deactivation_time', time());
		update_option('NRDQ_Dash_last_user_deactivated_id', get_current_user_id());
		
		if ($network_wide) {
            $site_ids = \NRDQ_Dash\DB::wpdb()->get_col("SELECT blog_id FROM " . \NRDQ_Dash\DB::wpdb()->blogs . " WHERE site_id = " . \NRDQ_Dash\DB::wpdb()->siteid . ";");

            foreach ($site_ids as $site_id) {
                    switch_to_blog($site_id);
                    self::notify_dash();
                    restore_current_blog();
            }
        } else {
            self::notify_dash();
        }
		
	}
	
	public static function notify_dash() {
	    $xml = new SimpleXMLElement('<site/>');
	    $xml->addChild('site_id', md5(home_url()));
	    $xml->addChild('status', 'deactivate');
	    
	    $curl = new \NRDQ_Dash\Curl('https://dash.nrdq.nl/api/site.html');
	    $curl->setPost($xml->asXML());
	    $curl->createCurl();
    }
}
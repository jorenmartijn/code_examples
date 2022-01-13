<?php

defined('ABSPATH') or die('No script kiddies please!');


/**
 * Class which contains the functionality that is required
 * when activating the plugin
 *
 */

class NRDQ_Dash_Activator
{

    public static function activate($network_wide)
    {

        update_option('NRDQ_Dash', 'active');
        update_option('NRDQ_Dash_last_activation_time', time());
        update_option('NRDQ_Dash_last_user_activated_id', get_current_user_id());
        
        if ($network_wide) {
            $site_ids = \NRDQ_Dash\DB::wpdb()->get_col("SELECT blog_id FROM " . \NRDQ_Dash\DB::wpdb()->blogs . " WHERE site_id = " . \NRDQ_Dash\DB::wpdb()->siteid . ";");

            foreach ($site_ids as $site_id) {
                    switch_to_blog($site_id);
                    self::create_tables();
                    self::notify_dash();
                    restore_current_blog();
            }
        } else {
            self::create_tables();
            self::notify_dash();
        }
    }

    public static function create_tables()
    {

        \NRDQ_Dash\DB::create_table(
            'nrdq_dash_db_log',
            "
			  `id` bigint(20) NOT NULL AUTO_INCREMENT,
				 `action` varchar(50) DEFAULT NULL,
				 `user` bigint(20) DEFAULT NULL,
				 `message` longtext,
				 `time` datetime DEFAULT CURRENT_TIMESTAMP,
				 `systemmodstamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
				 PRIMARY KEY (`id`)
			"
        );
    }
    
    public static function notify_dash() {
	    $xml = new SimpleXMLElement('<site/>');
	    $xml->addChild('name', get_bloginfo('name'));
	    $xml->addChild('site_id', md5(home_url()));
	    $xml->addChild('url', home_url());
	    $xml->addChild('sync_url', home_url('/nrdq-dash-status'));
	    $xml->addChild('status', 'activate');
	    
	    $curl = new \NRDQ_Dash\Curl('https://dash.nrdq.nl/api/site.html');
	    $curl->setPost($xml->asXML());
	    $curl->createCurl();
    }
}

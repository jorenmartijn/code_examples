<?php

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );


/**
 * Class which contains the functionality that is required
 * when activating the plugin
 *
 */

class NRDQ_Cookie_Activator {

	public static function activate(){

		//General plugin info
		update_option('NRDQ_Cookie', 'active');
		update_option('NRDQ_Cookie_last_activation_time', time());
		update_option('NRDQ_Cookie_last_user_activated_id', get_current_user_id());

		//Setup
		$nrdq_hidden = '1';
		$nrdq_position = 'top';
		$nrdq_cookie_text = '<p>Deze website maakt gebruik van ‘cookies’. Dit doen we om een optimale gebruikerservaring te kunnen bieden. Met de cookies kunnen we de manier waarop de website wordt gebruikt vastleggen en analyseren. We willen hiermee de website optimaliseren voor een betere ervaring.</p>';
		$nrdq_settings_text = '<p>Deze website maakt gebruik van ‘cookies’. Dit doen we om een optimale gebruikerservaring te kunnen bieden. Met de cookies kunnen we de manier waarop de website wordt gebruikt vastleggen en analyseren. We willen hiermee de website optimaliseren voor een betere ervaring.

Hieronder kan je de cookie-instellingen aanpassen.</p>';

		update_option('nrdq_cookie_hidden', $nrdq_hidden);
		update_option('nrdq_cookie_position', $nrdq_position);
		update_option('nrdq_cookie_text',$nrdq_cookie_text);
		update_option('nrdq_cookie_settings_text', $nrdq_settings_text);

		if(function_exists('icl_get_languages')){
			$languages = icl_get_languages('skip_missing=0');
			foreach($languages as $lang){
				update_option($lang['code'] . '_nrdq_cookie_hidden', $nrdq_hidden);
				update_option($lang['code'] . '_nrdq_cookie_position', $nrdq_position);
				update_option($lang['code'] . '_nrdq_cookie_text', $nrdq_cookie_text);
				update_option($lang['code'] . '_nrdq_cookie_settings_text', $nrdq_settings_text);
			}
		}

	}
}

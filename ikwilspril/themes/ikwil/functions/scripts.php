<?php

// Generated content - DO NOT TOUCH
//--------------------

# BEGIN Google Maps Scripts

# END Google Maps Scripts

// Load CSS
//---------
function load_style()
{
	if (WP_LOCAL_SERVER || WP_STAGING_SERVER) {
		wp_register_style('client-stylesheet', WP_CONTENT_URL . '/build_ikwil/css/style.css', array(), substr(chunk_split((substr(filemtime(get_stylesheet_directory() . '/../../build_ikwil/css/style.css'), -3)), 1, '.'), 0, -1), 'all');
	} else {
		wp_register_style('client-stylesheet', WP_CONTENT_URL . '/build_ikwil/css/style.min.css', array(), substr(chunk_split((substr(filemtime(get_stylesheet_directory() . '/../../build_ikwil/css/style.min.css'), -3)), 1, '.'), 0, -1), 'all');
	}

	wp_register_style('font-awesome-stylesheet', 'https://pro.fontawesome.com/releases/v5.15.1/css/all.css');
	
	wp_enqueue_style('client-stylesheet');
	wp_enqueue_style('font-awesome-stylesheet');
}
add_action('wp_enqueue_scripts', 'load_style');


// Load JS
//--------
function load_scripts()
{

	// Enable newest jQuery V3
	if (!is_admin()) {
		wp_deregister_script('jquery');
		$pluginList = get_option('active_plugins');
		$in_footer = in_array('gravityforms/gravityforms.php', $pluginList) ? false : true;
		wp_register_script('jquery', ("https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js"), null, '3.5.1', $in_footer);
		wp_enqueue_script('jquery');
	}

	// main.min.js
	//------------
	if (WP_LOCAL_SERVER || WP_STAGING_SERVER) {
		wp_register_script('custom-js', WP_CONTENT_URL . '/build_ikwil/js/main.js', array('jquery'), substr(chunk_split((substr(filemtime(get_stylesheet_directory() . '/../../build_ikwil/js/main.js'), -3)), 1, '.'), 0, -1), true);
	} else {
		wp_register_script('custom-js', WP_CONTENT_URL . '/build_ikwil/js/main.min.js', array('jquery'), substr(chunk_split((substr(filemtime(get_stylesheet_directory() . '/../../build_ikwil/js/main.min.js'), -3)), 1, '.'), 0, -1), true);
	}

	//wp_register_script('font-awesome-js', WP_CONTENT_URL . '/build_ikwil/fontawesome/js/all.min.js');

	wp_localize_script('custom-js', 'ajax_object', array(
		'ajax_url'     => admin_url('admin-ajax.php'),
		'show_more'    => __('Toon meer', 'DEFINE_LANG') . '<i class="icon icon-plus"></i>',
		'show_less'    => __('Toon minder', 'DEFINE_LANG') . '<i class="icon icon-minus"></i>',
		'home_url'     => home_url('/')
	));


	wp_enqueue_script('custom-js');
	wp_enqueue_script('font-awesome-js');
}
add_action('wp_enqueue_scripts', 'load_scripts', 99);


// Defer Javascript loading
//-------------------------
function js_async_attr($tag)
{
	# Do not add defer or async attribute to these scripts
	$scripts_to_exclude = array('https://www.google.com/recaptcha/api.js');
	$pluginList = get_option('active_plugins');
	if (in_array('gravityforms/gravityforms.php', $pluginList)) {
		$scripts_to_exclude[] = 'jquery.min.js';
	}
	foreach ($scripts_to_exclude as $exclude_script) {
		if (true == strpos($tag, $exclude_script))
			return $tag;
	}
	# Defer or async all remaining scripts not excluded above
	return str_replace(' src', ' defer="defer" src', $tag);
}
if (!is_admin()) add_filter('script_loader_tag', 'js_async_attr', 10);


// Make pagespeed happy
//---------------------
function remove_style_id($link)
{
	return preg_replace("/ id='.*-css'/", "", $link);
}
add_filter('style_loader_tag', 'remove_style_id');

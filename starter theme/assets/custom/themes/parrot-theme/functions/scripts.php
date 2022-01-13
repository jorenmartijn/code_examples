<?php
// Load CSS
function load_style()
{
	if ( WP_LOCAL_SERVER || WP_STAGING_SERVER ) {
		wp_register_style( 'client-stylesheet', WP_CONTENT_URL .'/build/css/style.css', array(), substr(chunk_split((substr(filemtime(get_stylesheet_directory() . '/../../build/css/style.css'), -3)), 1, '.'), 0, -1), 'all' );
	} else {
		wp_register_style( 'client-stylesheet', WP_CONTENT_URL .'/build/css/style.min.css', array(), substr(chunk_split((substr(filemtime(get_stylesheet_directory() . '/../../build/css/style.min.css'), -3)), 1, '.'), 0, -1), 'all' );
	}
	wp_enqueue_style( 'client-stylesheet' );
}
add_action( 'wp_enqueue_scripts', 'load_style' );

// Load JS
function load_scripts() {

  // Enable newest jQuery V3
  if( !is_admin()){
  	wp_deregister_script('jquery');
    $in_footer = is_plugin_active( 'gravityforms/gravityforms.php' ) ? false : true;
  	wp_register_script('jquery', ("https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js"), null, '3.3.1', $in_footer);
  	wp_enqueue_script('jquery');


      wp_register_script( 'jquery-migrate', 'https://code.jquery.com/jquery-migrate-3.0.1.min.js', array('jquery'), '3.0.1', false );
      wp_enqueue_script('jquery-migrate');
  }

  // Google maps api
  wp_register_script( 'googlemaps-api-js', 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=' . GOOGLE_MAPS_API_KEY, array('jquery'), '', true );
  wp_enqueue_script( 'googlemaps-api-js' );

	// main.min.js
	if ( WP_LOCAL_SERVER || WP_STAGING_SERVER ) {
		wp_register_script( 'custom-js', WP_CONTENT_URL.'/build/js/main.js', array('jquery'), substr(chunk_split((substr(filemtime(get_stylesheet_directory() . '/../../build/js/main.js'), -3)), 1, '.'), 0, -1), true );
	} else {
		wp_register_script( 'custom-js', WP_CONTENT_URL.'/build/js/main.min.js', array('jquery'), substr(chunk_split((substr(filemtime(get_stylesheet_directory() . '/../../build/js/main.min.js'), -3)), 1, '.'), 0, -1), true );
	}
	wp_enqueue_script( 'custom-js' );

}
add_action( 'wp_enqueue_scripts', 'load_scripts', 99 );

// Defer Javascript loading
function js_async_attr($tag){
    # Do not add defer or async attribute to these scripts
    $scripts_to_exclude = array();
    if ( is_plugin_active( 'gravityforms/gravityforms.php' ) ) {
        $scripts_to_exclude[] = 'jquery.min.js';
    }
    foreach($scripts_to_exclude as $exclude_script){
        if(true == strpos($tag, $exclude_script ) )
            return $tag;
     }
    # Defer or async all remaining scripts not excluded above
    return str_replace( ' src', ' defer="defer" src', $tag );
}
if ( ! is_admin() ) add_filter( 'script_loader_tag', 'js_async_attr', 10 );

// Make pagespeed happy
function remove_style_id($link)
{
  return preg_replace("/ id='.*-css'/", "", $link);
}
add_filter('style_loader_tag', 'remove_style_id');


// Registers an editor stylesheet for the theme.
// ---------------------------------------------
//
// Adjust this function in the future.
// Add the stylesheet to Gulp, perhaps --production or --dashboard.
//
function theme_add_editor_styles() {
  if ( WP_LOCAL_SERVER || WP_STAGING_SERVER ) {
    add_editor_style( WP_CONTENT_URL.'/build/css/admin-style.css' );
  } else {
    add_editor_style( WP_CONTENT_URL.'/build/css/admin-style.css' );
  }
}
add_action( 'admin_init', 'theme_add_editor_styles' );

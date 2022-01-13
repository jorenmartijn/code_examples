function nrdq_scripts_google_maps_init() {
    wp_register_script( 'googlemaps-api-js', 'https://maps.googleapis.com/maps/api/js?v=3.exp&key={{key}}', array('jquery'), '', true );
    wp_enqueue_script( 'googlemaps-api-js' );
}

add_action( 'wp_enqueue_scripts', 'nrdq_scripts_google_maps_init', 999 );
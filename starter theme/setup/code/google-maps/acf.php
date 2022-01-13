function nrdq_acf_google_maps_init() {
    acf_update_setting('google_api_key', '{{key}}');
}

add_action('acf/init', 'nrdq_acf_google_maps_init');
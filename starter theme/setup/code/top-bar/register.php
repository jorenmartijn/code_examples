{{#obj.hasMenu}}
function nrdq_register_top_menu() {
    register_nav_menus (
        array(
            'top' => __('Topmenu', 'DEFINE_LANG'),
        )
    );
}

add_action('after_setup_theme', 'nrdq_register_top_menu');
{{/obj.hasMenu}}
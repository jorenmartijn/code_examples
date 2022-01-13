{{#obj.hasMenu}}
function nrdq_register_socket_menu() {
    register_nav_menus (
        array(
            'socket' => __('Socketmenu', 'DEFINE_LANG'),
        )
    );
}

add_action('after_setup_theme', 'nrdq_register_socket_menu');
{{/obj.hasMenu}}
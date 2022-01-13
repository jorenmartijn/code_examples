function nrdq_register_main_menu() {
    register_nav_menus (
        array(
            'primary' => __('Hoofdmenu', 'DEFINE_LANG'),
        )
    );
}

add_action('after_setup_theme', 'nrdq_register_main_menu');
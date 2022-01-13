{{#obj.hasMenu}}
function nrdq_register_footer_menu() {
    register_nav_menus (
        array(
            {{#obj.getAllMenus}}
            'footer {{.}}' => __('Footermenu {{.}}', 'DEFINE_LANG'),
            {{/obj.getAllMenus}}
        )
    );
}

add_action('after_setup_theme', 'nrdq_register_footer_menu');
{{/obj.hasMenu}}
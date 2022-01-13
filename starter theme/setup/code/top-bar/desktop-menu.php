{{#obj.hasMenu}}
$menu_args = apply_filters('nrdq_top_menu_args', array(
    'theme_location'        => 'top',
    'menu_class'            => 'top-desktop-navigation',
    'container'             => 'nav',
    'container_id'          => true,
    'container_class'       => 'top-desktop-navigation-container {{#obj.hasArrows}}has-arrows{{/obj.hasArrows}}',
    'depth'                 => {{obj.getDepth}},
    'fallback_cb'           => false
));

wp_nav_menu( $menu_args );
{{/obj.hasMenu}}
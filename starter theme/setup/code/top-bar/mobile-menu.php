{{#obj.hasMenu}}
$menu_args = apply_filters('nrdq_top_menu_args', array(
    'theme_location'        => 'top',
    'menu_class'            => 'top-mobile-navigation',
    'container'             => 'nav',
    'container_id'          => true,
    'container_class'       => 'top-mobile-navigation-container {{#obj.hasArrows}}has-arrows{{/obj.hasArrows}}',
    'depth'                 => {{obj.getDepth}},
    'items_wrap'            => '<ul id="%1$s" class="%2$s" data-accordion-menu {{#obj.hasArrows}}data-submenu-toggle="true"{{/obj.hasArrows}}>%3$s</ul>',
    'fallback_cb'           => false
));

wp_nav_menu( $menu_args );
{{/obj.hasMenu}}
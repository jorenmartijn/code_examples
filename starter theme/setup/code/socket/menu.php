{{#obj.hasMenu}}
$menu_args = apply_filters('nrdq_socket_menu_args', array(
'theme_location'        => 'socket',
'menu_class'            => 'socket-navigation',
'container'             => 'nav',
'container_id'          => true,
'container_class'       => 'socket-navigation-container',
'depth'                 => 1,
'fallback_cb'           => false
));

wp_nav_menu( $menu_args );
{{/obj.hasMenu}}
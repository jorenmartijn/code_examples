<?php 
// register mega menu toggle field
acf_add_local_field_group(array(
    'key' => 'group_5e6f44ff79f9a',
    'title' => 'Menu item options',
    'fields' => array(
      array(
        'key' => 'field_5e6f4506df8d7',
        'label' => 'Mega menu',
        'name' => 'mega_menu',
        'type' => 'true_false',
        'instructions' => 'Indien geactiveerd zullen onderliggende menu items van dit item weergeven worden als een megamenu',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
          'width' => '',
          'class' => '',
          'id' => '',
        ),
        'message' => '',
        'default_value' => 0,
        'ui' => 0,
        'ui_on_text' => '',
        'ui_off_text' => '',
      ),
    ),
    'location' => array(
      array(
        array(
          'param' => 'nav_menu_item',
          'operator' => '==',
          'value' => 'location/primary',
        ),
      ),
    ),
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
    'label_placement' => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen' => '',
    'active' => true,
    'description' => '',
));

// add mega-menu class to menu item
function my_wp_nav_menu_objects( $items, $args ) {
	foreach( $items as &$item ) {
        $mega_menu = get_field('mega_menu', $item);
		if( $mega_menu ) {
			$item->classes[] = 'mega-menu';
		}
	}
	return $items;
}
add_filter('wp_nav_menu_objects', 'my_wp_nav_menu_objects', 10, 2);
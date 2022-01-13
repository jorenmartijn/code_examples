<?php

// Generated content - DO NOT TOUCH
//--------------------

# BEGIN Post Types
# END Post Types

# BEGIN Main Menu
# END Main Menu

# BEGIN Top Menu
# END Top Menu

# BEGIN Socket Menu
# END Socket Menu

# BEGIN Footer Menu
# END Footer Menu

# BEGIN Favicon
# END Favicon

// Theme support
//--------------
function theme_support() {
    add_theme_support( 'post-thumbnails' );// This enabled post-thumbnails
    add_theme_support('menus');
    //add_theme_support( 'post-formats', array( 'video', 'gallery') ); // Add post-formats -> https://codex.wordpress.org/Post_Formats
}

add_action('after_setup_theme', 'theme_support');



// Image sizes
//-------------------------------------------------------
function add_image_sizes() {
    // Image examples
    /* Image
        <img class="lazy" data-src="<?= content_url(); ?>/build/img/nothing.gif" alt="<?=esc_attr($alt);?>" data-lazy="
                    [<?=nrdq_get_image_url($image_id, 'fc-wide-small');?>, small],
                    [<?=nrdq_get_image_url($image_id, 'fc-wide-small-retina');?>, smallretina],
                    [<?=nrdq_get_image_url($image_id, 'fc-wide-large');?>, large]">

      Background Image
      <div class="image-container bg-lazy" data-src="<?= content_url(); ?>/build/img/nothing.gif" data-lazy="
                          [<?=nrdq_get_image_url($img_id, 'case-small');?>, small],
                          [<?=nrdq_get_image_url($img_id, 'case-small-retina');?>, smallretina],
                          [<?=nrdq_get_image_url($img_id, 'about-medium');?>, medium],
                          [<?=nrdq_get_image_url($img_id, 'about-medium-retina');?>, mediumretina],
                          [<?=nrdq_get_image_url($img_id, 'about-xlarge');?>, xlarge]">
      </div>
    */

    // image sizes
    //add_image_size( 'custom-size', 220, 180 ); // 220 pixels wide by 180 pixels tall, soft proportional crop mode
    //add_image_size( 'custom-size', 220, 180, true ); // 220 pixels wide by 180 pixels tall, hard crop mode  *** (most used) ***
    //add_image_size( 'custom-size', 220, 220, array( 'left', 'top' ) ); // Hard crop left top
}

add_action('after_setup_theme', 'add_image_sizes');

// Custom Post Type archieven toevoegen aan menu bewerken
//-------------------------------------------------------
add_action('admin_head-nav-menus.php', 'theme_add_metabox_menu_posttype_archive');

function theme_add_metabox_menu_posttype_archive() {
    add_meta_box('theme-metabox-nav-menu-posttype', 'Archieven', 'theme_metabox_menu_posttype_archive', 'nav-menus', 'side', 'default');
}

function theme_metabox_menu_posttype_archive() {
  $post_types = get_post_types(array('show_in_nav_menus' => true, 'has_archive' => true), 'object');
  if ($post_types) {
    $items = array();
    $loop_index = 999999;

    foreach ($post_types as $post_type) {
        $item = new stdClass();
        $loop_index++;
        $item->object_id = $loop_index;
        $item->db_id = 0;
        $item->object = 'post_type_' . $post_type->query_var;
        $item->menu_item_parent = 0;
        $item->type = 'custom';
        $item->title = $post_type->labels->name;
        $item->url = get_post_type_archive_link($post_type->query_var);
        $item->target = '';
        $item->attr_title = '';
        $item->classes = array();
        $item->xfn = '';

        $items[] = $item;
    }

    $walker = new Walker_Nav_Menu_Checklist(array());

    echo '<div id="posttype-archive" class="posttypediv">';
    echo '<div id="tabs-panel-posttype-archive" class="tabs-panel tabs-panel-active">';
    echo '<ul id="posttype-archive-checklist" class="categorychecklist form-no-clear">';
    echo walk_nav_menu_tree(array_map('wp_setup_nav_menu_item', $items), 0, (object) array('walker' => $walker));
    echo '</ul>';
    echo '</div>';
    echo '</div>';

    echo '<p class="button-controls">';
    echo '<span class="add-to-menu">';
    echo '<input type="submit"' . disabled(1, 0) . ' class="button-secondary submit-add-to-menu right" value="' . __('Add to Menu', 'DEFINE_LANG') . '" name="add-posttype-archive-menu-item" id="submit-posttype-archive" />';
    echo '<span class="spinner"></span>';
    echo '</span>';
    echo '</p>';
  }
}

// contact Form 7 input to button
//-------------------------------
add_action( 'wpcf7_init', 'custom_add_form_tag_button' );
function custom_add_form_tag_button() {
    wpcf7_add_form_tag( 'button', 'custom_button_form_tag_handler',true ); // "button"
}

function custom_button_form_tag_handler( $tag ) {
  $tag = new WPCF7_FormTag( $tag );
	$class = wpcf7_form_controls_class( $tag->type );
	$atts = array();
	$atts['class'] = $tag->get_class_option( $class ). ' btn-red align-center wpcf7-submit';
	$atts['id'] = $tag->get_id_option();
	$atts['tabindex'] = $tag->get_option( 'tabindex', 'int', true );
	$value = isset( $tag->values[0] ) ? $tag->values[0] : '';
	if ( empty( $value ) )
		$value = __( 'Send', 'contact-form-7' );
	$atts['type'] = 'submit';
	$atts = wpcf7_format_atts( $atts );
	$html = sprintf( '<button %1$s>%2$s </button>', $atts, $value );
	return $html;
}

// Add menu capability to editor role
//-------------------------------
add_action('after_switch_theme', 'set_menu_capability_for_editor');

function set_menu_capability_for_editor(){
  $role_object = get_role( 'editor' );
  $role_object->add_cap( 'edit_theme_options' );
}


// Add meta to header
add_action('wp_head', 'nrdq_add_meta_to_header', 1);

function nrdq_add_meta_to_header(){
  echo
  '
  <meta charset="' . get_bloginfo('charset') . '">
  <title>' . wp_title('&raquo;', false) . '</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ';
}


// Add browser classes to body
// function add_browser_body_class($classes) {
//         global $is_lynx, $is_gecko, $is_IE, $is_opera, $is_NS4, $is_safari, $is_chrome, $is_iphone;
//         if($is_lynx) $classes[] = 'lynx';
//         elseif($is_gecko) $classes[] = 'gecko';
//         elseif($is_opera) $classes[] = 'opera';
//         elseif($is_NS4) $classes[] = 'ns4';
//         elseif($is_safari) $classes[] = 'safari';
//         elseif($is_chrome) $classes[] = 'chrome';
//         elseif($is_IE) {
//                 $classes[] = 'ie';
//                 if(preg_match('/MSIE ([0-9]+)([a-zA-Z0-9.]+)/', $_SERVER['HTTP_USER_AGENT'], $browser_version))
//                 $classes[] = 'ie'.$browser_version[1];
//         } else $classes[] = 'unknown';
//         if($is_iphone) $classes[] = 'iphone';
//         if ( stristr( $_SERVER['HTTP_USER_AGENT'],"mac") ) {
//                  $classes[] = 'osx';
//            } elseif ( stristr( $_SERVER['HTTP_USER_AGENT'],"linux") ) {
//                  $classes[] = 'linux';
//            } elseif ( stristr( $_SERVER['HTTP_USER_AGENT'],"windows") ) {
//                  $classes[] = 'windows';
//            }
//         return $classes;
// }
// add_filter('body_class','add_browser_body_class');

function my_admin_styles() {
  echo '<style>

    /* Headers */
    .ui-sortable-handle {
      background-color: #ddd;
    }
    .acf-fc-layout-handle {
      background-color: #aaa;
    }

    /* Bodies */
    .acf-field-5a93fb52b4c53, .acf-field-5a93e51884037, .acf-field-5a93e53284038 {
      background-color: #f3f3f3;
    }

  </style>';
}
 
add_action('admin_head', 'my_admin_styles');

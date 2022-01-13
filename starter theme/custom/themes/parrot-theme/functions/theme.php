<?php

// Theme support
function theme_support()
{
  add_theme_support('post-thumbnails'); // This enabled post-thumbnails

  // Hero
  add_image_size('hero-small', 640, 370, true);
  add_image_size('hero-small-retina', 1280, 740, true);
  add_image_size('hero-medium', 800, 9999);
  add_image_size('hero-large', 1200, 750);
  add_image_size('hero-xlarge', 1440, 900);
  add_image_size('hero-xxlarge', 2500, 1400);

  // Image in content
  add_image_size('content-image-small', 400, 9999);
  add_image_size('content-image-medium', 460, 9999);
  add_image_size('content-image-large', 640, 9999);
  add_image_size('content-image-retina', 800, 9999);

  // Cards
  add_image_size('card-retina', 920, 520, true); // Retina size
  add_image_size('card-xlarge', 460, 260, true);

  // Quote slider
  add_image_size('quote-small', 410, 340, true);
  add_image_size('quote-small-retina', 820, 680, true);
  add_image_size('quote-medium', 262, 220, true);

  // Widget
  add_image_size('widget-small', 9999, 275);
  add_image_size('widget-small-background', 9999, 320);
  add_image_size('widget-small-retina', 9999, 550);
  add_image_size('widget-small-background-retina', 9999, 640);

  // Gallery
  //add_image_size('gallery-small', 9999, 270 );
  add_image_size('gallery-medium', 410, 340, true);
  //add_image_size('gallery-retina', 820, 680, true );


  // Registering multiple menus
  add_theme_support('menus');
  register_nav_menus(
    array(
      'primary'           => __('Main menu', 'nordique'),
      'secondary'          => __('Top menu', 'nordique'),
      'footer'             => __('Footer menu', 'nordique'),
      'secondary_footer'   => __('Second Footer menu', 'nordique'),
    )
  );
}
add_action('after_setup_theme', 'theme_support');

// Custom Post Type archieven toevoegen aan menu bewerken
add_action('admin_head-nav-menus.php', 'theme_add_metabox_menu_posttype_archive');
function theme_add_metabox_menu_posttype_archive()
{
  add_meta_box('theme-metabox-nav-menu-posttype', 'Archieven', 'theme_metabox_menu_posttype_archive', 'nav-menus', 'side', 'default');
}
function theme_metabox_menu_posttype_archive()
{
  $post_types = get_post_types(array('show_in_nav_menus' => true, 'has_archive' => true), 'object');
  if ($post_types) :
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
    echo '<input type="submit"' . disabled(1, 0) . ' class="button-secondary submit-add-to-menu right" value="' . __('Add to Menu', 'andromedamedia') . '" name="add-posttype-archive-menu-item" id="submit-posttype-archive" />';
    echo '<span class="spinner"></span>';
    echo '</span>';
    echo '</p>';
  endif;
}


// unregister all widgets
function unregister_default_widgets()
{
  unregister_widget('WP_Widget_Pages');
  unregister_widget('WP_Widget_Calendar');
  unregister_widget('WP_Widget_Archives');
  unregister_widget('WP_Widget_Links');
  unregister_widget('WP_Widget_Meta');
  unregister_widget('WP_Widget_Search');
  unregister_widget('WP_Widget_Text');
  unregister_widget('WP_Widget_Categories');
  unregister_widget('WP_Widget_Recent_Posts');
  unregister_widget('WP_Widget_Recent_Comments');
  unregister_widget('WP_Widget_RSS');
  unregister_widget('WP_Widget_Tag_Cloud');
  unregister_widget('WP_Widget_Media_Video');
  unregister_widget('WP_Widget_Media_Image');
  unregister_widget('WP_Widget_Media_Gallery');
  unregister_widget('WP_Widget_Media_Audio');
  unregister_widget('WP_Widget_Custom_HTML');
  unregister_widget('WP_Nav_Menu_Widget');
  unregister_widget('Twenty_Eleven_Ephemera_Widget');
}
add_action('widgets_init', 'unregister_default_widgets', 11);


function nrdq_register_sidebars()
{
  register_sidebar(
    array(
      'id' => 'default-sidebar',
      'name' => __('Page sidebar'),
      'description' => __("This is a standard sidebar."),
      'before_title' => '<h2 class="widget-title">',
      'after_title' => '</h2>'
    )
  );
}
add_action('widgets_init', 'nrdq_register_sidebars');


// Register and load the widget
function nrdq_load_widgets()
{
  register_widget('content_widget');
  register_widget('cta_widget');
}

add_action('widgets_init', 'nrdq_load_widgets');


class Content_Widget extends WP_Widget
{

  function __construct()
  {
    parent::__construct(

      'content_widget',

      __('Content widget'),

      array('description' => __('A widget with dynamic content'),)
    );
  }


  public function widget($args, $instance)
  {
    $widget_id = $args['widget_id'];
    include(locate_template('includes/widgets/widget-content.php'));
  }


  public function form($instance)
  {
    // outputs the options form on admin
  }


  public function update($new_instance, $old_instance)
  {
    // processes widget options to be saved
    return $new_instance;
  }
}

class CTA_Widget extends WP_Widget
{

  function __construct()
  {
    parent::__construct(

      'cta_widget',

      __('Call to Action widget'),

      array('description' => __('Een widget in which a Call to Action can be placed.'),)
    );
  }


  public function widget($args, $instance)
  {
    $widget_id = $args['widget_id'];
    include(locate_template('includes/widgets/widget-cta.php'));
  }

  public function form($instance)
  {
    // outputs the options form on admin
  }


  public function update($new_instance, $old_instance)
  {
    // processes widget options to be saved
    return $new_instance;
  }
}


/*
public function update( $new_instance, $old_instance ) {
		$instance = array();
		if ( ! empty( $new_instance['title'] ) ) {
			$instance['title'] = sanitize_text_field( $new_instance['title'] );
		}
		if ( ! empty( $new_instance['nav_menu'] ) ) {
			$instance['nav_menu'] = (int) $new_instance['nav_menu'];
		}
		return $instance;
	}
*/


function add_browser_body_class($classes)
{
  if (post_has_sidebar()) {
    $classes[] = 'has-sidebar';
  }
  return $classes;
}
add_filter('body_class', 'add_browser_body_class');


/*
function remove_posts_menu() {
    remove_menu_page('edit.php');
}
add_action('admin_menu', 'remove_posts_menu');
*/


add_filter('gform_init_scripts_footer', '__return_true');
add_filter('gform_cdata_open', 'wrap_gform_cdata_open');
function wrap_gform_cdata_open($content = '')
{
  $content = 'document.addEventListener( "DOMContentLoaded", function() { ';
  return $content;
}
add_filter('gform_cdata_close', 'wrap_gform_cdata_close');
function wrap_gform_cdata_close($content = '')
{
  $content = ' }, false );';
  return $content;
}


// Filter the Gravity Forms button type
add_filter("gform_submit_button", "form_submit_button", 10, 2);
function form_submit_button($button, $form)
{
  // The following line is from the Gravity Forms documentation - it doesn't include your custom button text
  // return "<button class='button' id='gform_submit_button_{$form["id"]}'>'Submit'</button>";
  // This includes your custom button text:
  return "<button class='btn-secondary gf-button has-arrow' id='gform_submit_button_{$form["id"]}'>{$form['button']['text']}</button>";
}


add_filter('gform_ajax_spinner_url', 'spinner_url', 10, 2);
function spinner_url($image_src, $form)
{
  return content_url() . '/build/img/loader.gif';
}


// Highlight search results
function wps_highlight_results($text)
{
  if (is_search()) {
    $sr = get_query_var('s');
    $keys = explode(" ", $sr);
    $text = preg_replace('/(' . implode('|', $keys) . ')/iu', '<span class="search-excerpt">' . $sr . '</span>', $text);
  }
  return $text;
}
add_filter('the_excerpt', 'wps_highlight_results');
// add_filter('the_title', 'wps_highlight_results');


// Pagination
function pagination($pages = '', $range = 9)
{
  $showitems = ($range * 2) + 1;
  global $paged;
  if (empty($paged)) $paged = 1;
  if ($pages == '') {
    global $wp_query;
    $pages = $wp_query->max_num_pages;
    if (!$pages) {
      $pages = 1;
    }
  }
  if (1 != $pages) {
    echo "<ul class=\"pagination l-full\"><div class='l-right'><span class='page-info'>Pagina " . $paged . " van " . $pages . "</span></div>";
    if ($paged > 2 && $paged > $range + 1 && $showitems < $pages) echo "<a href='" . get_pagenum_link(1) . "'>&laquo; Eerste</a>";
    if ($paged > 1 && $showitems < $pages) echo "<a href='" . get_pagenum_link($paged - 1) . "'>&lsaquo; Vorige</a>";
    for ($i = 1; $i <= $pages; $i++) {
      if (1 != $pages && (!($i >= $paged + $range + 1 || $i <= $paged - $range - 1) || $pages <= $showitems)) {
        echo ($paged == $i) ? "<li class='is-selected'><a href='" . $_SERVER['REQUEST_URI'] . "'><span>" . $i . "</span></a></li>" : "<li><a href='" . get_pagenum_link($i) . "' class=\"inactive\">" . $i . "</a></li>";
      }
    }
    if ($paged < $pages && $showitems < $pages) echo "<a href=\"" . get_pagenum_link($paged + 1) . "\">Volgende &rsaquo;</a>";
    if ($paged < $pages - 1 &&  $paged + $range - 1 < $pages && $showitems < $pages) echo "<a href='" . get_pagenum_link($pages) . "'>Laatste &raquo;</a>";
    echo "</ul>\n";
  }
}

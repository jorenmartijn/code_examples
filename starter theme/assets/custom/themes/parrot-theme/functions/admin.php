<?php

// Custom admin logo
add_action("login_head", "my_login_head");
function my_login_head()
{
	echo "
	<style>
  	body.login #login h1 a {
  		background: url('" . get_field('company_logo', 'option') . "') no-repeat scroll center top transparent;
      height:95px;
      background-size:100%;
  		width: 100%;
  		outline: 0;
  	}
	</style>
	";
}


// if is admin
if (is_admin()) :

	// Remove default dashboard widgets
	function remove_dashboard_meta()
	{
		remove_meta_box('dashboard_incoming_links', 'dashboard', 'normal');
		remove_meta_box('dashboard_plugins', 'dashboard', 'normal');
		remove_meta_box('dashboard_primary', 'dashboard', 'normal');
		remove_meta_box('dashboard_secondary', 'dashboard', 'normal');
		remove_meta_box('dashboard_incoming_links', 'dashboard', 'normal');
		remove_meta_box('dashboard_quick_press', 'dashboard', 'side');
		remove_meta_box('dashboard_recent_drafts', 'dashboard', 'side');
		remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
		remove_meta_box('dashboard_right_now', 'dashboard', 'normal');
	}
	add_action('admin_init', 'remove_dashboard_meta');

	//Google Maps Api
	function my_acf_init()
	{
		acf_update_setting('google_api_key', GOOGLE_MAPS_API_KEY); // CHANGE API! - is 2M API key
	}
	add_action('acf/init', 'my_acf_init');

	// ACF Algemene opties
	if (function_exists('acf_add_options_page')) :

		acf_add_options_page(array(
			'page_title' 	=> __('General settings', 'nordique'),
			'menu_title'	=> __('General settings', 'nordique'),
			'menu_slug' 	=> 'general-settings',
			'parent_slug'	=> '',
			'capability'	=> 'edit_posts',
			'redirect'		=> false,
			'position'    => false
		));
	endif;

	// Disable acf for non administrators
	if (!current_user_can('administrator')) {
		define('ACF_LITE', true);
	}

	// Yoast to bottom
	function yoasttobottom()
	{
		return 'low';
	}
	add_filter('wpseo_metabox_prio', 'yoasttobottom');

	// Footer text Nordique
	function remove_footer_admin()
	{
		echo 'Ontwikkeld door <a href="https://www.nordique.nl" title="Nordique" target="_new">Nordique</a>';
	}
	add_filter('admin_footer_text', 'remove_footer_admin');


	// Disable comments
	// Disable support for comments and trackbacks in post types
	function df_disable_comments_post_types_support()
	{
		$post_types = get_post_types();
		foreach ($post_types as $post_type) {
			if (post_type_supports($post_type, 'comments')) {
				remove_post_type_support($post_type, 'comments');
				remove_post_type_support($post_type, 'trackbacks');
			}
		}
	}
	add_action('admin_init', 'df_disable_comments_post_types_support');

	// Close comments on the front-end
	function df_disable_comments_status()
	{
		return false;
	}
	add_filter('comments_open', 'df_disable_comments_status', 20, 2);
	add_filter('pings_open', 'df_disable_comments_status', 20, 2);

	// Hide existing comments
	function df_disable_comments_hide_existing_comments($comments)
	{
		$comments = array();
		return $comments;
	}
	add_filter('comments_array', 'df_disable_comments_hide_existing_comments', 10, 2);

	// Remove comments page in menu
	function df_disable_comments_admin_menu()
	{
		remove_menu_page('edit-comments.php');
	}
	add_action('admin_menu', 'df_disable_comments_admin_menu');

	// Redirect any user trying to access comments page
	function df_disable_comments_admin_menu_redirect()
	{
		global $pagenow;
		if ($pagenow === 'edit-comments.php') {
			wp_redirect(admin_url());
			exit;
		}
	}
	add_action('admin_init', 'df_disable_comments_admin_menu_redirect');

	// Remove comments metabox from dashboard
	function df_disable_comments_dashboard()
	{
		remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
	}
	add_action('admin_init', 'df_disable_comments_dashboard');

	// Remove comments links from admin bar
	function df_disable_comments_admin_bar()
	{
		if (is_admin_bar_showing()) {
			remove_action('admin_bar_menu', 'wp_admin_bar_comments_menu', 60);
		}
	}
	add_action('init', 'df_disable_comments_admin_bar');

	// Colored Admin Table BGs by Post Status
	add_action('admin_footer', 'posts_status_color');
	function posts_status_color()
	{
?>
		<style>
			.status-draft {
				background: #FCF4E3 !important;
			}

			.status-pending {
				background: #DCEFF5 !important;
			}

			.status-publish {
				/* no background keep wp alternating colors */
			}

			.status-future {
				background: #C6EBF5 !important;
			}

			.status-private {
				background: #FFF1F1 !important;
			}
		</style>
	<?php
	}

endif;

// if loggedin
if (is_user_logged_in()) :
	// remove comments from admin-menu
	function my_admin_bar_render()
	{
		global $wp_admin_bar;
		$wp_admin_bar->remove_menu('comments');
	}
	add_action('wp_before_admin_bar_render', 'my_admin_bar_render');
endif;

function remove_featured_image_field()
{
	global $post_ID, $post_type;

	if (empty($post_ID) or 'page' !== $post_type)
		return;

	if ($post_ID !== (int) get_option('page_on_front'))
		remove_meta_box('postimagediv', 'page', 'side');
}
add_action('do_meta_boxes', 'remove_featured_image_field');


// Admin menu reordering
//--------------------------------
function nrdq_custom_menu_order()
{
	return array('index.php', 'upload.php');
}

add_filter('custom_menu_order', '__return_true');
add_filter('menu_order', 'nrdq_custom_menu_order');

function nrdq_sort_menu()
{
	global $menu;

	unset($menu[3]); // Unset default separator 2
	unset($menu[59]); // Unset default separator 2
	unset($menu[99]); // Unset default separator 3


	$positions = array(3, 57, 96);

	foreach ($positions as $position) {
		if (!isset($menu[$position])) {
			$menu[$position] = array(
				0	=>	'',
				1	=>	'read',
				2	=>	'separator' . $position,
				3	=>	'',
				4	=>	'wp-menu-separator'
			);
		}
	}

	foreach ($menu as $pos => $item) {
		switch ($item[2]) {
			case "wpcf7":
			case "gf_edit_forms":
				unset($menu[$pos]);
				$item[0] = __('Forms');
				$menu[98] = $item;
				break;
		}
	}

	//Add menu's menu item
	$menu[59] = array(
		0 => 'Menu\'s',
		1 => 'edit_theme_options',
		2	=> 'nav-menus.php',
		3	=> '',
		4	=> 'menu-top menu-icon-appearance',
		5 => 'menu-appearance',
		6 => 'dashicons-list-view'
	);

	// Posts header
	$menu[4] = array(
		0 => 'Content',
		1 => 'read',
		2	=>	'#content',
		3	=>	'',
		4	=>	'wp-menu-note'
	);

	// Settings header
	$menu[58] = array(
		0 => 'Instellingen',
		1 => 'read',
		2	=>	'#settings',
		3	=>	'',
		4	=>	'wp-menu-note'
	);

	// Other header
	$menu[97] = array(
		0 => 'Overig',
		1 => 'read',
		2	=>	'#other',
		3	=>	'',
		4	=>	'wp-menu-note'
	);

	ksort($menu);
}


// dashboard styling
// -----------------
add_action('admin_menu', 'nrdq_sort_menu', 99);

function nrdq_menu_styling()
{
	echo '<style>

  #adminmenu .wp-menu-note {
    background-color: #131619;
    border-top: 1px solid #131619;
  }	
	#adminmenu > .wp-menu-note:before, 
	#adminmenu > .wp-menu-note:after {
		content: "";
		display: block;
    width: 100%;
    height: 1px;
    background-color: #424242;
	}
	
	#adminmenu li.wp-menu-note.menu-top-first {
		margin-top: 15px;
	}
	
  #adminmenu .wp-menu-note:hover {
    color: white;
    cursor: auto;
  }

	#adminmenu .wp-menu-note .wp-menu-image.dashicons-before{
	  display: none;
  }

  #adminmenu .wp-menu-note .wp-menu-name{
    font-size: 15px;
    // letter-spacing: .4px;
    padding-left: 5px;
  }
  </style>';
}

add_action('admin_head', 'nrdq_menu_styling');


// remove wordpress logo in the dasboard
// -------------------------------------
/**
 * Change header.
 *
 */

add_action('admin_bar_menu', 'nrdq_remove_wordpress_logo', 999);
add_action('admin_bar_menu', 'nrdq_change_admin_bar', 2);

function nrdq_change_admin_bar($wp_admin_bar)
{
	$args = array(
		'id'    => 'mobile_menu',
		'title' => '<img src="' . home_url('/custom/build/img/admin-icon.png') . '" />',
		'href'  => 'https://www.nordique.nl/contact/',
		'meta'  => array('class' => 'nordique-logo', 'target' => '_blank')
	);
	$wp_admin_bar->add_node($args);
}


function nrdq_remove_wordpress_logo($wp_admin_bar)
{
	$wp_admin_bar->remove_node('wp-logo');
	$wp_admin_bar->remove_node('comments');
}

function nrdq_admin_bar_styling()
{
	if (is_user_logged_in()) {
		echo '
  	<style>
  
    #wpadminbar .ab-top-menu .nordique-logo .ab-item {padding: 0;}
  
    </style>
    ';
	}
}

add_action('admin_head', 'nrdq_admin_bar_styling');
add_action('wp_head', 'nrdq_admin_bar_styling');



function add_post_template_column($columns)
{
	return  array_merge($columns, array(
		'post_template' => __('Page template'),
	));
}

function page_template_column_data($column, $post_id)
{
	switch ($column) {
		case 'post_template':
			$field = get_field('_wp_page_template', $post_id);
			if ($field) echo $field;
			break;
	}
}

function page_templates_manage_sortable_columns($sortable_columns)
{
	$sortable_columns['post_template'] = 'post_template';
	return $sortable_columns;
}

function page_templates_pre_get_posts($query)
{
	if ($query->is_main_query() && ($orderby = $query->get('orderby'))) {
		switch ($orderby) {
			case 'post_template':

				$query->set('meta_key', '_wp_page_template');
				$query->set('orderby', 'meta_value');

				break;
		}
	}
}

function add_dashboard_template_column()
{
	$post_types = array('page');

	if (is_nordique()) {
		foreach ($post_types as $post_type) {
			add_filter('manage_' . $post_type . '_posts_columns', 'add_post_template_column');
			add_action('manage_' . $post_type . '_posts_custom_column', 'page_template_column_data', 10, 2);
			add_filter('manage_edit-' . $post_type . '_sortable_columns', 'page_templates_manage_sortable_columns');
			add_action('pre_get_posts', 'page_templates_pre_get_posts', 1);
		}
	}
}

add_action('admin_init', 'add_dashboard_template_column');





// Activates the tinymce as normal text
// ------------------------------------
function nrdq_tinymce_settings($settings)
{
	$settings['paste_as_text'] = 'true';
	return $settings;
}
add_filter('tiny_mce_before_init', 'nrdq_tinymce_settings');
add_filter('teeny_mce_before_init', 'nrdq_tinymce_settings');


// e-mail anti-spam
// ----------------
function wpcodex_hide_email_shortcode($atts, $content = null)
{
	if (!is_email($content)) {
		return;
	}

	$content = antispambot($content);
	$email_link = sprintf('mailto:%s', $content);
	return sprintf('<a href="%s">%s</a>', esc_url($email_link, array('mailto')), esc_html($content));
}
add_shortcode('email', 'wpcodex_hide_email_shortcode');


// tinymce background color change
// -------------------------------
function tiny_mce_background_change()
{ ?>
	<script type="text/javascript">
		jQuery(window).on('load', function() {
			jQuery('[data-name$="var_background_color"] select').each(function() {
				var color = jQuery(this).val();
				var iframe = jQuery(this).closest('.acf-fields ').find('iframe');
				jQuery('body#tinymce', iframe.contents()).addClass(color);
			});
		});

		jQuery('.postbox-container').on('change', '[data-name$="var_background_color"] select', function() {
			var color = $(this).val();
			var iframe = jQuery(this).closest('.acf-fields').find('iframe');
			jQuery(this).find("option").each(function() {
				jQuery('body#tinymce', iframe.contents()).removeClass(jQuery(this).val());
			});
			jQuery('body#tinymce', iframe.contents()).addClass(color);
		});
	</script>
<?php }
add_action('admin_print_footer_scripts', 'tiny_mce_background_change');

load_theme_textdomain('parrot-theme', TEMPLATEPATH . '/languages');

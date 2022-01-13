<?php
// Generated content - DO NOT TOUCH
//--------------------

# BEGIN Google Maps ACF
# The directives (lines) between `BEGIN Google Maps ACF` and `END Google Maps ACF` are
# dynamically generated. Any changes to the directives between these markers will be overwritten.
# END Google Maps ACF

// Custom admin logo
//------------------
add_action("login_head", "my_login_head");

function my_login_head() {
	echo "
	<style>
  	body.login #login h1 a {
  		background: url('/custom/build/svg/logo.svg') no-repeat scroll center top transparent;
      height:135px;
      background-size:40%;
  		width: 100%;
  	}
  	body.login .clear::after {
      content:'';
      position:fixed;
      display:block;
      bottom:1rem;
      left:0;
      right:0;
      margin: 0 auto;
      width:220px;
      z-index:-1;
      height:50px;
      background: url('https://www.nordique.nl/power-by-nordique.svg') no-repeat;
      background-size:100%;
      opacity: 0.2;
      filter: alpha(opacity=20);
    }
    body.login .login-notice-bar {
        top: 0;
        left: 0;
        width: 100%;
        height: auto;
        position: fixed;
        z-index: 99999999999;
    }
    body.login .login-notice-bar .container {
        margin: 35px 50px 10px;
        padding: 1rem;
        background: #1779ba;
        text-align: center;
	
        box-shadow: 0 8px 16px 3px rgba(0, 0, 0, 0.3);
        -moz-box-shadow: 0 8px 16px 3px rgba(0, 0, 0, 0.3);
        -webkit-box-shadow: 0 8px 16px 3px rgba(0, 0, 0, 0.3);
        
        border-radius: 5px;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
    } 
    body.login .login-notice-bar .container p {
        color: white;
        display: inline-block;
        font-size: 18px;
        text-shadow: none;
        font-family: Arial, sans-serif;
        font-weight: 400;
        line-height: 1;
	    -webkit-font-smoothing: antialiased;
	    -webkit-margin-before: 1em;
        -webkit-margin-after: 1em;
        -webkit-margin-start: 0;
        -webkit-margin-end: 0;
    }
	</style>
	";
}

// Remove default dashboard widgets
function remove_dashboard_meta() {
  remove_meta_box( 'dashboard_incoming_links', 'dashboard', 'normal' );
  remove_meta_box( 'dashboard_plugins', 'dashboard', 'normal' );
  remove_meta_box( 'dashboard_primary', 'dashboard', 'normal' );
  remove_meta_box( 'dashboard_secondary', 'dashboard', 'normal' );
  remove_meta_box( 'dashboard_incoming_links', 'dashboard', 'normal' );
  remove_meta_box( 'dashboard_quick_press', 'dashboard', 'side' );
  remove_meta_box( 'dashboard_recent_drafts', 'dashboard', 'side' );
  remove_meta_box( 'dashboard_recent_comments', 'dashboard', 'normal' );
  remove_meta_box( 'dashboard_right_now', 'dashboard', 'normal' );
}

add_action( 'admin_init', 'remove_dashboard_meta' );


// ACF Algemene opties
//--------------------
if( function_exists('acf_add_options_page') ) :

	acf_add_options_page(array(
		'page_title' 	=> __('Algemene opties','DEFINE_LANG'),
		'menu_title'	=> __('Algemene opties','DEFINE_LANG'),
		'menu_slug' 	=> 'general-settings',
		'parent_slug'	=> '',
		'capability'	=> 'edit_posts',
		'redirect'		=> false,
		'position'    => false
	));
endif;


// Disable acf for non administrators
//-----------------------------------
if(!current_user_can('administrator') ) {
  define( 'ACF_LITE' , true );
}


// Yoast to bottom
//----------------
function yoasttobottom() {
  return 'low';
}

add_filter( 'wpseo_metabox_prio', 'yoasttobottom');


// Footer text Nordique
//---------------------
function remove_footer_admin () {
  echo 'Ontwikkeld door <a href="https://www.nordique.nl" title="Nordique" target="_blank">Nordique</a>';
}
add_filter('admin_footer_text', 'remove_footer_admin');


// Disable comments
// Disable support for comments and trackbacks in post types
//----------------------------------------------------------
function df_disable_comments_post_types_support() {
	$post_types = get_post_types();
	foreach ($post_types as $post_type) {
		if(post_type_supports($post_type, 'comments')) {
			remove_post_type_support($post_type, 'comments');
			remove_post_type_support($post_type, 'trackbacks');
		}
	}
}
add_action('admin_init', 'df_disable_comments_post_types_support');


// Close comments on the front-end
//--------------------------------
function df_disable_comments_status() {
	return false;
}
add_filter('comments_open', 'df_disable_comments_status', 20, 2);
add_filter('pings_open', 'df_disable_comments_status', 20, 2);


// Hide existing comments
//-----------------------
function df_disable_comments_hide_existing_comments($comments) {
	$comments = array();
	return $comments;
}
add_filter('comments_array', 'df_disable_comments_hide_existing_comments', 10, 2);


// Remove comments page in menu
//-----------------------------
function df_disable_comments_admin_menu() {
	remove_menu_page('edit-comments.php');
}
add_action('admin_menu', 'df_disable_comments_admin_menu');


// Redirect any user trying to access comments page
//-------------------------------------------------
function df_disable_comments_admin_menu_redirect() {
	global $pagenow;
	if ($pagenow === 'edit-comments.php') {
		wp_redirect(admin_url()); exit;
	}
}
add_action('admin_init', 'df_disable_comments_admin_menu_redirect');


// Remove comments metabox from dashboard
//---------------------------------------
function df_disable_comments_dashboard() {
	remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
}
add_action('admin_init', 'df_disable_comments_dashboard');


// Remove comments links from admin bar
//-------------------------------------
function df_disable_comments_admin_bar() {
	if (is_admin_bar_showing()) {
		remove_action('admin_bar_menu', 'wp_admin_bar_comments_menu', 60);
	}
}
add_action('init', 'df_disable_comments_admin_bar');


// Colored Admin Table BGs by Post Status
//---------------------------------------
add_action('admin_footer','posts_status_color');

function posts_status_color(){
echo
'
  <style>
    .status-draft{background: #FCF4E3 !important;}
    .status-pending{background: #DCEFF5 !important;}
    .status-publish{/* no background keep wp alternating colors */}
    .status-future{background: #C6EBF5 !important;}
    .status-private{background:#FFF1F1 !important; }
  </style>
';
}


/*
 * Log plugin activation and deactivation actions in de options table
 *
 *
 */
function nrdq_log_plugin_action($action, $plugin, $network){
  $plugin = preg_replace('/[^A-Za-z\_0-9\s]/', '', $plugin);
  update_option('NRDQ_plugin_' . $plugin, ($action == 'activation') ? 'active' : 'inactive', false);
    update_option('NRDQ_plugin_' . $plugin . '_network' , $network, false);
    $data = get_option('NRDQ_plugin_' . $plugin . '_' . $action, array());
    $data []= array(
      'time'        => time(),
      'id'          => get_current_user_id(),
      'network'     => $network
    );
    update_option('NRDQ_plugin_' . $plugin . '_' . $action, $data, false);
}

function nrdq_log_plugin_activation($plugin, $network_wide){
  //General plugin info
  $network = ($network_wide) ? 'network' : 'single';
  $plugin_name = preg_replace('/\/(.*)$/', '', $plugin);
  nrdq_log_plugin_action('activation', $plugin_name, $network);
}

function nrdq_log_plugin_deactivation($plugin, $network_wide){
  //General plugin info
  $network = ($network_wide) ? 'network' : 'single';
  $plugin_name = preg_replace('/\/(.*)$/', '', $plugin);
  nrdq_log_plugin_action('deactivation', $plugin_name, $network);
}

add_action('activated_plugin', 'nrdq_log_plugin_activation', 99, 2);
add_action('deactivated_plugin', 'nrdq_log_plugin_deactivation', 99, 2);

function add_post_template_column($columns) {
  return  array_merge($columns, array(
      'post_template' => __('Pagina template'),
    )
  );
}

function page_template_column_data( $column, $post_id ) {
  switch ( $column ) {
    case 'post_template':
        $field = get_post_meta($post_id, '_wp_page_template', true);
        if($field) echo $field;
        break;
  }
}

function page_templates_manage_sortable_columns( $sortable_columns ) {
  $sortable_columns[ 'post_template' ] = 'post_template';
  return $sortable_columns;
}

function page_templates_pre_get_posts( $query ) {
  if ( $query->is_main_query() && ( $orderby = $query->get( 'orderby' ) ) ) {
    switch( $orderby ) {
       case 'post_template':

        $query->set( 'meta_key', '_wp_page_template' );
        $query->set( 'orderby', 'meta_value' );

        break;
    }
  }
}

function add_dashboard_template_column(){
  $post_types = array('page');

  if(is_nordique()){
    foreach($post_types as $post_type){
      add_filter('manage_' . $post_type . '_posts_columns' , 'add_post_template_column');
      add_action('manage_' . $post_type . '_posts_custom_column' , 'page_template_column_data', 10, 2 );
      add_filter('manage_edit-' . $post_type . '_sortable_columns', 'page_templates_manage_sortable_columns' );
      add_action('pre_get_posts', 'page_templates_pre_get_posts', 1 );
    }
  }
}

add_action('admin_init', 'add_dashboard_template_column');

// Admin menu reordering
//--------------------------------
function nrdq_custom_menu_order() {
    return array( 'index.php', 'upload.php' );
}

add_filter( 'custom_menu_order', '__return_true' );
add_filter( 'menu_order', 'nrdq_custom_menu_order' );

function nrdq_sort_menu( ) {
	global $menu;

	unset($menu[3]); // Unset default separator 2
	unset($menu[59]); // Unset default separator 2
	unset($menu[99]); // Unset default separator 3


	$positions = array(3, 57, 96);

	foreach($positions as $position){
  	if(!isset($menu[$position])){
    	$menu[ $position ] = array(
    		0	=>	'',
    		1	=>	'read',
    		2	=>	'separator' . $position,
    		3	=>	'',
    		4	=>	'wp-menu-separator'
    	);
  	}
	}

	$form_pos = 98;
	foreach($menu as $pos => $item){
  	switch($item[2]){
    	case "wpcf7":
			case "gf_edit_forms":
			case "formidable":
			case "ninja-forms":
    	  unset($menu[$pos]);
    	  $item[0] = __('Formulieren');
    	  $menu[$form_pos] = $item;
    	  break;
  	}
  	++$form_pos;
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

add_action( 'admin_menu', 'nrdq_sort_menu', 99);


function nrdq_disable_options_admin_menu() {
	if(!is_nordique()){
		remove_menu_page( 'plugins.php' );                                        // Plugins
		remove_menu_page( 'edit.php?post_type=acf-field-group');									// ACF
		remove_menu_page( 'options-general.php' );																// instellingen
		remove_menu_page( 'tools.php' );		                                      // hulpmiddelen
		remove_menu_page( 'themes.php' );		                                      // weergave
	}
}
add_action('admin_menu', 'nrdq_disable_options_admin_menu');


// dashboard styling
// -----------------
function nrdq_menu_styling() {
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

add_action('admin_head','nrdq_menu_styling');


function remove_dashboard_widgets() {
  global $wp_meta_boxes;
  unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_activity']);
  unset($wp_meta_boxes['dashboard']['normal']['core']['wpseo-dashboard-overview']);
}

add_action('wp_dashboard_setup', 'remove_dashboard_widgets', 999 );

function nrdq_mce_buttons( $buttons ) {
  array_unshift( $buttons, 'styleselect' );
  return $buttons;
}

function add_archive_edit_link($wp_admin_bar){
	if(current_user_can('edit_pages') && !is_admin() && is_archive()){
		global $wp;
		$current_url = add_query_arg( $wp->query_string, '', home_url( $wp->request ) );
		$url =  admin_url('edit.php?post_type=' . get_post_type() . '&page=' . get_post_type() . '-settings');
		$args = array(
			'id' => 'edit',
			'title' => __('Overzicht bewerken', 'DEFINE_LANG'),
			'href' => $url,
			'meta' => array(
				'class' => 'custom-wpadmin-bar-button menupop ab-item',
			)
		);
		$wp_admin_bar->add_node($args);
	}
}

add_action('admin_bar_menu', 'add_archive_edit_link', 80);


function nrdq_update_account_name( $wp_admin_bar ) {

	if ( ! is_user_logged_in() ) {
		return ;
	}

	$wp_admin_bar->add_menu( array(
		'id'        => 'my-account',
		'title' => __('Mijn account', 'DEFINE_LANG'),

	));

}

add_action( 'admin_bar_menu', 'nrdq_update_account_name', 100 );


// remove wordpress logo in the dasboard
// -------------------------------------
/**
 * Change header.
 *
 */

add_action('admin_bar_menu', 'nrdq_remove_wordpress_logo', 999);
add_action('admin_bar_menu', 'nrdq_change_admin_bar', 2);

function nrdq_change_admin_bar($wp_admin_bar) {
	$args = array(
		'id'    => 'mobile_menu',
		'title' => '<img src="'. home_url('/custom/build/img/admin-icon.png') . '" />',
		'href'  => 'https://www.nordique.nl/contact/',
		'meta'  => array( 'class' => 'nordique-logo', 'target' => '_blank' )
	);
	$wp_admin_bar->add_node( $args );
}


function nrdq_remove_wordpress_logo($wp_admin_bar) {
	$wp_admin_bar->remove_node('wp-logo');
	$wp_admin_bar->remove_node('comments');
}

function nrdq_admin_bar_styling(){
  if(is_user_logged_in()){
    echo '
  	<style>
  
    #wpadminbar .ab-top-menu .nordique-logo .ab-item {padding: 0;}
  
    </style>
    ';
  }
}

add_action('admin_head','nrdq_admin_bar_styling');
add_action('wp_head','nrdq_admin_bar_styling');

// Remove update nag
add_action('admin_head', function() {
    remove_action( 'admin_notices', 'update_nag', 3 );
});


function nrdq_wp_admin_dashboard_customise() {

    wp_add_dashboard_widget('help_widget', 'Vragen en/of nieuwe wensen?', 'nrdq_wp_admin_dashboard_help_widget');

    // Help widget

    function nrdq_wp_admin_dashboard_help_widget($post, $callback_args) {
    	echo '<p class="about-description">Loop je tegen problemen aan? Mis je een bepaalde functionaliteit?</p>';
    	echo '<p>Wij helpen je graag! Neem contact met ons op via <a href="mailto:support@nordique.nl" target="_blank" title="Contact met Nordique">e-mail</a> of bel ons: 050 211 00 20</p>';
    }

    wp_add_dashboard_widget('maintenance_widget', 'Maandelijks Onderhoud', 'nrdq_wp_admin_dashboard_maintenance_widget');

    // Help widget

    function nrdq_wp_admin_dashboard_maintenance_widget($post, $callback_args) {
    	echo '<p class="about-description">In het geval dat er onderhoud bij Nordique wordt afgenomen, wordt in het begin van de maand de website volledig geüpdatet. Dit is erg belangrijk, vanwege de veiligheid en snelheid van de website. Heb je nog geen onderhoudspakket? Bekijk de verschillende pakketten op <a href="https://www.nordique.nl/onderhoud" target="_blank" title="Onderhoud van Nordique">www.nordique.nl/onderhoud</a> of neem contact op via <a href="mailto:info@nordique.nl" target="_blank" title="Contact met Nordique">info@nordique.nl</a> of 050 - 211 0020</p>';
    }

}
add_action('wp_dashboard_setup', 'nrdq_wp_admin_dashboard_customise');


// show featured thumbnail
// ---------------------------------------------------------------------
add_image_size( 'dashboard-thumb', 42, 42, true );

add_action('admin_init', 'add_featured_image_column');

function add_featured_image_column() {

    $post_types = get_post_types(array('public' => true), 'names');

    foreach($post_types as $post_type){
        add_filter('manage_' . $post_type . '_posts_columns', 'nrdq_add_post_admin_thumbnail_column', 2);
        add_action('manage_' . $post_type . '_posts_custom_column', 'nrdq_show_post_thumbnail_column', 5, 2);
    }
}

// Add the column
function nrdq_add_post_admin_thumbnail_column($nrdq_columns){
  $custom_column['nrdq_thumb'] = '';
  $nrdq_columns = array_slice($nrdq_columns, 0, 1, true) + $custom_column + array_slice($nrdq_columns, 1, null, true);
  return $nrdq_columns;
}

function nrdq_show_post_thumbnail_column($nrdq_columns, $nrdq_id){
	switch($nrdq_columns){
		case 'nrdq_thumb':
		if( function_exists('the_post_thumbnail') )
			echo the_post_thumbnail( 'dashboard-thumb' );
		else
			echo 'Geen uitgelichte afbeelding beschikbaar';
		break;
	}
}

function nrdq_column_styling(){
  echo
  ' 
    <style>  
      .widefat .column-nrdq_thumb,
      .widefat tbody th.column-nrdq_thumb { width: 50px; }  
    </style>
  ';
}

add_action('admin_head','nrdq_column_styling');

// Activates the tinymce as normal text
// ------------------------------------
function nrdq_tinymce_settings($settings) {
  $settings['paste_as_text'] = 'true';
  return $settings;
}
add_filter('tiny_mce_before_init','nrdq_tinymce_settings');
add_filter('teeny_mce_before_init', 'nrdq_tinymce_settings');



// Add message to login screen if user is on staging or local
function nrdq_staging_login_message() {
    $message = '';
    if (WP_LOCAL_SERVER):
        $message = "
        <div class='login-notice-bar'>
            <div class='container'>
                <p><strong>LET OP:</strong> dit is de 'lokale' development omgeving</p>
            </div>
        </div>
        ";
    elseif(WP_STAGING_SERVER):
        $message = "
        <div class='login-notice-bar'>
            <div class='container'>
                <p><strong>LET OP:</strong> dit is de stagingomgeving</p>
            </div>
        </div>
        ";
    endif;

    return $message;
}

add_filter('login_message', 'nrdq_staging_login_message');

// wordpress menu default screen options enabeling
function NRDQ_nav_menus_enable_screen_options( $result ) {
  if ( is_array($result) && in_array( 'link-target', $result ) ) {
    unset( $result[ array_search( 'link-target', $result ) ] );
  }
  return $result;
}
add_filter( 'get_user_option_managenav-menuscolumnshidden', 'NRDQ_nav_menus_enable_screen_options' );

// add mega menu toggle to menu item / add menu class function
if( function_exists('acf_add_local_field_group') ):
  require_once (TEMPLATEPATH . '/functions/mega-menu.php');
endif;

// add delete button to wordpress menu item controls
function NRDQ_menu_item_delete_button() {
  $screen = get_current_screen();
  if ($screen->base == 'nav-menus') {
    ?>
        <script type="text/javascript">
          jQuery('.menu-item-bar').each(function() {
            jQuery(this).find('.item-controls').append('<span class="item-type" style="padding: 12px 12px 12px 0;"><div class="dashicons-before dashicons-trash trash-menu-item"></div></<div>');
          });

          jQuery('body').on('click', '.trash-menu-item', function(e) {
            e.preventDefault()
            jQuery(this).closest('li.menu-item').remove();
          });

          jQuery( document ).ajaxComplete(function() {
            jQuery('.menu-item.pending').each(function() {
              if(jQuery(this).find('.trash-menu-item').length > 0) {

              } else {
                jQuery(this).find('.item-controls').append('<span class="item-type" style="padding: 12px 12px 12px 0;"><div class="dashicons-before dashicons-trash trash-menu-item"></div></<div>');
              }
            });
          });
        </script>
    <?php
  }
}
add_action('admin_footer', 'NRDQ_menu_item_delete_button');

// Remove customizer menu item from admin menu
add_action( 'admin_bar_menu', 'remove_customizer_top_bar_menu', 999 );

function remove_customizer_top_bar_menu( $wp_admin_bar ) {
    $wp_admin_bar->remove_menu('customize');
}

// Multisite url adminbar fix
function nrdq_get_option($key, $multisite_id) {
  if(is_multisite()) {
    switch_to_blog($multisite_id);
    $option = get_option($key);
    restore_current_blog();
    return $option;
  } else {
    return get_option($key);
  }
}

add_action( 'admin_bar_menu', 'customize_my_wp_admin_bar', 80 );
function customize_my_wp_admin_bar( $wp_admin_bar ) {
    if(is_multisite()) {
        $blog_list = get_blog_list(0, 'all');
        $multisite_urls = array('', '-d', '-n', '-c', '-v');

        foreach ($blog_list AS $blog) {
            $admin_slug = nrdq_get_option('whl_page', $blog['blog_id']);

            if ($admin_slug !== false) {
                foreach ($multisite_urls AS $multisite_url) {
                    // get node
                    $node = $wp_admin_bar->get_node('blog-' . $blog['blog_id'] . $multisite_url);

                    // change node
                    $url = $node->href;
                    $url = str_replace("/core/wp-admin/", "/wp-admin/", $url);
                    $url = str_replace("/wp-admin/", "/" . $admin_slug . '/', $url);
                    $node->href = $url;

                    // update node
                    $wp_admin_bar->add_node($node);
                }
            }
        }
    }
}

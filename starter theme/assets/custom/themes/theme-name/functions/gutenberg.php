<?php
// Add gutenberg theme support
add_theme_support( 'align-wide' );

// Disable Custom Colors
function NRDQ_gutenberg_custom_colour_picker() {
    add_theme_support( 'disable-custom-colors' );
    add_theme_support( 'disable-custom-gradients' );
    add_theme_support( 'editor-gradient-presets', array() ); // Disable default gradient options

    add_theme_support( 'editor-color-palette', array(
        array(
            'name'  => __( 'Primaire kleur', 'DEFINE_LANG' ),
            'slug'  => 'primary',
            'color'	=> '#1779ba',
        ),
        array(
            'name'  => __( 'Secundaire kleur', 'DEFINE_LANG' ),
            'slug'  => 'secondary',
            'color'	=> '#767676',
        ),
        array(
            'name'  => __( 'Wit', 'DEFINE_LANG' ),
            'slug'  => 'white',
            'color'	=> '#ffffff',
        ),
        array(
            'name'  => __( 'Zwart', 'DEFINE_LANG' ),
            'slug'  => 'black',
            'color'	=> '#000000',
        ),
    ) );
}
add_action( 'after_setup_theme', 'NRDQ_gutenberg_custom_colour_picker' );


// extend existing Gutenberg block functionality
function NRDQ_gutenberg_enqueue() {
    wp_register_script( 'gutenberg-js', WP_CONTENT_URL.'/themes/theme-name/functions/gutenberg.js', array( 'wp-i18n', 'wp-blocks', 'wp-edit-post', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-plugins', 'wp-edit-post' ), substr(chunk_split((substr(filemtime(get_stylesheet_directory() . '/functions/gutenberg.js'), -3)), 1, '.'), 0, -1), true );
    wp_enqueue_script( 'gutenberg-js' );
}
add_action( 'enqueue_block_editor_assets', 'NRDQ_gutenberg_enqueue' );



function editor_full_width_gutenberg() {
//  ob_start();
//    get_template_part('includes/dynamic-styles/dynamic-styles-gutenberg');
//  $theme_colors = ob_get_clean();
    echo '<style>
    body.gutenberg-editor-page .editor-post-title__block, body.gutenberg-editor-page .editor-default-block-appender, body.gutenberg-editor-page .editor-block-list__block {
		  max-width: none !important;
	  }
    .wp-block {
		  max-width: 85%;
    }
    .block-editor-writing-flow {
      height: auto;
    }
    body.block-editor-page {
      display: flex;
    }
    /* remove preview button */ 
    .components-toolbar__control[aria-label="Switch to Preview"] {
        display: none;
    }
  </style>';
}

// Gutenberg editor full width
add_action('admin_head', 'editor_full_width_gutenberg', 10);


// Gutenberg helper function to render ACF blocks
function NRDQ_acf_block_render_callback( $block ) {
    // convert name ("acf/testimonial") into path friendly slug ("testimonial")
    $slug = str_replace('acf/', '', $block['name']);
    if( file_exists( get_stylesheet_directory()."/includes/content/blocks/{$slug}.php" ) ) {
        include( get_stylesheet_directory()."/includes/content/blocks/{$slug}.php" );
    } else if( file_exists( get_template_directory()."/includes/content/blocks/{$slug}.php" ) ) {
        include( get_template_directory()."/includes/content/blocks/{$slug}.php" );
    }
}

// Add backend styles for Gutenberg.
add_action( 'enqueue_block_editor_assets', 'NRDQ_add_gutenberg_assets' );
function NRDQ_add_gutenberg_assets() {
    if( file_exists( get_template_directory() . '/../../build/css/gutenberg-style.min.css' ) ) {
        wp_enqueue_style( 'NRDQ-gutenberg', WP_CONTENT_URL . '/build/css/gutenberg-style.min.css' );
    }
}

// Gutenberg create block categories
function NRDQ_gutenberg_block_category( $categories, $post ) {
    return array_merge(
        $categories,
        array(
            array(
                'slug' => 'home',
                'title' => __( 'Home blokken', 'DEFINE_LANG' ),
            ),
            array(
                'slug' => 'custom',
                'title' => __( 'Custom blokken', 'DEFINE_LANG' ),
            ),
        )
    );
}
add_filter( 'block_categories', 'NRDQ_gutenberg_block_category', 10, 2);


// Gutenberg create blocks
add_action('init', 'NRDQ_gutenberg_acf_blocks');

// gutenberg auto categorize home blocks function
function acf_register_home_block($args) {
    global $home_blocks;
    if(!isset($home_blocks)) {
        $home_blocks = array();
    }
    if(is_array($args)) {
        acf_register_block(array(
            'name'				=> $args['name'] ? $args['name'] : str_shuffle('abcdefghijklmnopqrstuvwxyz1234567890'),
            'title'				=> $args['title'] ? $args['title'] : 'Custom home block',
            'description'		=> $args['description'] ? $args['description'] : 'Custom home block',
            'render_callback'	=> $args['render_callback'] ? $args['render_callback'] : 'NRDQ_acf_block_render_callback',
            'category'			=> $args['category'] ? $args['category'] : 'home',
            'icon'				=> $args['icon'] ? $args['icon'] : 'cover-image',
            'keywords'			=> $args['keywords'] ? $args['keywords'] : '',
            'mode'			    => $args['mode'] ? $args['mode'] : 'edit',
            'align'             => $args['align'] ? $args['align'] : false,
        ));
    }
    $home_blocks[] = 'acf/' . $args['name'];
}

function NRDQ_gutenberg_acf_blocks() {
    if( function_exists('acf_register_block') ) {
        acf_register_home_block(array(
            'name'				=> 'hero',
            'title'				=> __('Hero'),
            'description'		=> __('Hero afbeelding met tekst'),
            'render_callback'	=> 'NRDQ_acf_block_render_callback',
            'category'			=> 'home',
            'icon'				=> 'cover-image',
            'keywords'			=> array( 'image', 'text', 'link', 'afbeelding', 'tekst', 'hero', 'header'),
            'mode'			    => 'edit', //preview
            'align'             => false,
        ));
        acf_register_home_block(array(
            'name'				=> 'text-wide',
            'title'				=> __('Tekst'),
            'description'		=> __('Volledige breedte tekst blok'),
            'render_callback'	=> 'NRDQ_acf_block_render_callback',
            'category'			=> 'home',
            'icon'				=> 'editor-textcolor',
            'keywords'			=> array( 'tekst', 'text'),
            'mode'			    => 'edit', //preview
            'align'             => false,
        ));
        acf_register_home_block(array(
            'name'				=> 'image',
            'title'				=> __('Afbeelding'),
            'description'		=> __('Volledige breedte afbeelding blok'),
            'render_callback'	=> 'NRDQ_acf_block_render_callback',
            'category'			=> 'home',
            'icon'				=> 'format-image',
            'keywords'			=> array( 'image', 'afbeelding'),
            'mode'			    => 'edit', //preview
            'align'             => false,
        ));
        acf_register_home_block(array(
            'name'				=> 'text-img',
            'title'				=> __('Tekst en afbeelding'),
            'description'		=> __('Laat een afbeelding en tekst naast elkaar zien'),
            'render_callback'	=> 'NRDQ_acf_block_render_callback',
            'category'			=> 'home',
            'icon'				=> 'align-right',
            'keywords'			=> array( 'image', 'text', 'afbeeling', 'tekst'),
            'mode'			    => 'edit', //preview
            'align'             => false,
        ));
        acf_register_home_block(array(
            'name'				=> 'featured-posttype',
            'title'				=> __('Posttype uitlichten'),
            'description'		=> __('Diverse posttypes uitlichten'),
            'render_callback'	=> 'NRDQ_acf_block_render_callback',
            'category'			=> 'home',
            'icon'				=> 'screenoptions',
            'keywords'			=> array( 'posttypes', 'cards', 'uitlichten', 'featured', 'berichten'),
            'mode'			    => 'edit', //preview
            'align'             => false,
        ));
        acf_register_home_block(array(
            'name'				=> 'slider',
            'title'				=> __('Slider'),
            'description'		=> __('Afbeelding slider'),
            'render_callback'	=> 'NRDQ_acf_block_render_callback',
            'category'			=> 'home',
            'icon'				=> 'images-alt',
            'keywords'			=> array( 'slider', 'image', 'afbeelding', 'carousel'),
            'mode'			    => 'edit', //preview
            'align'             => false,
        ));
        acf_register_block(array(
            'name'				=> 'cta',
            'title'				=> __('CTA'),
            'description'		=> __('Call to action blok'),
            'render_callback'	=> 'NRDQ_acf_block_render_callback',
            'category'			=> 'custom',
            'icon'				=> 'megaphone',
            'keywords'			=> array( 'cta', 'text', 'knoppen', 'call', 'action'),
            'mode'			    => 'edit', //preview
            'align'             => false,
        ));
    }
}

// change gutenberg image block output
function NRDQ_image_render( $attributes, $content ) {
    if( file_exists( get_template_directory() . '/includes/content/blocks/core-image.php' ) ) {
        ob_start();
        require_once( TEMPLATEPATH . '/includes/content/blocks/core-image.php');
        $output = ob_get_clean();
        return  $output;
    }
    return  $content;
}
function NRDQ_register_image() {
    register_block_type( 'core/image', array(
        'render_callback' => 'NRDQ_image_render',
    ) );
}
//add_action( 'init', 'NRDQ_register_image' );

// function to add wrapper around blocks
function gutenberg_block_wrappers( $block_content, $block ) {
    if ( $block['blockName'] === 'core/gallery' ) {
        $content = '<section><div class="row">';
        $content .= $block_content;
        $content .= '</div></section>';
        return $content;
    }
    return $block_content;
}

add_filter( 'render_block', 'gutenberg_block_wrappers', 10, 2 );

// conditional rules for blocks

function wpse_allowed_block_types($allowed_block_types, $post) {
    // Limit blocks in 'post' post type
    if($post->ID == get_option( 'page_on_front' ) && function_exists('acf_register_block')) {
        global $home_blocks;
        // Return an array containing the allowed block types
        return $home_blocks;
    }
    // Limit blocks in 'page' post type
    elseif($post->post_type == 'page') {
        return $allowed_block_types;
    }
    // Allow defaults in all other post types
    else {
        return $allowed_block_types;
    }
}
add_filter('allowed_block_types', 'wpse_allowed_block_types', 10, 2);

add_action( 'init', 'add_nrdq_lock_meta' );
function add_nrdq_lock_meta() {
    register_post_meta( '', 'nrdq_template_lock', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'boolean',
    ) );
}

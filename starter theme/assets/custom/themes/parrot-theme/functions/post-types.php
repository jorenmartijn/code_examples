<?php // Add custom post type

// custom post type - NAME
//------------------------
/*
function cpt_XXX() {
	$labels = array(
		'name'               => _x( 'XXX', 'post type general name', 'nordique' ),
		'singular_name'      => _x( 'XXX', 'post type singular name', 'nordique' ),
		'menu_name'          => _x( 'XXX', 'admin menu', 'nordique' ),
		'name_admin_bar'     => _x( 'XXX', 'add new on admin bar', 'nordique' ),
		'add_new'            => _x( 'Nieuwe XXX toevoegen', 'book', 'nordique' ),
		'add_new_item'       => __( 'Nieuwe XXX toevoegen', 'nordique' ),
		'new_item'           => __( 'Nieuwe XXX toevoegen', 'nordique' ),
		'edit_item'          => __( 'XXX aanpassen', 'nordique' ),
		'view_item'          => __( 'XXX bekijken', 'nordique' ),
		'all_items'          => __( 'Alle XXX', 'nordique' ),
		'search_items'       => __( 'XXX zoeken', 'nordique' ),
		'parent_item_colon'  => __( 'Parent XXX:', 'nordique' ),
		'not_found'          => __( 'Geen XXX gevonden.', 'nordique' ),
		'not_found_in_trash' => __( 'Geen XXX gevonden in de prullenbak.', 'nordique' )
	);

	$args = array(
		'labels'             => $labels,
    'description'        => __( 'Nieuwe review toevoegen.', 'nordique' ),
		'public'             => false,
		'publicly_queryable' => false,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => 20,
		'supports'           => array( 'title' ),
		'menu_icon' 				 => 'dashicons-format-quote',
	);
	register_post_type( 'XXX', $args );
}

add_action( 'init', 'cpt_XXX' );
*/


// taxonomy - NAME
//-----------------------
/*
function my_taxonomies_references() {
	$labels = array(
		'name'              => _x( 'Categorieën', 'taxonomy general name', 'nordique' ),
		'singular_name'     => _x( 'Categorie', 'taxonomy singular name', 'nordique' ),
		'search_items'      => __( 'Zoek naar categorie', 'nordique' ),
		'all_items'         => __( 'Alle categorieën', 'nordique' ),
		'parent_item'       => __( 'Parent categorie', 'nordique' ),
		'parent_item_colon' => __( 'Parent categorie:', 'nordique' ),
		'edit_item'         => __( 'Categorie aanpassen', 'nordique' ),
		'update_item'       => __( 'Categorie updaten', 'nordique' ),
		'add_new_item'      => __( 'Nieuwe categorie', 'nordique' ),
		'new_item_name'     => __( 'Nieuwe categorie', 'nordique' ),
		'menu_name'         => __( 'Categorieën', 'nordique' ),
	);
	$args = array(
		'labels' 				=> $labels,
		'hierarchical' 	=> true,
		'public'				=> true,
		'_builtin'			=> false,
	);
	register_taxonomy( 'Categorieën', 'werknemer', $args );
}
add_action( 'init', 'my_taxonomies_references', 0 );

*/

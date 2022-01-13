// Custom Post Types
//-------------------------------
add_action( 'init', 'nrdqCreateCustomPostTypes' );

function nrdqCreateCustomPostTypes() {

    // Add args when you need to differentiate between post types
    $cpts = array(
        {{#postTypes}}
        '{{type-slug}}'         => array(
            'singular'          => '{{type-name-singular}}',
            'plural'            => '{{type-name-plural}}',
            'add-e'             => {{#type-add-e}}true{{/type-add-e}}{{^type-add-e}}false{{/type-add-e}},
            'has_archive'       => {{#type-has-archive}}true{{/type-has-archive}}{{^type-has-archive}}false{{/type-has-archive}},
            {{#type-rewrite}}'rewrite'           => array('slug' => '{{type-rewrite}}', 'with_front' => false),{{/type-rewrite}}
            'menu_icon'         => '{{type-dashicon}}',
            'hierarchical'      => {{#type-is-hierarchical}}true{{/type-is-hierarchical}}{{^type-is-hierarchical}}false{{/type-is-hierarchical}},
            {{#type-position}}'menu_position'     => {{type-position}},{{/type-position}}
        ),
        {{/postTypes}}
    );


    foreach ($cpts as $idx => $cpt) {
        $labels = array(
            'name'               => __( ucfirst($cpt['plural']), 'DEFINE_LANG' ),
            'singular_name'      => __( ucfirst($cpt['singular']), 'DEFINE_LANG' ),
            'menu_name'          => __( ucfirst($cpt['plural']), 'DEFINE_LANG' ),
            'name_admin_bar'     => __( ucfirst($cpt['singular']), 'DEFINE_LANG' ),
            'add_new'            => __( (($cpt['add-e']) ? 'Nieuwe ' : 'Nieuw ') . $cpt['singular'] . ' toevoegen', 'DEFINE_LANG' ),
            'add_new_item'       => __( (($cpt['add-e']) ? 'Nieuwe ' : 'Nieuw ') . $cpt['singular'] . ' toevoegen', 'DEFINE_LANG' ),
            'new_item'           => __( (($cpt['add-e']) ? 'Nieuwe ' : 'Nieuw ') . $cpt['singular'] . ' toevoegen', 'DEFINE_LANG' ),
            'edit_item'          => __( ucfirst($cpt['singular']) . ' aanpassen', 'DEFINE_LANG' ),
            'view_item'          => __( ucfirst($cpt['singular']) . ' bekijken', 'DEFINE_LANG' ),
            'all_items'          => __( 'Alle ' . $cpt['plural'], 'DEFINE_LANG' ),
            'search_items'       => __( ucfirst($cpt['plural']) . ' zoeken', 'DEFINE_LANG' ),
            'parent_item_colon'  => __( 'Parent ' . $cpt['plural'], 'DEFINE_LANG' ),
            'not_found'          => __( 'Geen ' . $cpt['plural'] . ' gevonden.', 'DEFINE_LANG' ),
            'not_found_in_trash' => __( 'Geen ' . $cpt['plural'] . ' gevonden in de prullenbak.', 'DEFINE_LANG' )
        );

        $args = array(
            'labels'             => $labels,
            'description'        => __( (($cpt['add-e']) ? 'Nieuwe ' : 'Nieuw ') . $cpt['singular'] . ' toevoegen', 'DEFINE_LANG' ),
            'public'             => (isset($cpt['public'])) ? $cpt['public'] : true,
            'publicly_queryable' => (isset($cpt['publicly_queryable'])) ? $cpt['publicly_queryable'] : true,
            'show_ui'            => (isset($cpt['show_ui'])) ? $cpt['show_ui'] : true,
            'show_in_menu'       => (isset($cpt['show_in_menu'])) ? $cpt['show_in_menu'] : true,
            'query_var'          => (isset($cpt['query_var'])) ? $cpt['query_var'] : true,
            'rewrite'            => (isset($cpt['rewrite'])) ? $cpt['rewrite'] : array(),
            'capability_type'    => (isset($cpt['capability_type'])) ? $cpt['capability_type'] : 'post',
            'has_archive'        => (isset($cpt['has_archive'])) ? $cpt['has_archive'] : true,
            'hierarchical'       => (isset($cpt['hierarchical'])) ? $cpt['hierarchical'] : false,
            'menu_position'      => (isset($cpt['menu_position'])) ? $cpt['menu_position'] : 20,
            'supports'           => (isset($cpt['supports'])) ? $cpt['supports'] : array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'revisions' ),
            'menu_icon' 		 => (isset($cpt['menu_icon'])) ? $cpt['menu_icon'] : 'dashicons-businessman',
            'show_in_rest'       => true
        );
        register_post_type( $idx, $args );
    }
}
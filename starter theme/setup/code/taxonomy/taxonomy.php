// Custom Taxonomies
//-------------------------------
add_action( 'init', 'nrdqcreateCustomTaxonomies' );

function nrdqcreateCustomTaxonomies() {

    $taxonomies = array(
        {{#taxonomies}}
        '{{type-slug}}' => array(
            'singular'      => '{{type-name-singular}}',         // Singular taxonomy name
            'plural'        => '{{type-name-plural}}',       // Plural taxonomy name
            'add-e'         => {{#type-add-e}}true{{/type-add-e}}{{^type-add-e}}false{{/type-add-e}},
            'hierarchical'  => {{#type-is-hierarchical}}true{{/type-is-hierarchical}}{{^type-is-hierarchical}}false{{/type-is-hierarchical}},
            'post_types'    => array({{#post-types}}{{#value}}'{{type}}',{{/value}}{{/post-types}})
        ),
        {{/taxonomies}}
    );

    foreach ($taxonomies as $idx => $tax) {
        $labels = array(
            'name'              => __( ucfirst($tax['plural']), 'DEFINE_LANG' ),
            'singular_name'     => __( ucfirst($tax['singular']), 'DEFINE_LANG' ),
            'search_items'      => __( 'Zoek naar ' . $tax['singular'], 'DEFINE_LANG' ),
            'all_items'         => __( 'Alle ' . $tax['plural'], 'DEFINE_LANG' ),
            'parent_item'       => __( 'Parent ' . $tax['singular'], 'DEFINE_LANG' ),
            'parent_item_colon' => __( 'Parent ' . $tax['singular'] . ':', 'DEFINE_LANG' ),
            'edit_item'         => __( ucfirst($tax['singular']) . ' aanpassen', 'DEFINE_LANG' ),
            'update_item'       => __( ucfirst($tax['singular']) . ' updaten', 'DEFINE_LANG' ),
            'add_new_item'      => __( (($tax['add-e']) ? 'Nieuwe ' : 'Nieuw ') . $tax['singular'], 'DEFINE_LANG' ),
            'new_item_name'     => __( (($tax['add-e']) ? 'Nieuwe ' : 'Nieuw ') . $tax['singular'], 'DEFINE_LANG' ),
            'menu_name'         => __( ucfirst($tax['plural']), 'DEFINE_LANG' ),
        );

        $args = array(
            'labels' 		=> $labels,
            'hierarchical' 	=> (isset($tax['hierarchical'])) ? $tax['hierarchical'] : true,
            'public'		=> (isset($tax['public'])) ? $tax['public'] : true,
            'show_tagcloud' => (isset($tax['show_tagcloud'])) ? $tax['show_tagcloud'] : false,
        );

        register_taxonomy( $idx, $tax['post_types'], $args );
    }
}
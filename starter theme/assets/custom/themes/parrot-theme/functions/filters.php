<?php
// Include ACF on search and Yoast
//--------------------------------
function cf_search_join( $join ) {
    global $wpdb;

    if ( is_search() ) {
        $join .=' LEFT JOIN '.$wpdb->postmeta. ' ON '. $wpdb->posts . '.ID = ' . $wpdb->postmeta . '.post_id ';
    }

    return $join;
}
add_filter('posts_join', 'cf_search_join' );

function cf_search_where( $where ) {
    global $pagenow, $wpdb;

    if ( is_search() ) {
        $where = preg_replace(
            "/\(\s*".$wpdb->posts.".post_title\s+LIKE\s*(\'[^\']+\')\s*\)/",
            "(".$wpdb->posts.".post_title LIKE $1) OR (".$wpdb->postmeta.".meta_value LIKE $1)", $where );
    }
    return $where;
}
add_filter( 'posts_where', 'cf_search_where' );

function cf_search_distinct( $where ) {
  global $wpdb;

  if ( is_search() ) {
      return "DISTINCT";
  }
  return $where;
}
add_filter( 'posts_distinct', 'cf_search_distinct' );


// Add responsive div to embeded elements
//---------------------------------------
add_filter( 'embed_oembed_html', 'wrap_oembed_html', 99, 4 );
function wrap_oembed_html( $cached_html, $url, $attr, $post_id ) {
    return '<div class="responsive-wrapper">' . $cached_html . '</div>';
}


// Add "nocookie" To WordPress oEmbeded Youtube Videos
//----------------------------------------------------
function wpex_youtube_nocookie_oembed( $return ) {
    $return = str_replace( 'youtube', 'youtube-nocookie', $return );
    return $return;
}
add_filter( 'oembed_dataparse', 'wpex_youtube_nocookie_oembed' );
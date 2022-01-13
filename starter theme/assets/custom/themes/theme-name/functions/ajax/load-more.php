<?php
/*
 * Load more / filter
 *
 *
 */

add_action('wp_ajax_load_more_posts', 'load_more_posts');
add_action('wp_ajax_nopriv_load_more_posts', 'load_more_posts');

function load_more_posts()
{

    if (!isset($_POST['count']) || !preg_match('/\d+$/', $_POST['count']) || !isset($_POST['post_type'])) {
        die('Missing data');
    }

    $whitelist = apply_filters('nrdq_load_more_posttype_whitelist', get_post_types(array('public' => true), 'names'), $_POST);

    $post_count = $_POST['count'];
    $post_type = $_POST['post_type'];
    $posts_per_page = defined(strtoupper($post_type) . '_AJAX_LOAD_MORE_COUNT') ? constant(strtoupper($post_type) . '_AJAX_LOAD_MORE_COUNT') : DEFAULT_AJAX_LOAD_MORE_COUNT;
    $order = 'DESC';

    // If offset is 0, use normal number of posts
    if ($post_count == 0) { // When filtering get default archive count
        $posts_per_page = defined(strtoupper($post_type) . '_ARCHIVE_COUNT') ? constant(strtoupper($post_type) . '_ARCHIVE_COUNT') : DEFAULT_ARCHIVE_COUNT;
    }

    if((isset($_POST['order']) && $_POST['order'] == 'random')) {
        $orderby = 'rand(' . get_rand_seed() . ')'; // Use custom seed to fix pagination
    } else {
        $orderby = 'date';
    }

    // Posttype not in whitelist
    if (!in_array($post_type, $whitelist) && $post_type !== $whitelist) {
        die('Unknown post type');
    }

    // Set default query args
    $args = array(
        'post_type'       => $post_type,
        'post_status'     => 'publish',
        'offset'          => $post_count,
        'orderby'         => $orderby,
        'order'           => $order,
        'posts_per_page'  => defined(strtoupper($post_type) . '_AJAX_LOAD_MORE_COUNT') ? constant(strtoupper($post_type) . '_AJAX_LOAD_MORE_COUNT') : DEFAULT_AJAX_LOAD_MORE_COUNT,
    );

    // Set filters
    if (isset($_POST['filter']) && !empty($_POST['filter']) && count($_POST['filter']) > 0) {
        // Initialize
        $args['tax_query'] = array(
            'relation' => 'AND' // intersection of all chosen filters
        );

        // Sanitize userdata
        $filters = array();
        foreach($_POST['filter'] as $idx => $term_id) {
            $term_id = preg_replace('/[^0-9]/', '', $term_id);
            $term = get_term( $term_id );
            if(!$term) continue;

            $filters[$term->taxonomy][] = $term_id;
        }

        // Add tax_query for each taxonomy
        foreach($filters as $tax => $filter) {
            $args['tax_query'] []= array(
                'taxonomy' => $tax,
                'field'    => 'id',
                'operator' => 'IN',
                'terms'    => $filter
            );
        }
    }

    // Set search term
    if (isset($_POST['search']) && $_POST['search']) {
        $args['s'] = esc_sql($_POST['search']);
    }

    $ajax_query = new WP_Query($args);


    // Count total number of posts so we know if we need to show the load more button
    $args['posts_per_page'] = -1;
    $count_query = new WP_Query($args);

    // Initialize return object
    $data = array();
    $data['html'] = '';
    $data['count'] = $count_query->post_count;

    // Set var to be able to discern which cards are new
    $is_ajax = true;
    $filter = true; // For right amount of columns
    $idx = 0;

    // Use output buffering to prevent the cards being printed directly
    ob_start();

    if ($ajax_query->have_posts()) {
        while ($ajax_query->have_posts()) {
            if ($idx >= $posts_per_page) {
                break;
            }

            if ($idx == 0 && $post_count == 0) { // Before first card when filtering, not when only loading more posts
                include(locate_template('includes/content/loader.php'));
            }

            $ajax_query->the_post();
            $id = get_the_ID();

            // Load card
            if (file_exists(locate_template('includes/content/cards/card-' . sanitize_title(strtolower($post_type)) . '.php'))) {
                include(locate_template('includes/content/cards/card-' . sanitize_title(strtolower($post_type)) . '.php'));
            }

            $idx++;
        }
    }

    wp_reset_query();
    $data['html'] .= ob_get_contents();
    ob_end_clean();

    // Return data
    echo json_encode($data);
    die();
}

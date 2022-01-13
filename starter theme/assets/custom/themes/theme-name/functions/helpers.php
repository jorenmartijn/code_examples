<?php
// Add class="is-lead" to the first <p>  -> use add_intro(get_field('field-name'))
function add_intro($content){
    return preg_replace('/<p([^>]+)?>/', '<p$1 class="lead">', $content, 1);
}
//add_filter('the_content', 'add_intro');

/**
 * Get the phone link of an phone number without spaces and extra characters.
 *
 * @param string    $phone The phone number
 *
 * @return string The sanitized phone number with a tel: link in front
 */
function nrdq_get_phone_link($phone){
    $phone_link = preg_replace('/^00/', '+', trim($phone));
    $phone_link = preg_replace('/[^\d\+]+/', '', $phone_link);
    $phone_link = preg_replace('/(\+\d{2})0/', '$1', $phone_link);
    return "tel:" . $phone_link;
}


/**
 * Get the mailto link of an e-mailaddress with antispambot security. When the e-mailaddress doesn't have a correct syntax the function will return a #-sign.
 *
 * @param string    $email The e-mailaddress
 *
 * @return string The secured mailto string or a #-sign.
 */
function nrdq_get_email_link($email){
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        return '#';
    }
    return "mailto:" . antispambot($email, 1);
}

/**
 * Get the name of a specific menu by menu location
 *
 * @param string    $location The location of the menu
 *
 * @return string Menu name
 */
function nrdq_get_menu_name($location){
    $locations = get_nav_menu_locations();
    if(isset($locations[ $location ])){
        $menu_id = $locations[ $location ] ;
        return wp_get_nav_menu_object($menu_id)->name;
    }
    return '';
}

/**
 * Get a pre-defined number of random items from an ACF array field, e.g. relation field or post object field
 *
 * @param integer   $number Number of items to retrieve
 * @param integer   $post_id Post ID of which to retrieve the field.
 * @param string    $fieldname The ACF fieldname of which to retrieve the items
 * @param boolean   $option Retrieve an option field instead of the field of a specific post
 *
 * @return array An array of $number items from the ACF field
 */
function nrdq_get_random_from_field($number, $post_id = 0, $fieldname, $option = false){

    if($post_id == 0 && !$option){
        return array();
    }

    if($option){
        $field = get_field($fieldname, 'option');
    } else {
        $field = get_field($fieldname, $post_id);
    }

    if(!$field){
        return array();
    }

    shuffle($field);

    if(count($field) < $number){
        $number = count($field);
    }

    return array_slice($field, 0, $number);
}


/**
 * Get ACF link field title and return default title when it is empty
 *
 * @param ACF Field   $button An ACF link field object
 *
 * @return string Title of link
 */
function nrdq_get_acf_link_title($button){
    if(!isset($button['title']) || $button['title'] == ''){
        return __('Meer informatie', 'DEFINE_LANG');
    }
    return $button['title'];
}

/**
 * Get ACF link field target and return default target when it is empty
 *
 * @param ACF Field   $button An ACF link field object
 *
 * @return string Target of link
 */
function nrdq_get_acf_link_target($button){
    if(!isset($button['target']) || $button['target'] == ''){
        return '_self';
    }
    return $button['target'];
}

/**
 * Get correct icon class from ACF icon picker field
 *
 * @param ACF Field   $icon An ACF icon field object
 *
 * @return string Icon class
 */
function nrdq_acf_fa_icon_to_class($icon){
    $icon = preg_replace('/\s/', '-', trim($icon));
    $icon = 'far fa-' . $icon;
    return $icon;
}

/**
 * Truncate string to a set amount of words
 *
 * @param string    $phrase The string that needs to be truncated
 * @param integer   $max_words Maximum number of words the returning string needs to have
 *
 * @return string The original string truncated to have only a set amount of words
 */
function nrdq_truncate_sentence($phrase, $max_words = 50) {
    $phrase_array = explode(' ',$phrase);
    if(count($phrase_array) > $max_words && $max_words > 0)
        $phrase = implode(' ',array_slice($phrase_array, 0, $max_words));
    return $phrase;
}

/**
 * Get image URL or default image
 *
 * @param integer $id ID of the image attachment
 * @param string $size size of the image
 *
 * @param string $fallback An optional custom fallback image
 * @return string Image URL
 */
function nrdq_get_image_url($id, $size = 'thumbnail', $fallback = ''){

    if(!$id){
        if(file_exists($fallback)) {
            return esc_url($fallback);
        }
        if(file_exists(home_url('/custom/build/img/default.png'))){
            return home_url('/custom/build/img/default.png');
        } elseif(file_exists(home_url('/custom/build/img/default.jpg'))){
            return home_url('/custom/build/img/default.jpg');
        }
    }
    return esc_url(wp_get_attachment_image_url($id, $size));
}


/**
 * Pretty print mixed content for debugging purposes
 *
 * @param mixed   $data data that needs to be printed
 * @param boolean $print pretty print data
 * @param boolean $console output data to browser console
 * @param boolean $die does the script need to die after printing
 *
 */
if(!function_exists('n_debug')){
    function n_debug($data, $print = true, $console = true, $die = false){

        if($print){
            echo "<pre>";
            print_r($data);
            echo "</pre>";
        }

        if($console){

            // Prepare data if it contains objects
            if(is_array($data)){
                foreach($data as $idx => $val){
                    if(is_object($val)) {
                        $data[$idx] = (array)$val;
                    }
                }
            } else {
                if(is_object($data)) $data = (array)($data);
            }

            echo '<script>';
            echo 'console.log('. json_encode( $data ) .')';
            echo '</script>';
        }

        if($die){
            die();
        }
    }
}

/**
 * Check if string starts with a specific substring.
 *
 * @param string $haystack  the complete string which we are checking
 * @param string $needle    the substring we are checking for
 * @return string
 */
function nrdq_starts_with($haystack, $needle){
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}


/**
 * Check if string ends with a specific substring.
 *
 * @param string $haystack  the complete string which we are checking
 * @param string $needle    the substring we are checking for
 * @return string
 */
function nrdq_ends_with($haystack, $needle){
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

/**
 * Check if the current user is Nordique (or works there :)). It checks based on IP-address or e-mailaddress of the current account.
 * Don't change this function when you need to give other users access to dev function, but use the 2 available filters.
 *
 * @return boolean  Is the current user the developer (Nordique) or not
 */
function is_nordique(){
    $is_nordique = false;

    $ip_whitelist = apply_filters('is_nordique_ips', array(
        '127.0.0.1',
        '217.123.228.68',
        '212.178.117.140',
        '82.73.70.133'
    ));

    if(nrdq_ends_with(wp_get_current_user()->user_email, '@nordique.nl') || in_array($_SERVER['REMOTE_ADDR'], $ip_whitelist)){
        $is_nordique = true;
    }

    return apply_filters( 'is_nordique', $is_nordique );
}

/**
 *  Get current (WPML) locale
 *
 * @param string $default  Default locale
 * @return string Current locale
 */
function nrdq_get_current_locale($default = 'nl_NL'){
    $locale = $default;
    if (class_exists('SitePress')){
        $languages = apply_filters( 'wpml_active_languages', NULL );
        foreach($languages as $l) {
            if ($l['active']) { $locale = $l['default_locale']; break; }
        }
    }
    return $locale;
}

/**
 *  Reformat date
 *
 * @param string $date  Date to reformat
 * @param string $format (default: 'j F Y')   New date formate
 * @param string $initial_format (default: 'd/m/Y')
 * @return string Formatted date
 */
function nrdq_format_date($date, $format = '%e %B %Y', $initial_format = 'd/m/Y'){

    setlocale(LC_ALL, nrdq_get_current_locale());
    $dt = DateTime::createFromFormat($initial_format, $date);
    if(!$dt) return $date;

    return strftime($format, $dt->getTimestamp());
}


/**
 *  Generate default NRDQ pagination
 */
function nrdq_default_pagination() {

    if( is_singular() )
        return;

    global $wp_query;

    if( $wp_query->max_num_pages <= 1 )
        return;

    $paged = get_query_var( 'paged' ) ? absint( get_query_var( 'paged' ) ) : 1;
    $max   = intval( $wp_query->max_num_pages );

    if ( $paged >= 1 )
        $links[] = $paged;

    if ( $paged >= 3 ) {
        $links[] = $paged - 1;
        $links[] = $paged - 2;
    }

    if ( ( $paged + 2 ) <= $max ) {
        $links[] = $paged + 2;
        $links[] = $paged + 1;
    }

    echo '<div class="navigation"><ul>' . "\n";

    /** Previous Post Link */
    if ( get_previous_posts_link() )
        printf( '<li>%s</li>' . "\n", get_previous_posts_link() );

    /** Link to first page, plus ellipses if necessary */
    if ( ! in_array( 1, $links ) ) {
        $class = 1 == $paged ? ' class="active"' : '';

        printf( '<li%s><a href="%s">%s</a></li>' . "\n", $class, esc_url( get_pagenum_link( 1 ) ), '1' );

        if ( ! in_array( 2, $links ) )
            echo '<li>…</li>';
    }

    /** Link to current page, plus 2 pages in either direction if necessary */
    sort( $links );
    foreach ( (array) $links as $link ) {
        $class = $paged == $link ? ' class="active"' : '';
        printf( '<li%s><a href="%s">%s</a></li>' . "\n", $class, esc_url( get_pagenum_link( $link ) ), $link );
    }

    /** Link to last page, plus ellipses if necessary */
    if ( ! in_array( $max, $links ) ) {
        if ( ! in_array( $max - 1, $links ) )
            echo '<li>…</li>' . "\n";

        $class = $paged == $max ? ' class="active"' : '';
        printf( '<li%s><a href="%s">%s</a></li>' . "\n", $class, esc_url( get_pagenum_link( $max ) ), $max );
    }

    /** Next Post Link */
    if ( get_next_posts_link() )
        printf( '<li>%s</li>' . "\n", get_next_posts_link() );

    echo '</ul></div>' . "\n";
}

/**
 * Used for pagination on random ordering
 *
 *
 * @param bool $new
 * @return int Seed
 */
function get_rand_seed($new = false) {
    // Existing seed
    if(isset($_COOKIE['seed']) && !$new) {
        return $_COOKIE['seed'];
    }

    // New seed
    $seed = rand();
    setcookie('seed', $seed, 0, '/');
    return $seed;
}
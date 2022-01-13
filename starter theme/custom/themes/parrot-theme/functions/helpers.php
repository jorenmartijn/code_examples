<?php
//require_once (TEMPLATEPATH . '/functions/helpers/renamePosts.php');
//require_once (TEMPLATEPATH . '/functions/helpers/getYoutubeURLbyID.php');
//require_once (TEMPLATEPATH . '/functions/helpers/cordinatesByAddress.php');

// Add class="is-lead" to the first <p>  -> use add_intro(get_field('field-name'))
function add_intro($content)
{
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
function nrdq_get_phone_link($phone)
{
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
function nrdq_get_email_link($email)
{
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
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
function nrdq_get_menu_name($location)
{
  $locations = get_nav_menu_locations();
  if (isset($locations[$location])) {
    $menu_id = $locations[$location];
    return wp_get_nav_menu_object($menu_id)->name;
  }
  return '';
}


/**
 * Check if string ends with a specific substring.
 * 
 * @param string $haystack  the complete string which we are checking  
 * @param string $needle    the substring we are checking for
 * @return string
 */
function nrdq_ends_with($haystack, $needle)
{
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
function is_nordique()
{
  $is_nordique = false;

  $ip_whitelist = apply_filters('is_nordique_ips', array(
    '127.0.0.1',
    '217.123.228.68',
    '212.178.117.140'
  ));

  if (nrdq_ends_with(wp_get_current_user()->user_email, '@nordique.nl') || in_array($_SERVER['REMOTE_ADDR'], $ip_whitelist)) {
    $is_nordique = true;
  }

  return apply_filters('is_nordique', $is_nordique);
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
function nrdq_get_random_from_field($number, $post_id = 0, $fieldname, $option = false)
{

  if ($post_id == 0 && !$option) {
    return array();
  }

  if ($option) {
    $field = get_field($fieldname, 'option');
  } else {
    $field = get_field($fieldname, $post_id);
  }

  if (!$field) {
    return array();
  }

  shuffle($field);

  if (count($field) < $number) {
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
function nrdq_get_acf_link_title($button)
{
  if (!isset($button['title']) || $button['title'] == '') {
    return __('More information');
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
function nrdq_get_acf_link_target($button)
{
  if (!isset($button['target']) || $button['target'] == '') {
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
function nrdq_acf_fa_icon_to_class($icon)
{
  $icon = preg_replace('/\s/', '-', trim($icon));
  $icon = 'far fa-' . $icon;
  return $icon;
}

function get_variable_button($repeater = '', $button = '', $color = '', $full_width = false)
{
  $class = ($full_width) ? 'is-full-width' : '';

  if (!$repeater) {
    if (!$button) $button = get_sub_field('var_button_link');
    if (!$color) $color = (get_sub_field('var_button_color')) ?: 'primary';



    if ($button) {

      return '<a href="' . esc_url($button['url']) . '" target="' . esc_attr(nrdq_get_acf_link_target($button)) . '" class="btn-' . esc_attr($color) . ' has-arrow ' . $class .  '">' . esc_html(nrdq_get_acf_link_title($button)) . '</a>';
    }
  } else {

    $buttons = '';

    $repeater_field = get_sub_field($repeater);

    if (!$repeater_field) {
      $repeater_field = get_field($repeater);
    }

    if ($repeater_field) {
      foreach ($repeater_field as $row) {
        $button = $row['var_button_link'];
        $color = (isset($row['var_button_color']) && !empty($row['var_button_color'])) ? $row['var_button_color'] : 'primary';
        if ($button) {
          $buttons .= '<a href="' . esc_url($button['url']) . '" target="' . esc_attr(nrdq_get_acf_link_target($button)) . '" class="btn-' . esc_attr($color) . ' has-arrow ' . $class .  '">' . esc_html(nrdq_get_acf_link_title($button)) . '</a>';
        }
      }
      return $buttons;
    }
  }
}

/******************************
Parse youtube and vimeo urls
 ******************************/

function parse_video_uri($url)
{

  // Parse the url 
  $parse = parse_url($url);

  // Set blank variables
  $video_type = '';
  $video_id = '';

  // Url is http://youtu.be/xxxx
  if ($parse['host'] == 'youtu.be') {

    $video_type = 'youtube';

    $video_id = ltrim($parse['path'], '/');
  }

  // Url is http://www.youtube.com/watch?v=xxxx 
  // or http://www.youtube.com/watch?feature=player_embedded&v=xxx
  // or http://www.youtube.com/embed/xxxx
  if (($parse['host'] == 'youtube.com') || ($parse['host'] == 'www.youtube.com')) {

    $video_type = 'youtube';

    parse_str($parse['query']);

    $video_id = $v;

    if (!empty($feature))
      $video_id = end(explode('v=', $parse['query']));

    if (strpos($parse['path'], 'embed') == 1)
      $video_id = end(explode('/', $parse['path']));
  }

  // Url is http://www.vimeo.com
  if (($parse['host'] == 'vimeo.com') || ($parse['host'] == 'www.vimeo.com') || ($parse['host'] == 'player.vimeo.com')) {

    $video_type = 'vimeo';

    $video_id = str_replace('video/', '',  ltrim($parse['path'], '/'));
  }

  // If recognised type return video array
  if (!empty($video_type)) {
    $video_array = array(
      'type' => $video_type,
      'id' => $video_id
    );
    return $video_array;
  } else {
    return false;
  }
}

// get youtube image by URL
function getVideoImage($url)
{
  $video_parsed = parse_video_uri($url);
  $thumbnail_url = '';

  // get youtube thumbnail
  if ($video_parsed['type'] == 'youtube') {
    $thumbnail_uri = 'https://img.youtube.com/vi/' . $video_parsed['id'] . '/hqdefault.jpg';
  }
  // get vimeo thumbnail
  if ($video_parsed['type'] == 'vimeo') {
    $thumbnail_uri = get_vimeo_thumbnail_uri($video_parsed['id']);
  }
  return $thumbnail_uri;
}

function get_vimeo_thumbnail_uri($clip_id)
{
  $vimeo_api_uri = 'https://vimeo.com/api/v2/video/' . $clip_id . '.php';
  $vimeo_response = file_get_contents($vimeo_api_uri);
  if (is_wp_error($vimeo_response)) {
    return $vimeo_response;
  } else {
    $vimeo_response = unserialize($vimeo_response);
    return $vimeo_response[0]['thumbnail_large'];
  }
}

function post_has_sidebar()
{
  $post_id = get_the_ID();
  if (get_field('post_has_sidebar', $post_id) === "sidebar_none" || is_front_page()) {
    return false;
  }
  return true;
}

function get_section_class($classes)
{
  $background_color = get_sub_field('var_background_color');
  $padding = get_sub_field('var_whitespace');

  if ($background_color != 'white' && $background_color != '') $classes .= ' bg-active ' . $background_color . ' light-bg';
  if ($padding != 'pad') $classes .= ' ' . $padding;

  return $classes;
}

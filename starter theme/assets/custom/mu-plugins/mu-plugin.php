<?php
/*
  Plugin Name: Nordique Security
  Plugin URI: http://www.nordique.nl
  Description: Nordique specific security measurements
  Author: Nordique
  Version: 1.0
  Changelog: (see changelog.txt)
 */


// Login-Lockout plugin, indirect here so that it works with mu-plugin rules
if ( constant('NORDIQUE_LIMIT_LOGIN_ATTEMPTS') == true) {
    $lla_path = dirname(__FILE__)."/limit-login-attempts/limit-login-attempts.php";
    if ( file_exists($lla_path) ) { require_once($lla_path); }
}

// Force strong passwords, indirect here so that it works with mu-plugin rules
if ( constant('NORDIQUE_FORCE_STRONG_PASSWORDS') == true ) {
    $fsp_path = dirname(__FILE__)."/force-strong-passwords/slt-force-strong-passwords.php";
    if ( file_exists($fsp_path) ) { require_once($fsp_path); }
}

// Prevent weird problems with logging in due to Object Caching
// example: password has been changed, but Object Cache still holds old password, and therefore prevents login
if ( defined( 'WP_CACHE' ) && WP_CACHE ) {
    add_filter( 'wp_authenticate_user', 'nrdq_refresh_user' );
    function nrdq_refresh_user( $user ) {
        wp_cache_delete( $user->user_login, 'userlogins' );
        return get_user_by( 'login', $user->user_login );
    }
}

<?php

use Nordique\App;

// Include WordPress if it exists, otherwise use available DB credentials en try to make do
if(file_exists('../core/wp-load.php')) {
    require_once('../core/wp-load.php');
} else {
    define( 'DB_CREDENTIALS_PATH', dirname( __FILE__ ) . '/../custom/config' ); // cache it for multiple use
    define( 'WP_LOCAL_SERVER', file_exists( DB_CREDENTIALS_PATH . '/wp-local-config.php' ) );
    define( 'WP_STAGING_SERVER', file_exists( DB_CREDENTIALS_PATH . '/wp-staging-config.php' ) );
    define( 'WP_LIVE_SERVER', file_exists( DB_CREDENTIALS_PATH . '/wp-live-config.php' ) );

    if ( WP_LOCAL_SERVER ){
        require DB_CREDENTIALS_PATH . '/wp-local-config.php';
    } elseif ( WP_STAGING_SERVER ) {
        require DB_CREDENTIALS_PATH . '/wp-staging-config.php';
    } else {
        require DB_CREDENTIALS_PATH . '/wp-live-config.php';
    }
}

include(dirname(__FILE__) . '/vendor/autoload.php');

spl_autoload_register(function ($classname) {

    $prefix = 'Nordique\\';

    $len = strlen($prefix);
    if (strncmp($prefix, $classname, $len) !== 0) {
        return;
    }

    $className = substr($classname, $len);
    $className = str_replace('\\', '/', $className);

    if (file_exists('includes/' . $className . '.php')) {
        include_once 'includes/' . $className . '.php';
    } else {
        die('File does not exist: ' . $className);
    }
});

echo App::run();

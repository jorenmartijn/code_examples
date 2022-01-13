<?php

namespace Nordique;

class App {

    private static $url;
    private static $path;

    const patterns = array(
        '^setup$' => array('function' => 'index', 'priority' => 500),
        '^setup/\?single\=cards/.*$' => array('function' => 'single', 'priority' => 450),
    );

    public static function run(){
        $protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";

        $url = $protocol . $_SERVER['HTTP_HOST'];
        self::$url = $url;

        if(strpos( self::$url, 'nrdq.nl') === false && strpos(self::$url, '.test') === false){
            die('This can not be used on a live site.');
        }

        self::$path = str_replace('/setup/includes', '/', dirname(__FILE__));

        return self::url(substr($_SERVER['REQUEST_URI'], 1));
    }

    public static function hasWP() {
        if ( !defined('ABSPATH') ) {
            return false;
        }
        return true;
    }

    public static function getPath(){
        return self::$path;
    }

    public static function getUrl(){
        return self::$url;
    }

    public static function getThemePath() {
        $db = Database::getInstance();
        $stylesheet = $db->sql('SELECT `option_value` FROM wpn_options WHERE `option_name` = :option_name', array(':option_name' => 'stylesheet'));

        if($stylesheet && count($stylesheet) > 0 && strpos($stylesheet[0]['option_value'], 'twenty') === false){
            return self::getPath() . 'custom/themes/' . $stylesheet[0]['option_value'] . '/';
        }

        return self::getPath() . 'custom/themes/theme-name/';
    }

    private static function url($url){
        $handlers = array();

        $post = (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'POST');

        if ($url == '/'){
            $url = '';
        }

        $url = rtrim($url, '/');

        if (substr($url, 0, 1) == '/'){
            $url = substr($url, 1);
        }



        // sort patterns by priority
        $patterns = self::patterns;
        uasort($patterns, array(__CLASS__, 'sort_by_priority'));

        foreach($patterns as $pattern => $data){

            if (preg_match('%' . $pattern . '%', $url, $matches)){

                $setup_controller = new \Nordique\Setup();

                if($post) {
                    $view = call_user_func_array(array($setup_controller, $data['function'] . 'Posted'), array());
                } else {
                    $view = call_user_func_array(array($setup_controller, $data['function']), array());
                }


                if ($view){
                    return $view;
                }

            }

        }
        die('No controller found');

    }

    private static function sort_by_priority($a, $b){
        if ($a['priority'] == $b['priority']) {
            return 0;
        }
        return ($a['priority'] < $b['priority']) ? -1 : 1;
    }

    public static function debug($data, $print = true, $console = true, $die = false){

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
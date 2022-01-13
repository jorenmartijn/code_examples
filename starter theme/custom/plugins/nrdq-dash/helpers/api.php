<?php
  
  
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

function nrdq_dash_is_dev(){
  $is_dev = false;
  $ip_whitelist = NRDQ_Dash_Utils::get_dev_ip_whitelist();
  if(NRDQ_Dash_Utils::ends_with(wp_get_current_user()->user_email, '@nordique.nl') || in_array($_SERVER['REMOTE_ADDR'], $ip_whitelist)){
    $is_dev = true;
  }
  return apply_filters( 'nrdq_dash_is_dev', $is_dev );
}

if(!function_exists('return_bytes')){
  function return_bytes($val) {
      $val = trim(intval($val));
      $last = strtolower($val[strlen($val)-1]);
      switch($last) {
          case 'g':
              $val *= 1024;
          case 'm':
              $val *= 1024;
          case 'k':
              $val *= 1024;
      }
      return $val;
  }
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
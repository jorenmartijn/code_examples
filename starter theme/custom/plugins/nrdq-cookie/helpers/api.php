<?php

/*
 * Types
 * 1. Functioneel => functional
 * 2. Analytisch => analytics
 * 3. Sociaal => social
 * 4. Advertenties => ads
 *
 *
 */

if(!function_exists('nrdq_check_cookie_level')) {
  function nrdq_check_cookie_level($type){
    if(is_int($type)){
      if(isset($_COOKIE['cookie_status']) && $_COOKIE['cookie_status'] >= $type){
        return true;
      }
      if(isset($_COOKIE['cookie_settings'])){
        $cookies = \NRDQ_Cookie_Controller::break_cookie($_COOKIE['cookie_settings']);
        if(isset($cookies['level']) && $cookies['level'] >= $type){
          return true;
        }
      }
      return false;
    }

    if($type === 'functional') {return apply_filters('nrdq_cookie_allow_functional_cookies', true);}
    if(isset($_COOKIE['cookie_settings'])){
      $cookies = \NRDQ_Cookie_Controller::break_cookie($_COOKIE['cookie_settings']);
      foreach($cookies as $index => $value){
        if($index == $type){
          if($value == 'true'){
            return true;
          }
          return false;
        }
      }
    }
    return false;
  }
}

function nrdq_cookie_is_pro(){
  return (defined('NRDQ_COOKIE_IS_PRO') && NRDQ_COOKIE_IS_PRO);
}

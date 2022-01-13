<?php
/*
 * Zipcode API
 *
 *
 */

add_action( 'wp_ajax_get_address', 'nrdq_get_address_records' ); // default AJAX action
add_action( 'wp_ajax_nopriv_get_address', 'nrdq_get_address_records' ); // default AJAX action

function nrdq_get_address_records() {
    if(!defined('ZIPCODE_API_KEY')) {
        die("API Key not set");
    }

    $postcode = $_POST['postcode_check'];
    $numbers = $_POST['number_check'];

    $matches = array();

    // Remove addition
    preg_match('/^([0-9]+)/', $numbers, $matches);

    if (!$matches || count($matches) < 2){
        die();
    } else {
        $numbers = $matches[1];
    }

    $apiKey = ZIPCODE_API_KEY;

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.postcodeapi.nu/v3/lookup/" . $postcode . "/" . $numbers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            "x-api-key: " . $apiKey
        ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);

    if(!$err){
        echo $response;
    }

    die();
}
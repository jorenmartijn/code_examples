<?php
function geocode($address) {
    $url = sprintf('https://maps.googleapis.com/maps/api/geocode/json?address=%s', urlencode($address));

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    // grab URL and pass it to the browser
    $result = curl_exec($ch);

    if (curl_getinfo($ch, CURLINFO_HTTP_CODE) !== 200) {
        throw new Exception('Geocode failed');
    }

    // close cURL resource, and free up system resources
    curl_close($ch);

    $json = json_decode($result, true);
    return $json;
}

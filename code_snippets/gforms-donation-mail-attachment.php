<?php
/**
 * Functions to manipulate a Gravity Forms submission and 
 * add a custom attachment to a donation confirmation email in the form of a donation certificate
 */
add_filter('gform_notification_6', 'add_attachment_pdf', 10, 3); //target form id 6, live
function add_attachment_pdf( $notification, $form, $entry ) {
    //There is no concept of user notifications anymore, so we will need to target notifications based on other criteria,
    //such as name or subject
    if($notification["name"] == "Bedankt voor je donatie!"){
		//get upload root for WordPress
		$upload = wp_upload_dir();
		$upload_path = $upload["basedir"];
        $baseurl = $upload['baseurl'];

        // Make the entry data more manageable
        $aanhef = $entry[15];
        $voornaam = $entry[1];
        $tussenvoegsel = $entry[16];
        $achternaam = $entry[2];

        // Switch between the different donation types
        switch($entry[13]) {
            case 'donation-3|75':
                $size = 10;
            break;
            case 'donation-2|30';
                $size = 4;
            break;
            case 'donation-1|7.5';
                $size = 1;
            break;
            case 'donation-4|0';
                $size = $entry["14.3"];
            break;
        }
        
		$attachment = generateCertificate($aanhef, $voornaam, $tussenvoegsel, $achternaam, $size, $upload_path);
        // foreach ( $form['fields'] as $field ) {
        //     $notification["message"] .= $field->type . '<br/>';
        //  }
        $notification["message"] .=  "<img src=\"{$baseurl}/certificates/{$attachment}\"/>";
    }
	//return altered notification object
    return $notification;
}

add_filter( 'gform_mollie_payment_description', 'natuurfonds_mollie_description', 10, 3 );
function natuurfonds_mollie_description ( $description, $strings, $entry ) {
    if(rgar($entry, 'form_id') == 6) {
         $description = 'Groninger Natuurfonds donatie';
    }
    return $description;
}

//Generates a certificate
function generateCertificate( $prefix, $first_name, $addition, $last_name, $size, $upload_dir) {
    //header('Content-type: image/jpeg');
    $name = implode(" ", [$prefix, $first_name, $addition, $last_name]);    
    
    // Create Image From Existing File
    $jpg_image = imagecreatefromjpeg($upload_dir.'/certificates/base/certificate.jpg');

    // Allocate A Color For The Text
    $black = imagecolorallocate($jpg_image, 0, 0, 0);

    // Set Path to Font File
    $font_path = $upload_dir."/certificates/base/Verdana.ttf";

    // Print Text On Image
    imagettftext($jpg_image, 15, 0,160, 260, $black, $font_path, $name); // Name position
    imagettftext($jpg_image, 18, 0,270, 420, $black, $font_path, $size); // How many square meters
    imagettftext($jpg_image, 10, 0,285, 520, $black, $font_path, date('d-m-Y')); // How many square meters
    
    // Save the image to disk.
    ob_start();
	imagepng($jpg_image);
	$data = ob_get_clean();

	$filename = date('ymd').bin2hex(bin2hex(random_bytes(8))).".jpg"; // Date string + random hash
	file_put_contents("{$upload_dir}/certificates/{$filename}", $data); // Stores a certificate image in the uploads folder
    return $filename; 
}
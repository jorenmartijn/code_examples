<?php
// Block bad Queries
global $user_ID; if($user_ID) {
	if(!current_user_can('level_10')) {
		if (strlen($_SERVER['REQUEST_URI']) > 255 ||
			stripos($_SERVER['REQUEST_URI'], "CONCAT") ||
			stripos($_SERVER['REQUEST_URI'], "UNION+SELECT") ||
			stripos($_SERVER['REQUEST_URI'], "base64")) {
				@header("HTTP/1.1 414 Request-URI Too Long");
				@header("Status: 414 Request-URI Too Long");
				@header("Connection: Close");
				@exit;
		}
	}
}

// Remove error mesage in login
add_filter('login_errors', function($a){return 'De ingevulde gegevens zijn onjuist.';});
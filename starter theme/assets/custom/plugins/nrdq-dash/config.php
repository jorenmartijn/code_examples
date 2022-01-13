<?php
// PLUGIN CONFIGURATION FILE

// Default configuration
define( 'NRDQ_DASH_ADMIN_REQUIRED', true );									//Is er een back-end module nodig bij deze plugin? LET OP: dit geldt ook voor alle back-end functionaliteit!!
define( 'NRDQ_DASH_FRONTEND_REQUIRED', true );								//Is er een front-end module nodig bij deze plugin? LET OP: dit geldt ook voor alle front-end functionaliteit!!
define( 'NRDQ_DASH_MODELS_REQUIRED', false );									//Zijn er custom database tabellen nodig bij deze plugin?
define( 'NRDQ_DASH_JS_REQUIRED', false );											//Is er custom JS nodig in de front-end? Zet deze op false als deze bestanden via de gruntfile ingeladen worden!!
define( 'NRDQ_DASH_CSS_REQUIRED', false );										//Is er custom CSS nodig in de front-end? Zet deze op false als deze bestanden via de gruntfile ingeladen worden!!
define( 'NRDQ_DASH_ADMIN_JS_REQUIRED', true );								//Is er custom JS nodig in de back-end? Zet deze op false als deze bestanden via de gruntfile ingeladen worden!! 
define( 'NRDQ_DASH_ADMIN_CSS_REQUIRED', true );							//Is er custom CSS nodig in de back-end? Zet deze op false als deze bestanden via de gruntfile ingeladen worden!!
define( 'NRDQ_DASH_ENABLE_EMAIL', false );										//Als je deze op true zet vergeet dan niet de SMTP gegevens te definieren (in dit bestand of in de wp-config.php)



//Email configuration
/*
define('NRDQ_DASH_DEFAULT_FROM', 'beheer@nordique.nl');
define('NRDQ_DASH_DEFAULT_FROM_NAME', 'Nordique');
define('NRDQ_DASH_SMTP_SERVER', 'smtp.sendgrid.net');
define('NRDQ_DASH_SMTP_PORT', '587');
define('NRDQ_DASH_SMTP_USER', 'nordique');
define('NRDQ_DASH_SMTP_PASSWORD', '');
*/


// EXTRA DEFINES
define('NRDQ_DASH_DEV_IP_WHITELIST', '127.0.0.1,217.123.228.68,212.178.117.140');

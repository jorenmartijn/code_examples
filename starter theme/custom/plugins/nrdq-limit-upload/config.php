<?php
// PLUGIN CONFIGURATION FILE

// Default configuration
define( 'NRDQ_LIMITUPLOADSIZE_ADMIN_REQUIRED', true );										//Is er een back-end module nodig bij deze plugin? LET OP: dit geldt ook voor alle back-end functionaliteit!!
define( 'NRDQ_LIMITUPLOADSIZE_FRONTEND_REQUIRED', false );								//Is er een front-end module nodig bij deze plugin? LET OP: dit geldt ook voor alle front-end functionaliteit!!
define( 'NRDQ_LIMITUPLOADSIZE_MODELS_REQUIRED', false );									//Zijn er custom database tabellen nodig bij deze plugin?
define( 'NRDQ_LIMITUPLOADSIZE_JS_REQUIRED', false );											//Is er custom JS nodig in de front-end? Zet deze op false als deze bestanden via de gruntfile ingeladen worden!!
define( 'NRDQ_LIMITUPLOADSIZE_CSS_REQUIRED', false );											//Is er custom CSS nodig in de front-end? Zet deze op false als deze bestanden via de gruntfile ingeladen worden!!
define( 'NRDQ_LIMITUPLOADSIZE_ADMIN_JS_REQUIRED', false );								//Is er custom JS nodig in de back-end? Zet deze op false als deze bestanden via de gruntfile ingeladen worden!! 
define( 'NRDQ_LIMITUPLOADSIZE_ADMIN_CSS_REQUIRED', false );								//Is er custom CSS nodig in de back-end? Zet deze op false als deze bestanden via de gruntfile ingeladen worden!!
define( 'NRDQ_LIMITUPLOADSIZE_ENABLE_EMAIL', false );										//Als je deze op true zet vergeet dan niet de SMTP gegevens te definieren (in dit bestand of in de wp-config.php)



//Email configuration
//define('DEFAULT_FROM', 'beheer@nordique.nl');
//define('DEFAULT_FROM_NAME', 'Nordique');
//define('SMTP_SERVER', 'smtp.sendgrid.net');
//define('SMTP_PORT', '587');
//define('SMTP_USER', '');
//define('SMTP_PASSWORD', '');

<?php 
	
namespace NRDQ_Dash;
	
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Helper class for sending emails
 *
 */
 

class Email {
	
	static public function send_email($to, $name, $subject, $data, $file){		
    
    $html = \NRDQ_Dash\View::render($data, 'emails', $file);
    
    if(!defined('NRDQ_DASH_SMTP_SERVER') || !defined('NRDQ_DASH_SMTP_PORT') || !defined('NRDQ_DASH_SMTP_USER') || !defined('NRDQ_DASH_SMTP_PASSWORD')){
      echo "<br /><strong>E-mail credentials not complete, system could not send e-mail!!</strong> <br />";
      echo (!defined('NRDQ_DASH_SMTP_SERVER')) ? "SMTP-server not defined <br />" : 'SMTP-server: ' . NRDQ_DASH_SMTP_SERVER . '<br />';
      echo (!defined('NRDQ_DASH_SMTP_PORT')) ? "SMTP-port not defined <br />" : 'SMTP-port: ' . NRDQ_DASH_SMTP_PORT . '<br />';
      echo (!defined('NRDQ_DASH_SMTP_USER')) ? "SMTP-user not defined <br />" : 'SMTP-user: ' . NRDQ_DASH_SMTP_USER . '<br />';
      echo (!defined('NRDQ_DASH_SMTP_PASSWORD')) ? "SMTP-password not defined <br />" : 'SMTP-password: **********<br />';
      
      return;
    }
    
    $transport = \Swift_SmtpTransport::newInstance(NRDQ_DASH_SMTP_SERVER, NRDQ_DASH_SMTP_PORT)
      ->setUsername(NRDQ_DASH_SMTP_USER)
      ->setPassword(NRDQ_DASH_SMTP_PASSWORD)
    ;

    $message = \Swift_Message::newInstance()

      // Give the message a subject
      ->setSubject($subject)

      // Set the From address with an associative array
      ->setFrom(array(NRDQ_INTRANET_DEFAULT_FROM => NRDQ_INTRANET_DEFAULT_FROM_NAME))

      // Set the To addresses with an associative array
      ->setTo(array($to => $name))

      // Give it a body
      ->setBody($html, 'text/html')
    ;

    $mailer = \Swift_Mailer::newInstance($transport);
    $mailer->send($message);
 	}
	
}
<?php 
	
namespace NRDQ_Cookie;
	
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Helper class for sending emails
 *
 */
 

class Email {
	
	static public function send_email($to, $name, $subject, $data, $file){		
    
    $html = \NRDQ_Cookie\View::render($data, 'emails', $file);
    
    $transport = \Swift_SmtpTransport::newInstance(SMTP_SERVER, SMTP_PORT)
      ->setUsername(SMTP_USER)
      ->setPassword(SMTP_PASSWORD)
    ;

    $message = \Swift_Message::newInstance()

      // Give the message a subject
      ->setSubject($subject)

      // Set the From address with an associative array
      ->setFrom(DEFAULT_FROM)

      // Set the To addresses with an associative array
      ->setTo(array($to => $name))

      // Give it a body
      ->setBody($html, 'text/html')
    ;

    $mailer = \Swift_Mailer::newInstance($transport);
    $mailer->send($message);
 	}
	
}
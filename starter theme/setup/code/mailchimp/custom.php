// An example of a Gravity Form which sends it's data to Mailchimp
$form_id = 1;
add_filter( 'gform_after_submission_' . $form_id, 'send_to_mailchimp', 10, 2 );


function send_to_mailchimp($entry, $form) {
    $mail = rgar($entry, 3);
    $mailchimp = new Nordique\Mailchimp($mail);

    $data = array(
        'FNAME' => rgar($entry, 1),
        'LNAME' => rgar($entry, 2),
    );

    $interests = array();
    $tags = array();

    $mailchimp->insert_or_update($data, $interests, $tags);
    return $entry;
}
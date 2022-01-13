<?php
    // Shortcode to display donation buttons
    function donation_buttons_shortcode($atts) { 
    $a = shortcode_atts( array(
        'page' => 0 // Page ID for the donation form page
        ), $atts );
    return '
    <div class="small-24 medium-24 large-19 large-centered columns">
        <ul class="donation-buttons">
            <li><a href="'.get_permalink($a['page']).'?donation=donation-1" class="align-center-middle" >1 m2 à<br/> € 7,50</a></li>
            <li><a href="'.get_permalink($a['page']).'?donation=donation-2" class="align-center-middle">4 m2 à<br/> € 30,00</a></li>
            <li><a href="'.get_permalink($a['page']).'?donation=donation-3" class="align-center-middle">10 m2 à<br/> € 75,00</a></li>
            <li><a href="'.get_permalink($a['page']).'?donation=donation-4" class="align-center-middle">? keer <br/><sub>€ 7,50 per m2</sub></a></li>
        </ul>
    </div>
    ';
    }
add_shortcode( 'donation_buttons', 'donation_buttons_shortcode' ); 
// Donation count shortcode
function donation_count_shortcode($atts) { 
    // Set up attributes
    $a = shortcode_atts( array(
        'amount' => 0,
        'total_length' => 6 // 6 means the counter goes up to 99999, increase this for larger amounts
        ), $atts );
        
        // Calculate how many digits we have
        $length = strlen($a['amount']);
        // Split each digit into its own array item
        $split = str_split($a['amount']);

        $result = '<ul class="donation-counter">';
        $result .= '<li>&euro;</li>';
        // Prefix amount with zeroes, purely visual 
        for ($i = 0; $i < ($a['total_length'] - $length);$i++) {
            $result .= '<li class="number">0</li>';
        }
        // Loop through each number
        for ($i = 0; $i < $length;$i++) {
        $result .= '<li class="number">'.$split[$i].'</li>';
        }
        $result .= '<li>,-</li>';
        $result .= '</ul>';
    return $result;
}
add_shortcode( 'donation_counter', 'donation_count_shortcode' ); ?>

<?php

namespace Nordique\Cards;

use Nordique\Database;
use Nordique\View;
use Nordique\Write;

class Mailchimp extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Mailchimp',
            'url'           => 'mailchimp',
            'description'   => 'Wordt de nieuwsbrief verstuurd vanuit Mailchimp? Kijk hier voor de opties.'
        );

        $fields = array();

        $this->data = $data;
        $this->fields = $fields;
    }

    public function getIcon()
    {
        return array(
            'icon'  => 'fab fa-mailchimp',
            'color' => 'orange'
        );
    }


    public function getCode(){
        return array(
            array(
                'title' => 'Embedded Form',
                'automatic'  => 0,
                'code'  => View::renderCode($this->get('url') . '/embed.php')
            ),
            array(
                'title' => 'Maatwerk',
                'automatic'  => 0,
                'code'  => View::renderCode($this->get('url') . '/custom.php')
            ),
        );
    }

    public function onPageLoad(){
        parent::save();

        return true;
    }

    public function needsWP() {
        return false;
    }

}
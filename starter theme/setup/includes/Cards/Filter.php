<?php

namespace Nordique\Cards;

use Nordique\Database;
use Nordique\View;
use Nordique\Write;

class Filter extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Filtering en Sortering',
            'url'           => 'filter',
            'description'   => 'Vind hier informatie over filteren en sorteren binnen archieven.'
        );

        $this->data = $data;
    }
    public function getIcon()
    {
        return array(
            'icon'  => 'fas fa-archive',
            'color' => 'purple'
        );
    }

    public function getCode(){
        return array(
            array(
                'title' => 'AJAX versie',
                'automatic'  => 0,
                'code'  => View::renderCode($this->get('url') . '/filter-ajax.php')
            ),
            array(
                'title' => 'Normale versie',
                'automatic'  => 0,
                'code'  => View::renderCode($this->get('url') . '/filter.php')
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
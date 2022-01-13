<?php

namespace Nordique\Cards;

use Nordique\Database;
use Nordique\View;
use Nordique\Write;

class GoogleMaps extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Google Maps',
            'url'           => 'google-maps',
            'description'   => 'Gebruikt je site Google Maps. Genereer dan een API-code en geef deze hier in, zodat alles scripts automatisch worden ingeladen.'
        );

        $fields = array(
            'api_key'
        );

        $this->data = $data;
        $this->fields = $fields;
    }

    public function getApiKey(){
        return $this->getField('api_key');
    }

    public function getIcon()
    {
        return array(
            'icon'  => 'fas fa-map-marker-alt',
            'color' => 'red'
        );
    }

    public function getMap(){
        $code = View::renderCode('google-maps/map.php', ['obj' => $this]);
        $code .= "\n\n";

        return $code;
    }

    public function getCode(){
        return array(
            array(
                'title' => 'Google Maps ACF',
                'automatic'  => 1,
                'code'  => View::renderCode('google-maps/acf.php', ['key' => $this->getApiKey()])
            ),
            array(
                'title' => 'Google Maps Scripts',
                'automatic'  => 1,
                'code'  => View::renderCode('google-maps/scripts.php', ['key' => $this->getApiKey()])
            ),
            array(
                'title' => 'Google Map',
                'automatic'  => 0,
                'code'  => View::renderCode('google-maps/map.php', ['key' => $this->getApiKey()])
            )
        );
    }

    public function save(){
        $this->saveFields();

        if(!Write::code('Google Maps ACF', 'functions/admin.php', 'google-maps/acf.php', ['key' => $this->getApiKey()])) {
            return false;
        }

        if (!Write::code('Google Maps Scripts', 'functions/scripts.php', 'google-maps/scripts.php', ['key' => $this->getApiKey()])) {
            return false;
        }

        if (!Write::code('Google Maps Code', 'examples.php', 'google-maps/code-example.php', ['obj' => $this])) {
            return false;
        }

        parent::save();

        return true;
    }

    public function needsWP() {
        return false;
    }

}
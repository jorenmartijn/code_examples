<?php

namespace Nordique\Cards;

use Nordique\Database;
use Nordique\View;
use Nordique\Write;

class Popup extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Popup',
            'url'           => 'popup',
            'description'   => 'Bevat de site popups. Inclusief een aantal voorbeelden voor popups bij pageload, verlaten van de pagina en na klik.'
        );

        $fields = array(
            'has_popup'
        );

        $this->data = $data;
        $this->fields = $fields;
    }

    public function getIcon()
    {
        return array(
            'icon'  => 'fas fa-window-restore',
            'color' => 'orange'
        );
    }

    public function hasPopup(){
        return $this->getField('has_popup');
    }

    public function getAllPopups(){
        $code = View::renderCode('popup/load.php');
        $code .= "\n\n";

        $code .= View::renderCode('popup/leave.php');
        $code .= "\n\n";

        $code .= View::renderCode('popup/click.php');
        $code .= "\n\n";

        $code .= View::renderCode('popup/events.php');

        return $code;
    }

    public function getCode(){
        return array(
            array(
                'title' => 'Popup bij pageload',
                'automatic'  => 0,
                'code'  => View::renderCode('popup/load.php')
            ),
            array(
                'title' => 'Popup bij verlaten pagina',
                'automatic'  => 0,
                'code'  => View::renderCode('popup/leave.php')
            ),
            array(
                'title' => 'Popup na klik',
                'automatic'  => 0,
                'code'  => View::renderCode('popup/click.php')
            ),
            array(
                'title' => 'Popup events',
                'automatic'  => 0,
                'code'  => View::renderCode('popup/events.php')
            )
        );
    }

    public function save(){
        $this->saveFields();

        if ($this->hasPopup() && !Write::code('Popup Code', 'examples.php', 'popup/code-example.php', ['obj' => $this])) {
            return false;
        }

        parent::save();

        return true;
    }

    public function needsWP() {
        return false;
    }

}
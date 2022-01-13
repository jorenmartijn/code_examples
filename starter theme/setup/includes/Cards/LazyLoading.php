<?php

namespace Nordique\Cards;

use Nordique\Database;
use Nordique\View;
use Nordique\Write;

class LazyLoading extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Afbeeldingen en lazy loading',
            'url'           => 'lazy-loading',
            'description'   => 'Vind hier informatie over lazyloading met Unveil en Foundation Interchange.'
        );

        $this->data = $data;
    }
    public function getIcon()
    {
        return array(
            'icon'  => 'fas fa-image',
            'color' => 'green'
        );
    }

    public function getAllImageTypes(){
        $code = View::renderCode('lazy-loading/normal.php');
        $code .= "\n\n";

        $code .= View::renderCode('lazy-loading/interchange.php');
        $code .= "\n\n";

        $code .= View::renderCode('lazy-loading/lazy.php');
        $code .= "\n\n";

        $code .= View::renderCode('lazy-loading/lazy-interchange.php');

        return $code;
    }

    public function getCode(){
        return array(
            array(
                'title' => 'Normale afbeeldingen',
                'automatic'  => 0,
                'code'  => View::renderCode($this->get('url') . '/normal.php')
            ),
            array(
                'title' => 'Interchange afbeeldingen',
                'automatic'  => 0,
                'code'  => View::renderCode($this->get('url') . '/interchange.php')
            ),
            array(
                'title' => 'Lazy loaded afbeeldingen',
                'automatic'  => 0,
                'code'  => View::renderCode($this->get('url') . '/lazy.php')
            ),
            array(
                'title' => 'Lazy Interchange afbeeldingen',
                'automatic'  => 0,
                'code'  => View::renderCode($this->get('url') . '/lazy-interchange.php')
            ),
        );
    }

    public function onPageLoad(){

        if (!Write::code('Images Code', 'examples.php', 'lazy-loading/code-example.php', ['obj' => $this])) {
            return false;
        }


        parent::save();

        return true;
    }

    public function needsWP() {
        return false;
    }

}
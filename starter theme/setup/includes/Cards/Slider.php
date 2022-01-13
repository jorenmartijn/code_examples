<?php

namespace Nordique\Cards;

use Nordique\Database;
use Nordique\View;
use Nordique\Write;

class Slider extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Slider',
            'url'           => 'slider',
            'description'   => 'Heeft de site sliders? Met veel (uitgebreide) voorbeelden die je zelf in de site kunt plaatsen.'
        );

        $fields = array(
            'has_slider'
        );

        $this->data = $data;
        $this->fields = $fields;
    }

    public function getIcon()
    {
        return array(
            'icon'  => 'fas fa-images',
            'color' => 'purple'
        );
    }

    public function hasSlider(){
        return $this->getField('has_slider');
    }

    public function getAllSliders(){
        $code = View::renderCode('slider/simple.php');
        $code .= "\n\n";

        $code .= View::renderCode('slider/responsive.php');
        $code .= "\n\n";

        $code .= View::renderCode('slider/complete.php');
        $code .= "\n\n";

        $code .= View::renderCode('slider/events.php');

        return $code;
    }

    public function getCode(){
        return array(
            array(
                'title' => 'Simple slider',
                'automatic'  => 0,
                'code'  => View::renderCode('slider/simple.php')
            ),
            array(
                'title' => 'Responsive slider',
                'automatic'  => 0,
                'code'  => View::renderCode('slider/responsive.php')
            ),
            array(
                'title' => 'Complete slider',
                'automatic'  => 0,
                'code'  => View::renderCode('slider/complete.php')
            ),
            array(
                'title' => 'Slider events',
                'automatic'  => 0,
                'code'  => View::renderCode('slider/events.php')
            )
        );
    }

    public function save(){
        $this->saveFields();

        if ($this->hasSlider() && !Write::code('Slider Code', 'examples.php', 'slider/code-example.php', ['obj' => $this])) {
            return false;
        }

        parent::save();

        return true;
    }

    public function needsWP() {
        return false;
    }

}
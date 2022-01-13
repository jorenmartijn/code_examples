<?php

namespace Nordique\Cards;

use Nordique\App;
use Nordique\Database;
use Nordique\View;
use Nordique\Write;

class Gutenberg extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Gutenberg',
            'url'           => 'gutenberg',
            'description'   => 'Welke Gutenberg blokken moeten er op je site worden toegevoegd. Hiermee worden automatisch de geselecteerde Gutenberg blokken toegevoegd met bijbehorende ACF velden'
        );

        $fields = array(
            'gutenberg-cta',
            'gutenberg-hero',
            'gutenberg-featured-posttype',
            'gutenberg-image',
            'gutenberg-slider',
            'gutenberg-text-img',
            'gutenberg-text-wide'
        );

        $this->data = $data;
        $this->fields = $fields;
    }

    public function gutenbergCta() {
        return $this->getField('gutenberg-cta');
    }

    public function gutenbergHero() {
        return $this->getField('gutenberg-hero');
    }

    public function gutenbergFeaturedPosttype() {
        return $this->getField('gutenberg-featured-posttype');
    }

    public function gutenbergImage() {
        return $this->getField('gutenberg-image');
    }

    public function gutenbergSlider() {
        return $this->getField('gutenberg-slider');
    }

    public function gutenbergTextImg() {
        return $this->getField('gutenberg-text-img');
    }

    public function gutenbergTextWide() {
        return $this->getField('gutenberg-text-wide');
    }

    public function getIcon()
    {
        return array(
            'icon'  => 'fas fa-th-large',
            'color' => 'blue'
        );
    }

    public function deleteAll(){
        $db = Database::getInstance();

        $sql = 'DELETE FROM nrdq_setup WHERE `module` = :module AND `field` LIKE :field';
        $db->sql($sql, [':module' => $this->getModule(), ':field' => 'type-%']);
    }

    public function save() {
        $this->saveFields();

        if($this->gutenbergCta()) {
            Write::addFile('includes/content/blocks/cta.php', 'gutenberg/cta.php');
            Write::addFile('acf-json/group_5eec61831433a.json', 'gutenberg/acf-json/group_5eec61831433a.json');
        }

        if($this->gutenbergHero()) {
            Write::addFile('includes/content/blocks/hero.php', 'gutenberg/hero.php');
            Write::addFile('acf-json/group_5ee7370c69faa.json', 'gutenberg/acf-json/group_5ee7370c69faa.json');
        }

        if($this->gutenbergFeaturedPosttype()) {
            Write::addFile('includes/content/blocks/featured-posttype.php', 'gutenberg/featured-posttype.php');
            Write::addFile('acf-json/group_5ee749b6e8f07.json', 'gutenberg/acf-json/group_5ee749b6e8f07.json');
        }

        if($this->gutenbergImage()) {
            Write::addFile('includes/content/blocks/image.php', 'gutenberg/image.php');
            Write::addFile('acf-json/group_5ee7431fa206a.json', 'gutenberg/acf-json/group_5ee7431fa206a.json');
        }

        if($this->gutenbergSlider()) {
            Write::addFile('includes/content/blocks/slider.php', 'gutenberg/slider.php');
            Write::addFile('acf-json/group_5ee74b06339b0.json', 'gutenberg/acf-json/group_5ee74b06339b0.json');
        }

        if($this->gutenbergTextImg()) {
            Write::addFile('includes/content/blocks/text-img.php', 'gutenberg/text-img.php');
            Write::addFile('acf-json/group_5ee7465f71b6d.json', 'gutenberg/acf-json/group_5ee7465f71b6d.json');
        }

        if($this->gutenbergTextWide()) {
            Write::addFile('includes/content/blocks/text-wide.php', 'gutenberg/text-wide.php');
            Write::addFile('acf-json/group_5ee7426e42505.json', 'gutenberg/acf-json/group_5ee7426e42505.json');
        }

        parent::save();

        return true;
    }

    public function needsWP() {
        return true;
    }

}

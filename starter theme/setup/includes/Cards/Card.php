<?php

namespace Nordique\Cards;

use Nordique\App;
use Nordique\Database;

class Card {

    protected const cards = array(
        'PostType',
        'Taxonomy',
        'TestContent',
        'MainMenu',
        'TopBar',
        'Footer',
        'Socket',
        'Contact',
        'GoogleMaps',
        'Slider',
        'Popup',
        'Favicon',
        'LazyLoading',
        'Filter',
        'Mailchimp'
    );

    public $data;
    public $fields;

    public function get($var){
        return $this->data[$var];
    }

    public function set($var, $data){
        $this->data[$var] = $data;
    }

    public function getUrl(){
        if(!isset($this->data['url']) || empty($this->data['url'])) {
            return '#';
        }

        return App::getUrl() . '/setup/?single=cards/' . $this->data['url'];
    }

    public function getModule(){
        return $this->get('title');
    }

    public function isFinished() {
        $db = Database::getInstance();
        return $db->db_get('finished', $this->getModule());
    }

    public function isDisabled() {
        if($this->needsWP() && !App::hasWP()) {
            return true;
        }
        return false;
    }

    protected function setField($field, $value) {
        $db = Database::getInstance();
        $db->db_update($field, $this->getModule(), $value);
    }

    protected function getField($field){
        $db = Database::getInstance();
        $value = $db->db_get($field, $this->getModule());

        if($value) {
            return $value;
        }

        return '';
    }

    protected function setFinished(){
        $db = Database::getInstance();
        $db->db_update('finished', $this->getModule(), 1);
    }

    protected function getCodeFolder() {
        return App::getPath() . 'setup/code/' . $this->get('url') . '/';
    }

    protected function saveFields(){
        $db = Database::getInstance();
        $fields = $this->fields;

        foreach($fields as $field) {
            if(isset($_POST[$field])) {
                $db->db_update($field, $this->getModule(), $_POST[$field]);
            } else {
                $db->db_update($field, $this->getModule(), 0);
            }

        }
    }


    private function getRandomWords($string, $number) {
        $content = array();
        $words = explode(' ', wp_strip_all_tags($string));
        for($idx = 0; $idx < $number; $idx++){
            $content[] = $words[array_rand($words)];
        }
        return implode(' ', $content);
    }

    protected function getLoremIpsum($type = '') {
        $ch = curl_init();
        $url = 'https://loripsum.net/api/';
        $strip = false;
        $words = 0;

        switch($type) {
            case 'title':
                $words = rand(3,12);
                $url .= '1/short';
                $strip = true;
                break;
            case 'menu-item':
                $words = rand(1,2);
                $url .= '1/short';
                $strip = true;
                break;
            case 'content':
                $paragraphs = rand(1,3);
                $url .= $paragraphs . '/medium/';
                break;
            case 'excerpt':
                $url .= '1/medium';
                $strip = true;
                break;
            default:
                $url .= '1/long/decorate/link/ul/ol/dl/bq/headers';
        }


        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $content = curl_exec($ch);
        curl_close($ch);

        if($words) {
            $content = ucfirst($this->getRandomWords($content, $words));
        }

        if($strip) {
            $content = wp_strip_all_tags($content);
        }

        return $content;

    }

    public function getMenuItem() {
        return $this->getLoremIpsum('menu-item');
    }

    public function getTitle() {
        return $this->getLoremIpsum('title');
    }

    public function getContent() {
        return $this->getLoremIpsum('content');
    }

    public function getExcerpt() {
        return $this->getLoremIpsum('excerpt');
    }

    public static function getAll(){
        return self::cards;
    }

    protected function save() {
        $this->setFinished();
    }

    public function onPageLoad() {}
    public function getCode() {}
    protected function getIcon() {}
    public function getSuccessNotice() {}
    public function getFailureNotice() {}
    public function needsWP() {
        return true;
    }

}
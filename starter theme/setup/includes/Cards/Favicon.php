<?php

namespace Nordique\Cards;

use Nordique\App;
use Nordique\View;
use Nordique\Write;

class Favicon extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Favicon',
            'url'           => 'favicon',
            'description'   => 'Genereer een zip-bestand met het correcte favicon en upload deze hier. Het wordt dan in je site op alle benodigde plekken automatisch aangepast.'
        );

        $this->data = $data;
    }
    public function getIcon()
    {
        return array(
            'icon'  => 'fas fa-icons',
            'color' => 'orange'
        );
    }

    public function getCode(){
        return array(
            array(
                'title' => 'Favicon code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/favicon.php')
            )
        );
    }

    public function uploadFavicon($file) {
        $allowed_mimes = array('application/zip', 'application/octet-stream', 'application/x-zip-compressed', 'multipart/x-zip');
        $target_file = App::getPath() . 'custom/build/favicon/favicon.zip';

        $finfo = finfo_open(FILEINFO_MIME_TYPE);

        if (!in_array(finfo_file($finfo, $file['tmp_name']), $allowed_mimes)) {
            return false;
        }

        finfo_close($finfo);

        if ($file["size"] > 52428800) {
            return false;
        }

        if (move_uploaded_file($file["tmp_name"], $target_file)) {
            $zip = new \ZipArchive;
            if ($zip->open($target_file) === true) {
                $zip->extractTo(App::getPath() . 'custom/build/favicon/');
                $zip->close();
                unlink($target_file);
                return true;
            } else {
                return false; // Unzip failed
            }
            return true;
        } else {
            return false; // Moving zip failed
        }
    }

    public function save(){

        if (isset($_FILES['favicon']['tmp_name']) && $_FILES['favicon']['tmp_name']!="") {
            $upload = $this->uploadFavicon($_FILES['favicon']);

            if(!$upload) {
                return false;
            }

            if (!Write::code('Favicon', 'functions/theme.php', 'favicon/favicon.php')) {
                return false;
            }

        } else {
            return false;
        }

        parent::save();

        return true;
    }

    public function getFailureNotice(){
        return 'Er ging iets mis, upload het zip-bestand alsjeblieft opnieuw';
    }

    public function needsWP() {
        return false;
    }

}
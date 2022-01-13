<?php

namespace Nordique;

class View {


    public static function render($view, $data){

        $data['helpers'] = array(
            'baseUrl'           => App::getUrl(),
            'hasWP'             => App::hasWP(),
        );

        $m = new \Mustache_Engine;
        $base = App::getPath() . 'setup/views/';


        // Render original template
        $contents = file_get_contents($base . $view . '.html');
        $content = $m->render($contents, $data);

        // If single card, render card template
        if(strpos($view, 'cards') !== false) {
            $template = file_get_contents($base . 'card.html');
            $data['content'] = $content;
            $content = $m->render($template, $data);
        }

        // Render index.html
        $template = file_get_contents($base . 'index.html');
        $data['content'] = $content;
        return $m->render($template, $data);
    }

    public static function renderCode($code, $data = array()){
        $m = new \Mustache_Engine;
        $base = App::getPath() . 'setup/code/';

        $contents = file_get_contents($base . $code);
        return $m->render($contents, $data);
    }

    public static function getRandomFile($dir) {
        $files = glob($dir . '/*.*');
        $file = array_rand($files);
        return basename($files[$file]);
    }

}
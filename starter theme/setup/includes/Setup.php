<?php

namespace Nordique;

use Nordique\Cards\Card;

class Setup {

    public function single() {
        $data = array();
        $single = $_GET['single'];

        $data['obj'] = $this->getCardData($single);
        $data['obj']->onPageLoad();

        $view = View::render($single, $data);
        return $view;
    }

    public function singlePosted() {

        $single = $_GET['single'];

        $cards = Card::getAll();

        foreach($cards as $card){
            $card = '\Nordique\Cards\\' . $card;
            $obj = new $card;

            if(strpos($single, $obj->get('url')) !== false) {

                if($obj->save()) {
                    $notice = $obj->getSuccessNotice() ?: 'Wijzigingen opgeslagen. Vergeet niet eventuele benodigde code aan je thema toe te voegen!';
                    $data['notice'] = array('type' => 'success', 'message' => $notice);
                } else {
                    $notice = $obj->getFailureNotice() ?: 'Er ging iets mis, probeer het alsjeblieft nog eens.';
                    $data['notice'] = array('type' => 'error', 'message' => $notice);
                }


                break;
            }
        }
        $data['obj'] = $this->getCardData($single);
        $view = View::render($single, $data);
        return $view;
    }

    public function index(){
        $data = array();

        $cards = Card::getAll();

        foreach($cards as $card){
            $card = '\Nordique\Cards\\' . $card;
            $data['cards'][] = new $card;
        }

        $view = View::render('setup', $data);
        return $view;
    }

    private function getCardData($single) {

        $cards = Card::getAll();

        foreach($cards as $card){
            $card = '\Nordique\Cards\\' . $card;
            $obj = new $card;


            if(strpos($single, $obj->get('url')) !== false) {
                return $obj;
            }
        }
        return null;
    }
}
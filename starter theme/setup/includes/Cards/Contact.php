<?php

namespace Nordique\Cards;

use Nordique\View;
use Nordique\Write;

class Contact extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Contact',
            'url'           => 'contact',
            'description'   => 'Stel hier je contactpagina in en genereer een standaard contactformulier.'
        );

        $fields = array(
            'has_form'
        );

        $this->data = $data;
        $this->fields = $fields;
    }

    public function getIcon()
    {
        return array(
            'icon'  => 'fas fa-phone',
            'color' => 'blue'
        );
    }

    public function getForm(){
        return $this->getField('form_id');
    }

    public function getFormCode() {
        return View::renderCode($this->get('url') . '/form.php', ['form_id' => $this->getForm()]);
    }


    public function hasForm(){
        return $this->getField('has_form');
    }

    public function getCode(){
        return array(
            array(
                'title' => 'Formulier code',
                'automatic'  => 0,
                'code'  => View::renderCode($this->get('url') . '/form.php', ['form_id' => $this->getForm()])
            ),
            array(
                'title' => 'Contactinformatie code',
                'automatic'  => 0,
                'code'  => View::renderCode($this->get('url') . '/contact.php')
            ),
            array(
                'title' => 'Socials code',
                'automatic'  => 0,
                'code'  => View::renderCode($this->get('url') . '/socials.php')
            )
        );
    }

    private function generateContactForm(){
        $form = Write::getCode('contact/form.json');
        if(!$form) {
            return $form;
        }
        return json_decode($form, true);
    }

    public function save(){
        $this->saveFields();

        $currentForm = 0;
        $currentFormId = $this->getField('form_id');

        if($currentFormId) {
            $currentForm = \GFAPI::get_form($currentFormId);
        }

        // Generate and add form
        if($this->hasForm() && !$currentForm && class_exists('GFAPI')){
            $form = $this->generateContactForm();
            if($form) {
                $id = \GFAPI::add_form($form);
                $this->setField('form_id', $id);
            }
        }

        if (!Write::code('Contact Code',  'examples.php', 'contact/contact.php')) {
            return false;
        }

        if (!Write::code('Socials Code', 'examples.php', 'contact/socials.php')) {
            return false;
        }

        parent::save();

        return true;
    }

}
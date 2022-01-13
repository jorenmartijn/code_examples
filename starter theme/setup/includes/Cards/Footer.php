<?php

namespace Nordique\Cards;

use Nordique\Database;
use Nordique\View;
use Nordique\Write;

class Footer extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Footer',
            'url'           => 'footer',
            'description'   => 'Geef hier op wat de footer van de site moet bevatten.'
        );

        $fields = array(
            'has-logo',
            'has-menu',
            'number-of-menus'
        );

        $this->data = $data;
        $this->fields = $fields;
    }

    public function hasLogo(){
        return $this->getField('has-logo');
    }

    public function hasMenu(){
        return $this->getField('has-menu');
    }

    public function numberOfMenus(){
        return $this->getField('number-of-menus');
    }

    public function getAllMenus(){
        $menus = array();
        for($idx = 1; $idx <= $this->numberOfMenus(); $idx++){
            $menus []= $idx;
        }
        return $menus;
    }

    public function getIcon()
    {
        return array(
            'icon'  => 'fas fa-angle-down',
            'color' => 'green'
        );
    }

    public function getCode(){
        return array(
            array(
                'title' => 'Footer code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/footer.php', ['obj' => $this])
            ),
            array(
                'title' => 'Menu code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/menu.php', ['obj' => $this])
            ),
            array(
                'title' => 'Menu registratie code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/register.php', ['obj' => $this])
            ),
        );
    }

    private function createFooterMenu(){

        for($idx = 1; $idx <= $this->numberOfMenus(); $idx++){
            $menu = wp_get_nav_menu_object('Footermenu ' . $idx);
            if(!$menu){
                $menu_id = wp_create_nav_menu('Footermenu ' . $idx);

                if (is_wp_error($menu_id)) {
                    return;
                }

                $item_data = array(
                    'menu-item-classes' => 'generated-menu-item',
                    'menu-item-url' => '#',
                    'menu-item-status' => 'publish',
                    'menu-item-type' => 'custom'
                );

                $level_0 = rand(4, 6);

                for ($idx = 0; $idx < $level_0; $idx++) {
                    $item_data['menu-item-title'] = $this->getMenuItem();
                    $item_id = wp_update_nav_menu_item($menu_id, 0, $item_data);
                }

            } else {
                $menu_id = $menu->term_id;
            }

            $locations = get_nav_menu_locations();

            if(!isset($locations['footer ' . $idx]) || $locations['footer ' . $idx] == 0) {
                $locations['footer ' . $idx] = $menu_id;
            }
            set_theme_mod( 'nav_menu_locations', $locations );
        }

    }

    public function save(){
        $this->saveFields();

        if($this->numberOfMenus() > 0) {
            $this->setField('has-menu', 1);
        } else {
            $this->setField('has-menu', 0);
        }

        if (!Write::code('Footer Menu', 'functions/theme.php', 'footer/register.php', ['obj' => $this])) {
            return false;
        }

        if (!Write::code('Footer Menu', 'includes/nav/footer-nav.php', 'footer/menu.php', ['obj' => $this])) {
            return false;
        }

        if (!Write::code('Footer', 'includes/content/footer.php', 'footer/footer.php', ['obj' => $this])) {
            return false;
        }

        if($this->hasMenu()){
            $this->createFooterMenu();
        }

        parent::save();

        return true;
    }

    public function needsWP() {
        return true;
    }

}
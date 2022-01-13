<?php

namespace Nordique\Cards;

use Nordique\Database;
use Nordique\View;
use Nordique\Write;

class Socket extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Socket',
            'url'           => 'socket',
            'description'   => 'Heeft de site een socket? En wat wordt daar getoond?'
        );

        $fields = array(
            'has-socket',
            'has-menu',
            'has-copyright'
        );

        $this->data = $data;
        $this->fields = $fields;
    }

    public function hasCopyright(){
        return $this->getField('has-copyright');
    }

    public function hasMenu(){
        return $this->getField('has-menu');
    }

    public function hasSocket(){
        return $this->getField('has-socket');
    }

    public function getIcon()
    {
        return array(
            'icon'  => 'fas fa-socks',
            'color' => 'yellow'
        );
    }

    public function getCode(){
        return array(
            array(
                'title' => 'Socket code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/socket.php', ['obj' => $this])
            ),
            array(
                'title' => 'Menu code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/menu.php', ['obj' => $this])
            ),
            array(
                'title' => 'Registratie menu code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/register.php', ['obj' => $this])
            ),
        );
    }

    private function createSocketMenu(){
        $menu = wp_get_nav_menu_object('Socketmenu');
        if(!$menu){
            $menu_id = wp_create_nav_menu('Socketmenu');

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

        if(!isset($locations['socket']) || $locations['socket'] == 0) {
            $locations['socket'] = $menu_id;
        }
        set_theme_mod( 'nav_menu_locations', $locations );
    }

    public function save(){
        $this->saveFields();

        if (!Write::code('Socket Menu', 'functions/theme.php', 'socket/register.php', ['obj' => $this])) {
            return false;
        }

        if (!Write::code('Socket Menu', 'includes/nav/socket-nav.php', 'socket/menu.php', ['obj' => $this])) {
            return false;
        }

        if (!Write::code('Socket', 'includes/content/socket.php', 'socket/socket.php', ['obj' => $this])) {
            return false;
        }

        if($this->hasMenu()){
            $this->createSocketMenu();
        }

        parent::save();

        return true;
    }

    public function needsWP() {
        return true;
    }

}
<?php

namespace Nordique\Cards;

use Nordique\Database;
use Nordique\View;
use Nordique\Write;

class Topbar extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Top bar',
            'url'           => 'top-bar',
            'description'   => 'Heeft de site een topbar? En wat wordt hierin getoond?'
        );

        $fields = array(
            'has-top-bar',
            'has-menu',
            'depth',
            'has-arrows',
            'has-email',
            'has-phone'
        );

        $this->data = $data;
        $this->fields = $fields;
    }

    public function getDepth(){
        return $this->getField('depth');
    }

    public function hasTopBar(){
        return $this->getField('has-top-bar');
    }

    public function hasArrows(){
        return $this->getField('has-arrows');
    }

    public function hasEmail(){
        return $this->getField('has-email');
    }

    public function hasPhone(){
        return $this->getField('has-phone');
    }

    public function hasMenu(){
        return $this->getField('has-menu');
    }

    public function getIcon()
    {
        return array(
            'icon'  => 'fas fa-angle-up',
            'color' => 'blue'
        );
    }

    public function getCode(){
        return array(
            array(
                'title' => 'Top bar code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/top-bar.php', ['obj' => $this])
            ),
            array(
                'title' => 'Desktop Menu code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/desktop-menu.php', ['obj' => $this])
            ),
            array(
                'title' => 'Mobiel Menu code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/mobile-menu.php', ['obj' => $this])
            ),
            array(
                'title' => 'Registratie menu code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/register.php', ['obj' => $this])
            ),
        );
    }

    private function createTopMenu($depth){
        $menu = wp_get_nav_menu_object('Topmenu');
        if(!$menu){
            $menu_id = wp_create_nav_menu('Topmenu');

            if (is_wp_error($menu_id)) {
                return;
            }

            $item_data = array(
                'menu-item-classes' => 'generated-menu-item',
                'menu-item-url' => '#',
                'menu-item-status' => 'publish',
                'menu-item-type' => 'custom'
            );

            $structure_level_0 = array();
            $level_0 = rand(4, 6);
            $level_1 = rand(6, 10);

            for ($idx = 0; $idx < $level_0; $idx++) {
                $item_data['menu-item-title'] = $this->getMenuItem();
                $item_id = wp_update_nav_menu_item($menu_id, 0, $item_data);
                $structure_level_0[] = $item_id;
            }

            if ($depth > 1) {
                for ($idx = 0; $idx < $level_1; $idx++) {
                    $parent_id = $structure_level_0[array_rand($structure_level_0)];
                    $item_data['menu-item-title'] = $this->getMenuItem();
                    $item_data['menu-item-parent-id'] = $parent_id;
                    $item_id = wp_update_nav_menu_item($menu_id, 0, $item_data);
                }
            }
        } else {
            $menu_id = $menu->term_id;
        }

        $locations = get_nav_menu_locations();

        if(!isset($locations['top']) || $locations['top'] == 0) {
            $locations['top'] = $menu_id;
        }
        set_theme_mod( 'nav_menu_locations', $locations );
    }

    public function save(){
        $this->saveFields();

        if (!Write::code('Top Menu', 'functions/theme.php', 'top-bar/register.php', ['obj' => $this])) {
            return false;
        }

        if (!Write::code('Top Menu', 'includes/nav/desktop-top-nav.php', 'top-bar/desktop-menu.php', ['obj' => $this])) {
            return false;
        }

        if (!Write::code('Top Menu', 'includes/nav/mobile-top-nav.php', 'top-bar/mobile-menu.php', ['obj' => $this])) {
            return false;
        }

        if (!Write::code('Top Menu', 'includes/content/top-bar.php', 'top-bar/top-bar.php', ['obj' => $this])) {
            return false;
        }

        if($this->hasMenu()){
            $this->createTopMenu($this->getDepth());
        }

        parent::save();

        return true;
    }

    public function needsWP() {
        return true;
    }

}
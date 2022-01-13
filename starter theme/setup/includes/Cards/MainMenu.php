<?php

namespace Nordique\Cards;

use Nordique\Database;
use Nordique\View;
use Nordique\Write;

class MainMenu extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Hoofdmenu',
            'url'           => 'main-menu',
            'description'   => 'Geef hier alle opties van je hoofdmenu in, zodat er al een basis-versie opgezet kan worden.'
        );

        $fields = array(
            'depth',
            'mega-menu',
            'type-menu',
            'type-view',
            'arrows',
            'has-search'
        );

        $this->data = $data;
        $this->fields = $fields;
    }

    public function getDepth(){
        return $this->getField('depth');
    }

    public function hasMegaMenu() {
        return $this->getField('mega-menu');
    }

    public function hasArrows() {
        return $this->getField('arrows');
    }

    public function isDrilldown(){
        return $this->getField('type-menu') == 'drilldown';
    }

    public function isAccordion(){
        return $this->getField('type-menu') == 'accordion';
    }

    public function isOffCanvas(){
        return $this->getField('type-view') == 'offcanvas';
    }

    public function isOverlay(){
        return $this->getField('type-view') == 'overlay';
    }

    public function hasSearch() {
        return $this->getField('has-search');
    }

    public function getIcon()
    {
        return array(
            'icon'  => 'fas fa-bars',
            'color' => 'purple'
        );
    }

    public function getCode(){
        return array(
            array(
                'title' => 'Desktop menu code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/desktop-menu.php', ['obj' => $this])
            ),
            array(
                'title' => 'Mobiel menu code',
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

    private function createMainMenu($depth){
        $menu = wp_get_nav_menu_object('Hoofdmenu');
        if(!$menu){
            $menu_id = wp_create_nav_menu('Hoofdmenu');

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
            $structure_level_1 = array();
            $level_0 = rand(4, 6);
            $level_1 = rand(6, 10);
            $level_2 = rand(10, 16);

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
                    $structure_level_1[] = $item_id;
                }
            }

            if ($depth > 2) {
                for ($idx = 0; $idx < $level_2; $idx++) {
                    $parent_id = $structure_level_1[array_rand($structure_level_1)];
                    $item_data['menu-item-title'] = $this->getMenuItem();
                    $item_data['menu-item-parent-id'] = $parent_id;
                    $item_id = wp_update_nav_menu_item($menu_id, 0, $item_data);
                }
            }
        } else {
            $menu_id = $menu->term_id;
        }

        $locations = get_nav_menu_locations();

        if(!isset($locations['primary']) || $locations['primary'] == 0) {
            $locations['primary'] = $menu_id;
        }
        set_theme_mod( 'nav_menu_locations', $locations );
    }

    public function save(){
        $this->saveFields();

        if (!Write::code('Main Menu', 'functions/theme.php', 'main-menu/register.php')) {
            return false;
        }

        if (!Write::code('Main Menu', 'includes/nav/main-nav.php', 'main-menu/desktop-menu.php', ['obj' => $this])) {
            return false;
        }

        if (!Write::code('Main Menu', 'includes/nav/mobile-nav.php', 'main-menu/mobile-menu.php', ['obj' => $this])) {
            return false;
        }

        $this->createMainMenu($this->getDepth());

        parent::save();

        return true;
    }

    public function needsWP() {
        return true;
    }

}
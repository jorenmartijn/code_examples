<?php

namespace Nordique\Cards;

use Nordique\App;
use Nordique\Database;
use Nordique\View;
use Nordique\Write;

class Taxonomy extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Taxonomie',
            'url'           => 'taxonomy',
            'description'   => 'Welke taxonomieeen zijn er aanwezig op de site? Aan welke berichttypes zijn deze gekoppeld?'
        );

        $fields = array(
            'type-name-singular',
            'type-name-plural',
            'type-add-e',
            'type-is-hierarchical',
            'type-cpts'
        );

        $this->data = $data;
        $this->fields = $fields;
    }

    public function getIcon()
    {
        return array(
            'icon'  => 'far fa-object-group',
            'color' => 'red'
        );
    }

    public function isPagination($field, $pagination) {
        return $this->getField($field) == $pagination;
    }

    public function getCode(){
        return array(
            array(
                'title' => 'Posttype code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/taxonomy.php', ['taxonomies' => $this->getAllTaxonomies()])
            )
        );
    }

    public function getAllTaxonomies(){
        $taxonomies = array();
        $fields = $this->fields;

        $count = $this->getField('type-count');
        for($idx = 1; $idx <= $count; $idx++){
            $taxonomies[$idx - 1]['type-idx'] = $idx;
            $taxonomies[$idx - 1]['type-slug'] = $this->getField( 'type-slug-' . $idx);
            foreach($fields as $field) {

                switch($field) {
                    case "type-cpts":

                        $activeTypes = explode(',', $this->getField($field . '-' . $idx));
                        $allTypes = $this->getAllPostTypes();

                        // Add default post types
                        $taxonomies[$idx - 1]['post-types'][] = (in_array('page', $activeTypes)) ? array('name' => 'Pagina\'s', 'type' => 'page', 'value' => 1) : array('name' => 'Pagina\'s', 'type' => 'page', 'value' => 0);
                        $taxonomies[$idx - 1]['post-types'][] = (in_array('post', $activeTypes)) ? array('name' => 'Berichten', 'type' => 'post', 'value' => 1) : array('name' => 'Berichten', 'type' => 'post', 'value' => 0);

                        foreach($allTypes as $type) {
                            $taxonomies[$idx - 1]['post-types'][] = (in_array($type['type-slug'], $activeTypes)) ? array('name' => $type['type-name-plural'], 'type' => $type['type-slug'], 'value' => 1) : array('name' => $type['type-name-plural'], 'type' => $type['type-slug'], 'value' => 0);
                        }

                        break;
                    default:
                        $taxonomies[$idx - 1][$field] = $this->getField($field . '-' . $idx);
                }

            }
        }
        return $taxonomies;
    }

    public function getAllPostTypes() {
        $post_types = new PostType();
        return $post_types->getAllPostTypes();
    }

    public function deleteAll(){
        $db = Database::getInstance();

        $sql = 'DELETE FROM nrdq_setup WHERE `module` = :module AND `field` LIKE :field';
        $db->sql($sql, [':module' => $this->getModule(), ':field' => 'type-%']);
    }

    public function save(){
        $fields = $this->fields;

        $idx = 0;

        while(true) {

            ++$idx;

            if(!isset($_POST['type-name-singular-' . $idx]) || empty($_POST['type-name-singular-' . $idx])){
                break;
            }

            $this->setField('type-slug-' . $idx, strtolower($_POST['type-name-plural-' . $idx]));
            foreach($fields as $field) {
                $field = $field . '-' . $idx;
                if(isset($_POST[$field])) {
                    if(is_array($_POST[$field])) {
                        $_POST[$field] = implode(',', $_POST[$field]);
                    }
                    $this->setField($field, $_POST[$field]);
                } else {
                    $this->setField($field, 0);
                }
            }
        }

        $this->setField('type-count', $idx - 1);

        // Set post types
        if (!Write::code('Taxonomies', 'functions/post-types.php', 'taxonomy/taxonomy.php', ['taxonomies' => $this->getAllTaxonomies()])) {
            return false;
        }

        flush_rewrite_rules(false);

        parent::save();

        return true;
    }

    public function needsWP() {
        return true;
    }

}
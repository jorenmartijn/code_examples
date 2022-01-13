<?php

namespace Nordique\Cards;

use Nordique\App;
use Nordique\Database;
use Nordique\View;
use Nordique\Write;

class PostType extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Post Types',
            'url'           => 'post-types',
            'description'   => 'Welke berichttypes moeten er op je site aanwezig. Hiermee worden o.a. eventueel de archieven, cards en single templates al gegenereerd.'
        );

        $fields = array(
            'type-name-singular',
            'type-name-plural',
            'type-add-e',
            'type-dashicon',
            'type-has-archive',
            'type-is-hierarchical',
            'type-rewrite',
            'type-position',
            'type-pagination'
        );

        $this->data = $data;
        $this->fields = $fields;
    }

    public function getIcon()
    {
        return array(
            'icon'  => 'fas fa-mail-bulk',
            'color' => 'yellow'
        );
    }

    public function getCode(){
        return array(
            array(
                'title' => 'Posttype code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/types.php', ['postTypes' => $this->getAllPostTypes()])
            ),
            array(
                'title' => 'Action code',
                'automatic'  => 1,
                'code'  => View::renderCode($this->get('url') . '/action.php', ['postTypes' => $this->getAllPostTypes()])
            )
        );
    }

    public function isPagination($field, $pagination) {
        return $this->getField($field) == $pagination;
    }

    public function getAllPostTypes() {
        $post_types = array();
        $fields = $this->fields;

        $count = $this->getField('type-count');
        for($idx = 1; $idx <= $count; $idx++){
            $post_types[$idx - 1]['type-idx'] = $idx;
            $post_types[$idx - 1]['type-slug'] = $this->getField( 'type-slug-' . $idx);
            foreach($fields as $field) {

                switch($field) {
                    case "type-pagination":
                        $post_types[$idx - 1]['no-pagination'] = $this->isPagination($field . '-' . $idx, 'no-pagination');
                        $post_types[$idx - 1]['default-pagination'] = $this->isPagination($field . '-' . $idx, 'default-pagination');
                        $post_types[$idx - 1]['ajax-pagination'] = $this->isPagination($field . '-' . $idx, 'ajax-pagination');
                        break;
                    default:
                        $post_types[$idx - 1][$field] = $this->getField($field . '-' . $idx);
                }

            }
        }
        return $post_types;
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
                    $this->setField($field, $_POST[$field]);
                } else {
                    $this->setField($field, 0);
                }
            }
        }

        $this->setField('type-count', $idx - 1);

        // Set post types
        if (!Write::code('Post Types', 'functions/post-types.php', 'post-types/types.php', ['postTypes' => $this->getAllPostTypes()])) {
            return false;
        }

        if (!Write::code('Post Types', 'functions/theme.php', 'post-types/action.php', ['obj' => $this])) {
            return false;
        }

        flush_rewrite_rules(false);

        // Add archive, card and single
        $post_type = $this->getAllPostTypes();
        foreach($post_type as $type) {
            $slug = sanitize_title(strtolower($type['type-slug']));

            // Set archive
            if($type['type-has-archive']){
                if (!Write::addFile('archive-' . $slug . '.php', 'post-types/archive.php', $type)) {
                    return false;
                }
            }

            // Set card
            if($type['type-has-archive']){
                if (!Write::addFile('includes/content/cards/card-' . $slug . '.php', 'post-types/card.php', $type)) {
                    return false;
                }
            }

            // Set single
            if (!Write::addFile('single-' . $slug . '.php', 'post-types/single.php', $type)) {
                return false;
            }
        }


        parent::save();

        return true;
    }

    public function needsWP() {
        return true;
    }

}
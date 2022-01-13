<?php

namespace Nordique\Cards;

use Nordique\App;
use Nordique\Database;
use Nordique\View;
use Nordique\Write;

class TestContent extends Card {

    public function __construct(){
        $data = array(
            'title'         => 'Test Content',
            'url'           => 'test-content',
            'description'   => 'Genereer hier gemakkelijk testcontent voor alle berichttypes binnen de site.'
        );

        $this->data = $data;
    }


    private function insertAttachmentFromUrl($url, $parent_post_id = null) {

        if( !class_exists( 'WP_Http' ) )
            include_once( ABSPATH . WPINC . '/class-http.php' );

        $http = new \WP_Http();
        $response = $http->request( $url );
        if( $response['response']['code'] != 200 ) {
            return false;
        }

        $upload = wp_upload_bits( basename($url), null, $response['body'] );
        if( !empty( $upload['error'] ) ) {
            return false;
        }

        $file_path = $upload['file'];
        $file_name = basename( $file_path );
        $file_type = wp_check_filetype( $file_name, null );
        $attachment_title = sanitize_file_name( pathinfo( $file_name, PATHINFO_FILENAME ) );
        $wp_upload_dir = wp_upload_dir();

        $post_info = array(
            'guid'           => $wp_upload_dir['url'] . '/' . $file_name,
            'post_mime_type' => $file_type['type'],
            'post_title'     => $attachment_title,
            'post_content'   => '',
            'post_status'    => 'inherit',
        );

        // Create the attachment
        $attach_id = wp_insert_attachment( $post_info, $file_path, $parent_post_id );

        // Include image.php
        require_once( ABSPATH . 'wp-admin/includes/image.php' );

        // Define attachment I
        $attach_data = wp_generate_attachment_metadata( $attach_id, $file_path );

        // Assign metadata to attachment
        wp_update_attachment_metadata( $attach_id,  $attach_data );

        return $attach_id;

    }

    public function getImage() {
        $attachment_id = get_posts(array('post_type' => 'attachment', 'posts_per_page' => 1, 'orderby' => 'rand', 'fields' => 'ids'));
        if($attachment_id && count($attachment_id) > 0) {
            return array('url' => wp_get_attachment_image_url($attachment_id[0], 'full'), 'id' => $attachment_id[0]);
        }

        return array('url' => 'https://via.placeholder.com/600', 'id' => 0);
    }

    private function getPostContent() {
        $content = '';
        $count = rand(1,20);
        for($idx = 0; $idx < $count; $idx++){
            $template = View::getRandomFile(App::getPath() . 'setup/code/' . $this->data['url']);
            $content .= View::renderCode('test-content/' . $template, ['obj' => $this]);
        }
        return $content;
    }

    private function insertPost($post_type) {
        $post = array(
            'post_title'    => $this->getTitle(),
            'post_content'  => html_entity_decode($this->getPostContent()),
            'post_status'   => 'publish',
            'post_author'   => 1,
            'post_excerpt'  => $this->getExcerpt(),
            'post_type'     => $post_type,
            'post_date'     => date("Y-m-d H:i:s", mt_rand(639666153, time()))
        );
        $post_id = wp_insert_post( $post );

        // Get random attachment
        $attachment_id = get_posts(array('post_type' => 'attachment', 'posts_per_page' => 1, 'orderby' => 'rand', 'fields' => 'ids'));
        if($attachment_id && count($attachment_id) > 0) {
            set_post_thumbnail($post_id, $attachment_id[0]);
        }

        // Set value to identify generated post
        update_post_meta($post_id, '_nrdq_post_is_generated', true);
    }


    public function getIcon()
    {
        return array(
            'icon'  => 'fas fa-file-alt',
            'color' => 'green'
        );
    }


    public function getPostTypes(){
        return array_values(get_post_types(array('public' => true, '_builtin' => false), 'names'));
    }

    private function generateContent($post_type, $number){
        switch ($post_type) {
            case "attachment":
                for($idx = 0; $idx < $number; $idx++){
                    $this->insertAttachmentFromUrl('https://picsum.photos/2560/1440.jpg');
                }
                break;
            default:
                for($idx = 0; $idx < $number; $idx++){
                    $this->insertPost($post_type);
                }
        }
    }

    public function save(){
        $number = 0;
        $action = '';

        foreach($_POST as $item => $val) {
            if($item == 'number') {
                $number = $val;
            } else {
                $action = $item;
            }
        }

        $this->generateContent($action, $number);

        parent::save();

        return true;
    }

    public function needsWP() {
        return true;
    }

}
<?php

namespace Nordique;

defined('ABSPATH') or die('No script kiddies please!');

/**
 * Helper class for sending emails
 *
 */


class Mailchimp
{
    const base_url  = MAILCHIMP_BASE_URL;
    const api_key   = MAILCHIMP_API_KEY;
    const list_id   = MAILCHIMP_LIST_ID;

    private $email;
    private $status;
    private $subscriber_hash;
    private $merge_fields;
    private $tags;
    private $data;
    private $interests;

    public function __construct($email, $status = 'subscribed') {
        $this->email = $email;
        $this->status = $status;
        $this->subscriber_hash = $this->generate_subscriber_hash($email);
    }

    private function parse_fields($insert)
    {
        if($insert) {
            $fields = array(
                'email_address' => $this->email,
                'status'        => $this->status,
                'email_type'    => 'html'
            );
        }

        if($this->merge_fields) {
            foreach($this->merge_fields as $field => $value) {
                $fields['merge_fields'][$field] = $value;
            }
        }

        if($this->tags) {
            foreach($this->tags as $tag) {
                $fields['tags'][] = $tag;
            }
        }


        if($this->interests) {

            foreach($this->interests as $category => $interest) {
                if(!$interest){
                    continue;
                }

                $category_id = $this->get_category_id($category);

                if($category_id) {
                    if(!is_array($interest)) {
                        $interest = array($interest); //convert to array if necessary
                    }

                    foreach($interest as $group) {
                        if(!trim($group)) {
                            continue;
                        }
                        $interest_id = $this->get_interest_id($group, $category_id);

                        if($interest_id)
                            $interests[$interest_id] = true;
                    }
                }

            }

            if($interests) {
                $fields['interests'] = $interests;
            }
        }

        return json_encode($fields);
    }

    private function get_categories() {
        $curl = $this->init_curl('interest-categories');
        $this->run_curl($curl);

        if(isset($this->data->categories)){
            return $this->data->categories;
        }

        return array();
    }

    private function get_interests($category_id) {
        $curl = $this->init_curl('interest-categories/' . $category_id . '/interests');
        $this->run_curl($curl);

        if(isset($this->data->interests)){
            return $this->data->interests;
        }

        return array();
    }

    private function generate_subscriber_hash($email)
    {
        return md5(strtolower($email));
    }

    private function init_curl($url) {
        $curl = new Curl(self::base_url . '/lists/' . self::list_id . '/' . $url);
        $curl->setHTTPHeader(array("Authorization: Basic " . self::api_key));
        return $curl;
    }

    private function run_curl($curl) {
        $curl->createCurl();
        $this->data = json_decode($curl->__toString());
    }

    private function get_category_id($string) {
        if($string == '') {
            return false;
        }

        $categories = $this->get_categories();

        // Search for existing category
        foreach($categories as $category) {
            if(strtolower($category->title) == strtolower($string)) {
                return $category->id;
            }
        }

        // Create new category
        $curl = $this->init_curl('interest-categories');
        $curl->setPost(json_encode(array('title' => ucfirst($string), 'type' => 'hidden')));
        $this->run_curl($curl);

        return $this->data->id;
    }

    private function get_interest_id($string, $category_id) {
        if($string == ''){
            return false;
        }

        $interests = $this->get_interests($category_id);

        // Search for existing interest
        foreach($interests as $interest) {
            if(strtolower($interest->name) == strtolower($string)) {
                return $interest->id;
            }
        }

        // Create new interest
        $curl = $this->init_curl('interest-categories/' . $category_id . '/interests');
        $curl->setPost(json_encode(array('name' => ucfirst($string))));
        $this->run_curl($curl);


        return $this->data->id;
    }

    private function insert()
    {
        $curl = $this->init_curl('members');
        $curl->setPost($this->parse_fields(true));
        $this->run_curl($curl);

        return $this->data;
    }

    private function update()
    {
        $curl = $this->init_curl('members/' . $this->subscriber_hash);
        $curl->setPatch($this->parse_fields(false));
        $this->run_curl($curl);

        return $this->data;
    }

    private function get()
    {
        $curl = $this->init_curl('members/' . $this->subscriber_hash);
        $this->run_curl($curl);
        return $this->data;
    }

    public function insert_or_update($merge_fields, $interests = array(), $tags = array()) {
        $user = $this->get();

        $this->merge_fields = $merge_fields;
        $this->interests = $interests;
        $this->tags = $tags;

        if($user->status != 404) { // User found
            $data = $this->update();
        } else {
            $data = $this->insert();
        }
        return $data;
    }

}

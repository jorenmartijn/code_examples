<?php

defined('ABSPATH') or die('No script kiddies please!');

/**
 * Class which contains the functionality that is required
 * in the public part of the plugin
 *
 */
class NRDQ_Cookie_Public extends NRDQ_Cookie_Controller
{

    public function run()
    {

        if (NRDQ_COOKIE_CSS_REQUIRED) add_action('nrdq_do_header', array($this, 'print_frontend_styles'));
        if (NRDQ_COOKIE_JS_REQUIRED) add_action('nrdq_do_header', array($this, 'print_frontend_scripts'));


        add_action('wp_footer', array($this, 'show_cookie_notice'));
        add_action('nrdq_do_footer', array($this, 'show_cookie_notice'));

        add_action('wp_footer', array($this, 'append_cookie_settings_container'));
        add_action('nrdq_do_footer', array($this, 'append_cookie_settings_container'));

        //Set cookie level ajax action
        add_action('wp_ajax_set_cookie_status', array($this, 'set_cookie_status'));
        add_action('wp_ajax_nopriv_set_cookie_status', array($this, 'set_cookie_status'));

        //Get front-end cookie settings page ajax action
        add_action('wp_ajax_get_cookie_settings', array($this, 'get_cookie_settings'));
        add_action('wp_ajax_nopriv_get_cookie_settings', array($this, 'get_cookie_settings'));

        //Log error
        add_action('wp_ajax_log_error', array($this, 'nrdq_log_error'));
        add_action('wp_ajax_nopriv_log_error', array($this, 'nrdq_log_error'));

        //Add datalayer data for Tag Manager
        add_action('wp_head', array($this, 'output_datalayer_variables'), 1);

        if (get_option($this->language_code . 'nrdq_cookie_debug', "0") == '1') {
            //Add debugging
            add_action('wp_head', array($this, 'add_debugging_code'));
        }

        if (!defined('NRDQ_COOKIE_NOT_ADD_YOUTUBE_NOCOOKIE') || !NRDQ_COOKIE_NOT_ADD_YOUTUBE_NOCOOKIE)
            add_filter('oembed_dataparse', array($this, 'nrdq_cookie_youtube_nocookie_oembed'));


    }

    public function nrdq_cookie_youtube_nocookie_oembed($return)
    {
        $return = str_replace('youtube', 'youtube-nocookie', $return);
        return $return;
    }


    public function show_cookie_notice()
    {

        if ((!isset($_COOKIE['cookie_settings']) || get_option($this->language_code . 'nrdq_cookie_ajax', "0") == "1") && get_option($this->language_code . 'nrdq_cookie_hidden', "0") != "1" && $this->check_ip() && $this->check_user_agent()) {
            $nonce = esc_attr(wp_create_nonce('nrdq-cookie-action-nonce'));
            $position = $this->get_option_or_default('nrdq_cookie_position', 'top', 'nrdq_cookie_notice_position', false);

            $title = $this->get_option_or_default('nrdq_cookie_title', __('Cookie instellingen', 'nrdq-cookie'), 'nrdq_cookie_notice_title');
            $text = $this->get_option_or_default('nrdq_cookie_text', '', 'nrdq_cookie_notice_text');
            $button_accept_text = $this->get_option_or_default('nrdq_cookie_allow', __('Toestaan', 'nrdq-cookie'), 'nrdq_cookie_notice_accept_text');
            $button_not_accept_text = $this->get_option_or_default('nrdq_cookie_disallow', __('Niet toestaan', 'nrdq-cookie'), 'nrdq_cookie_notice_not_accept_text');
            $button_save_text = $this->get_option_or_default('nrdq_cookie_save', __('Toestaan', 'nrdq-cookie'), 'nrdq_cookie_notice_accept_text');

            $cookie_types = $this->cookie_types;
            $cant_refuse = apply_filters('nrdq_cookie_cant_refuse', false);
            $ajax = apply_filters('nrdq_cookie_ajax', $this->get_option_or_default('nrdq_cookie_ajax', '0', 'nrdq_cookie_ajax', false));

            if (nrdq_cookie_is_pro()) {
                echo \NRDQ_Cookie\View::render(compact('nonce', 'text', 'position', 'title', 'cookie_types', 'button_save_text', 'cant_refuse', 'ajax'), 'front-end', 'cookie-notice-pro');
            } else {
                echo \NRDQ_Cookie\View::render(compact('nonce', 'text', 'position', 'button_accept_text', 'button_not_accept_text', 'title', 'cant_refuse', 'ajax'), 'front-end', 'cookie-notice');
            }
        }
    }

    public function append_cookie_settings_container()
    {
        echo \NRDQ_Cookie\View::render(array(), 'front-end', 'cookie-settings');
    }

    public function check_ip()
    {
        $ips = get_option($this->language_code . 'nrdq_cookie_ip', "");
        if (!$ips || empty($ips)) return true;

        $current_ip = $_SERVER['REMOTE_ADDR'];
        $ips = explode(',', preg_replace('[^0-9\.\,]', '', $ips));
        foreach ($ips as $ip) {
            if (trim($ip) == $current_ip) return true;
        }
        return false;
    }


    public function set_cookie_status()
    {
        //Check nonce

        //Disabled nonce check for caching purposes, to enable uncomment next line
        //check_ajax_referer( 'nrdq-cookie-action-nonce', 'nrdq_secure_value' );

        $level = $_POST['level'];
        if (!preg_match('/\d+/', $level)) {
            exit;
        }

        $cookies = array('level' => $level);

        if (empty($_POST['checks'])) {
            foreach ($this->cookie_types as $cookie) {
                $cookies[$cookie['value']] = ($level != 0) ? 'true' : 'false';
            }
        } else {
            foreach ($this->cookie_types as $cookie) {
                foreach ($_POST['checks'] as $check) {
                    if ($check['name'] == $cookie['value']) {
                        $cookies[$cookie['value']] = ($check['val'] == '1') ? 'true' : 'false';
                    }
                }
            }
        }

        $this->increase_option('nrdq_cookie_total_actions');
        if (!nrdq_cookie_is_pro()) {
            $this->increase_option('nrdq_cookie_total_level_' . $level);
        }

        foreach ($cookies as $index => $value) {
            if ($index == 'level') continue;
            if ($value == 'true') $this->increase_option('nrdq_cookie_total_type_' . $index);
        }

        setcookie('cookie_settings', self::build_cookie($cookies), time() + (60 * 60 * 24 * 365), '/');


        echo json_encode("success");
        exit;
    }

    public function get_cookie_settings()
    {

        $title_icon_url = plugins_url() . '/nrdq-cookie/includes/css/svg/setting-icon.svg';
        $close_url = plugins_url() . '/nrdq-cookie/includes/css/svg/close-icon.svg';
        $nonce = esc_attr(wp_create_nonce('nrdq-cookie-action-nonce'));


        $title = $this->get_option_or_default('nrdq_cookie_settings_title', __('Cookie instellingen', 'nrdq-cookie'), 'nrdq_cookie_notice_settings_title');
        $nrdq_cookie_settings_text = $this->get_option_or_default('nrdq_cookie_settings_text', '', 'nrdq_cookie_notice_settings_text');
        $level_0_text = $this->get_option_or_default('nrdq_cookie_settings_disallow', __('De cookies worden overal op de site geblokkeerd.', 'nrdq-cookie'), 'nrdq_cookie_notice_settings_level_0_text');
        $level_10_text = $this->get_option_or_default('nrdq_cookie_settings_allow', __('De cookies worden op dit moment toegestaan.', 'nrdq-cookie'), 'nrdq_cookie_notice_settings_level_10_text');
        $submit_text = $this->get_option_or_default('nrdq_cookie_settings_save', __('Wijzigingen opslaan', 'nrdq-cookie'), 'nrdq_cookie_notice_settings_submit_text');


        $cookie_types = $this->cookie_types;

        if (!nrdq_cookie_is_pro()) {
            echo json_encode(\NRDQ_Cookie\View::render(compact('nonce', 'nrdq_cookie_settings_text', 'close_url', 'level_0_text', 'level_10_text', 'submit_text', 'title', 'title_icon_url'), 'front-end', 'cookie-settings-content'));
        } else {
            echo json_encode(\NRDQ_Cookie\View::render(compact('nonce', 'nrdq_cookie_settings_text', 'close_url', 'level_0_text', 'level_10_text', 'submit_text', 'title', 'title_icon_url', 'cookie_types'), 'front-end', 'cookie-settings-content-pro'));
        }

        exit;
    }

    public function add_debugging_code()
    {
        if (nrdq_check_cookie_level('functional')) {
            echo '<h2>This is a functional cookie</h2>';
        }

        if (nrdq_check_cookie_level('analytics')) {
            echo '<h2>This is an analytics cookie</h2>';
        }

        if (nrdq_check_cookie_level('social')) {
            echo '<h2>This is a social cookie</h2>';
        }

        if (nrdq_check_cookie_level('ads')) {
            echo '<h2>This is an advertising cookie</h2>';
        }
    }

    public function output_datalayer_variables() {
        echo '
        <script type="text/javascript">
 function parseCookie(e){if(!(e.indexOf("|")<=-1)){for(var s=e.split("|"),i=0;i<s.length;i++)s[i].indexOf("=")>-1&&(s[i]=s[i].split("="));return s}}function getCookie(e){for(var s=e+"=",i=decodeURIComponent(document.cookie).split(";"),r=0;r<i.length;r++){for(var o=i[r];" "==o.charAt(0);)o=o.substring(1);if(0==o.indexOf(s))return o.substring(s.length,o.length)}return""}window.dataLayer=window.dataLayer||[];var cookie=getCookie("cookie_settings"),parsed=parseCookie(cookie);if(parsed){for(var permissions={},permission=0;permission<parsed.length;permission++){var key="cookie-"+parsed[permission][0];2==parsed[permission].length&&"true"==parsed[permission][1]?permissions[key]="1":permissions[key]="0";key="anonymize-"+parsed[permission][0];2==parsed[permission].length&&"true"==parsed[permission][1]?permissions[key]="0":permissions[key]="1"}dataLayer.push(permissions)}
        </script>';
    }

    public function nrdq_log_error()
    {
        $error = $_POST['error'];
        $action = preg_replace('/[^A-Za-z\_]/', '', $_POST['error_action']);
        $path = plugin_dir_path(__FILE__) . '../..';

        $count = (int)get_option('nrdq_cookie_ajax_error_count', 0);
        update_option('nrdq_cookie_ajax_error_count', $count + 1);

        error_log(date('Y-m-d H:i:s') . " - AJAX error - " . $action . "\n", 3, $path . '/log/errors.log');

        if ($error)
            error_log(maybe_serialize(stripslashes($error)) . "\n", 3, $path . '/log/errors.log');

        error_log("\n", 3, $path . '/log/errors.log');

        die();
    }


}

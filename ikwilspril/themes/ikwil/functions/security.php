<?php

// Block bad Queries
//------------------
function nrdq_check_bad_requests() {
    $request_uri_array  = apply_filters('request_uri_items',  array('@eval', 'eval\(', 'UNION(.*)SELECT', '\(null\)', 'base64_', '\/localhost', '\%2Flocalhost', '\/pingserver', 'wp-config\.php', '\/config\.', '\/wwwroot', '\/makefile', 'crossdomain\.', 'proc\/self\/environ', 'usr\/bin\/perl', 'var\/lib\/php', 'etc\/passwd', '\/https\:', '\/http\:', '\/ftp\:', '\/file\:', '\/php\:', '\/cgi\/', '\.cgi', '\.cmd', '\.bat', '\.exe', '\.sql', '\.ini', '\.dll', '\.htacc', '\.htpas', '\.pass', '\.asp', '\.jsp', '\.bash', '\/\.git', '\/\.svn', ' ', '\<', '\>', '\/\=', '\.\.\.', '\+\+\+', '@@', '\/&&', '\/Nt\.', '\;Nt\.', '\=Nt\.', '\,Nt\.', '\.exec\(', '\)\.html\(', '\{x\.html\(', '\(function\(', '\.php\([0-9]+\)', '(benchmark|sleep)(\s|%20)*\(', 'indoxploi', 'xrumer'));
    $query_string_array = apply_filters('query_string_items', array('@@', '\(0x', '0x3c62723e', '\;\!--\=', '\(\)\}', '\:\;\}\;', '\.\.\/', '127\.0\.0\.1', 'UNION(.*)SELECT', '@eval', 'eval\(', 'base64_', 'localhost', 'loopback', '\%0A', '\%0D', '\%00', '\%2e\%2e', 'allow_url_include', 'auto_prepend_file', 'disable_functions', 'input_file', 'execute', 'file_get_contents', 'mosconfig', 'open_basedir', '(benchmark|sleep)(\s|%20)*\(', 'phpinfo\(', 'shell_exec\(', '\/wwwroot', '\/makefile', 'path\=\.', 'mod\=\.', 'wp-config\.php', '\/config\.', '\$_session', '\$_request', '\$_env', '\$_server', '\$_post', '\$_get', 'indoxploi', 'xrumer'));
    $user_agent_array   = apply_filters('user_agent_items',   array('acapbot', '\/bin\/bash', 'binlar', 'casper', 'cmswor', 'diavol', 'dotbot', 'finder', 'flicky', 'md5sum', 'morfeus', 'nutch', 'planet', 'purebot', 'pycurl', 'semalt', 'shellshock', 'skygrid', 'snoopy', 'sucker', 'turnit', 'vikspi', 'zmeu'));

    $request_uri_string  = false;
    $query_string_string = false;
    $user_agent_string   = false;

    if (isset($_SERVER['REQUEST_URI'])     && !empty($_SERVER['REQUEST_URI']))     $request_uri_string  = $_SERVER['REQUEST_URI'];
    if (isset($_SERVER['QUERY_STRING'])    && !empty($_SERVER['QUERY_STRING']))    $query_string_string = $_SERVER['QUERY_STRING'];
    if (isset($_SERVER['HTTP_USER_AGENT']) && !empty($_SERVER['HTTP_USER_AGENT'])) $user_agent_string   = $_SERVER['HTTP_USER_AGENT'];

    if ($request_uri_string || $query_string_string || $user_agent_string) {

        if (
            strlen( $_SERVER['REQUEST_URI'] ) > 255 || // optional
            preg_match('/'. implode('|', $request_uri_array)  .'/i', $request_uri_string)  ||
            preg_match('/'. implode('|', $query_string_array) .'/i', $query_string_string) ||
            preg_match('/'. implode('|', $user_agent_array)   .'/i', $user_agent_string)
        ) {
            header('HTTP/1.1 403 Forbidden');
            header('Status: 403 Forbidden');
            header('Connection: Close');
            exit();
        }
    }
}

add_action('plugins_loaded', 'nrdq_check_bad_requests');

// Remove error message in login
//------------------------------
add_filter('login_errors', function($a){return __('De ingevulde gegevens zijn onjuist.', 'DEFINE_LANG');});

/**
 *    Disables WordPress Rest API for external requests
 *    Change whitelist plugins when plugins need to use the REST API
 */
function restrict_rest_api_to_localhost() {
    $whitelist = array('127.0.0.1', "::1");

    $whitelistplugins = array('contact-form-7', 'redirection', 'regenerate', 'media');

    if(is_admin() || isset($_COOKIE[LOGGED_IN_COOKIE]) && $_COOKIE[LOGGED_IN_COOKIE] !== ''){
        $whitelist[] .= $_SERVER['REMOTE_ADDR'];
    }

    $request = $_SERVER['REQUEST_URI'];
    $die = true;

    if ($request) {
        foreach ($whitelistplugins as $plugin) {
            if (!empty(strpos($request, $plugin))) {
                $die = false;
            }
        }
    }

    if(!in_array($_SERVER['REMOTE_ADDR'], $whitelist) && $die){
        die('REST API is disabled.');
    }
}
add_action( 'rest_api_init', 'restrict_rest_api_to_localhost', 1 );

/**
 *   password protected content
 */

function my_password_form() {
    global $post;
    $label = 'pwbox-'.( empty( $post->ID ) ? rand() : $post->ID );
    $o = '<form action="' . esc_url( site_url( 'wp-login.php?action=postpass', 'login_post' ) ) . '" method="post">
    ' . __( "Vul hieronder het wachtwoord in om deze content te zien:", "DEFINE_LANG" ) . '
    <label for="' . $label . '">' . __( "Password:" ) . ' </label><input name="post_password" id="' . $label . '" type="password" size="20" maxlength="20" /><input type="submit" class="button" name="Submit" value="' . esc_attr__( "Submit" ) . '" />
    </form>
    ';
    return $o;
}
add_filter( 'the_password_form', 'my_password_form' );

/**
 * 	Removes or edits the 'Protected:' part from posts titles
 */

function remove_protected_text() {
    return __('%s', 'DEFINE_LANG');
}
add_filter( 'protected_title_format', 'remove_protected_text' );
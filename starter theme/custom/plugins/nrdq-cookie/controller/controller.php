<?php

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Class which contains the functionality that is required
 * in the public part of the plugin
 *
 */

class NRDQ_Cookie_Controller {

	protected $plugin_name;
	protected $version;

	public $cookie_types = array();

	public $language_code;

	function __construct($plugin_name, $version){
		$this->plugin_name = $plugin_name;
		$this->version = $version;
		add_action( 'plugins_loaded', array($this, 'get_current_language_code'), 5);
		add_action( 'plugins_loaded', array($this, 'get_cookie_types'), 10);

		$this->enqueue_custom_files();




	}

	public function get_cookie_types(){
  	$default_cookies = array();

		if(get_option($this->language_code . 'nrdq_cookie_type_analytics') == '1' || !nrdq_cookie_is_pro())
		  $default_cookies []= array('label' => __('Analytische cookies'), 'value' => 'analytics', 'description' => __('Cookies waarmee wij het gebruik van de website kunnen meten. Gegevens die met deze cookies worden verzameld, worden gecombineerd en geaggregeerd ten behoeve van statistische analyse.', 'nrdq-cookie'));

		if(get_option($this->language_code . 'nrdq_cookie_type_social') == '1'|| !nrdq_cookie_is_pro())
		  $default_cookies []= array('label' => __('Social media'),        'value' => 'social', 'description' => __('Cookies om de inhoud van onze website te delen via Social Media. Social Media netwerken doen aan profiling en tracking van bezoekers. Door deze cookies te accepteren kan je internetgedrag gemonitord worden door social media.', 'nrdq-cookie'));

		if(get_option($this->language_code . 'nrdq_cookie_type_ads') == '1'|| !nrdq_cookie_is_pro())
		  $default_cookies []= array('label' => __('Advertentie cookies'), 'value' => 'ads' , 'description' => __('Cookies waarmee advertenties kunnen worden afgestemd op jouw internetgedrag. Door deze cookies te accepteren kan je internetgedrag gemonitord worden door advertentie netwerken.', 'nrdq-cookie'));

    $this->cookie_types = $default_cookies;
	}

	public function get_current_language_code(){
		global $sitepress;
		if (isset($sitepress)) {
			$current_language = $sitepress->get_current_language() . '_';
		} else {
			$current_language = '';
		}
		$this->language_code = $current_language;
	}

	public function get($var, $default_value = ''){
    return isset($_GET[$var]) ? $_GET[$var] : $default_value;
  }

  public function get_formal_name(){
	  return ucfirst(str_replace('_', ' ', $this->plugin_name));
	}

  private function enqueue_custom_files(){
	  if(NRDQ_COOKIE_ADMIN_CSS_REQUIRED) add_action( 'admin_enqueue_scripts', array($this, 'add_admin_styles') );
		if(NRDQ_COOKIE_ADMIN_JS_REQUIRED) add_action( 'admin_enqueue_scripts', array($this, 'add_admin_scripts'));
		if(NRDQ_COOKIE_CSS_REQUIRED) add_action( 'wp_enqueue_scripts', array($this, 'add_frontend_styles') );
	  if(NRDQ_COOKIE_JS_REQUIRED) add_action( 'wp_enqueue_scripts', array($this, 'add_frontend_scripts') );

  }

  public function add_admin_scripts($val){
    wp_enqueue_script( $this->plugin_name . "_trumbowyg_admin", plugin_dir_url( __DIR__  ) . 'includes/js/vendor/trumbowyg/trumbowyg.min.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( $this->plugin_name . "_admin", plugin_dir_url( __DIR__  ) . 'includes/js/custom-admin.js', array( 'jquery' ), $this->version, false );
	}

	public function add_admin_styles($val){
  	wp_enqueue_style( $this->plugin_name . "_trumbowyg_admin", plugin_dir_url( __DIR__  ) . 'includes/css/vendor/trumbowyg/trumbowyg.min.css', array(), $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name . "_admin", plugin_dir_url( __DIR__  ) . 'includes/css/custom-admin.css', array(), $this->version, 'all' );
	}


	public function add_frontend_scripts(){
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __DIR__  ) . 'includes/js/custom.min.js', array( 'jquery' ), $this->version, true );
		wp_localize_script( $this->plugin_name, 'ajax_object_cookie', array(
		  'ajax_url'          => apply_filters('nrdq_cookie_ajax_url', admin_url( 'admin-ajax.php' )),
		  'collapsed_height'  => apply_filters('nrdq_cookie_collapsed_height', 70),
		  'more_info_string'  => __('Meer informatie', 'nrdq-cookie'),
		  'less_info_string'  => __('Minder informatie', 'nrdq-cookie'),
		  'ajax'              => (get_option($this->language_code . 'nrdq_cookie_ajax', "0")) ? 'true' : 'false',
		  'readmore_all'      => apply_filters('nrdq_cookie_readmore_all', false),
			'remove' 						=> ($this->check_user_agent()) ? 'false' : 'true'
		));
	}

	public function add_frontend_styles(){
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __DIR__  ) . 'includes/css/custom.min.css', array(), $this->version, 'all' );
	}

	public function print_frontend_scripts(){
		echo "<script type='text/javascript' defer='defer' src='" . plugin_dir_url( __DIR__  ) . "includes/js/custom.min.js?ver=" . $this->version . "'></script>";
		echo '<script type="text/javascript">/* <![CDATA[ */
var ajax_object = {"ajax_url":"' . apply_filters('nrdq_cookie_ajax_url', admin_url( 'admin-ajax.php' )) . '"};
/* ]]> */</script>';
	}

	public function print_frontend_styles(){
		echo "<link rel='stylesheet'  href='" . plugin_dir_url( __DIR__  ) . "includes/css/custom.min.css?ver=" . $this->version . "' type='text/css' media='all' />";
	}


  public static function build_cookie($var_array) {
    $out = '';
    if (is_array($var_array)) {
      foreach ($var_array as $index => $data) {
        $out .= ($data != "") ? $index . "=" . $data . "|" : "";
      }
    }
    return rtrim($out, "|");
  }

  public static function break_cookie($cookie_string) {
    $array = explode("|", $cookie_string);
    foreach ($array as $i => $stuff) {
      $stuff = explode("=", $stuff);
      $array[$stuff[0]] = $stuff[1];
      unset($array[$i]);
    }
    return $array;
  }

  public function increase_option($string){
    $count = get_option($string, 0);
  	update_option($string, $count + 1);
  }

  public function get_option_or_default($name, $default, $filter){
    $option = get_option($this->language_code . $name);
    if(!$option || trim($option) == ''){
      $option = apply_filters($filter, $default);
    }
    return $option;
  }

	public function check_user_agent(){
		if(strstr(strtolower($_SERVER['HTTP_USER_AGENT']), "googlebot")){
			// if googlebot
			return false;
		}
		if(strstr(strtolower($_SERVER['HTTP_USER_AGENT']), "semrushbot")){
			// if semrush
			return false;
		}
		return true;
	}

}

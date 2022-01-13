<?php 
	
namespace NRDQ_LimitUploadSize;

	
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Helper class for rendering the views of the plugin
 *
 */
 

class View {
	
	static public function render($data, $type, $file){
    $m = new \Mustache_Engine;
    $template = file_get_contents(plugin_dir_path( __DIR__ ) . 'views/' . $type . '/' . $file . '.html');
    return $m->render($template, $data);
	}
	
}
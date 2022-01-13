<?php

namespace NRDQ_LockStaging;
	
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Base class for the models
 *
 */

class Model{

  private $_data = [];
  protected $fillable = [];
  private $_dirty = [];

  static public function create(){
      $item = new static();

      $item->oncreate();

      return $item;
  }

  static public function getbyId($id){

      $item = self::select(sprintf('SELECT * FROM `%s` WHERE `id`=%d', static::getTableName(), $id));
      return $item;

  }
  
  static public function select_all(){
	  
	  $items =  self::wpdb()->get_results(sprintf("SELECT * FROM `%s`", static::getTableName()), ARRAY_A);
	  return $items;
	  
  }

  static public function select_multiple($sql){
      $rows = self::wpdb()->get_results($sql, ARRAY_A);

      foreach($rows as $index=>$row){
          $rows[$index] = new static();
          $rows[$index]->_data = $row;
      }

      return $rows;
  }

  static public function select($sql){
      $row = self::wpdb()->get_row($sql, ARRAY_A);

      if ($row){
          $item = new static();
          $item->_data = $row;
          return $item;
      }

      return null;

  }

  static public function getTableName(){

      $classname = explode("\\", get_called_class());
      $classname = array_pop($classname);
      
      $table_name = \NRDQ_LockStaging\db::wpdb()->prefix;
      for ($i=0; $i<strlen($classname); $i++){
          $char = $classname[$i];

          if ($char >= 'A' && $char <= 'Z'){
              $char = strtolower($char);
          }

          $table_name .= $char;
      }
      
      return $table_name . 's';

  }

  static public function wpdb(){
      global $wpdb;
      return $wpdb;
  }

  public function save(){

      if (false === $this->onbeforesave()){
          return false;
      }

      $table = static::getTableName();

      if ($this->is_new()){
          // create object in db
          self::wpdb()->insert($table, array('id'=>0));

          $this->_data['id'] = self::wpdb()->insert_id;
      }

      // update object in db
      $dirty = array();
      foreach($this->_dirty as $k=>$v){
          $dirty[$k] = $this->get($k);
      }
      
      if (count($dirty))
          self::wpdb()->update($table, $dirty, array('id'=>$this->id));

      $this->onsave();

      return $this; // chainable;

  }

  public function is_new(){
      return ($this->get('id', 0) < 1);
  }

  public function get($var, $default_value = null){
      if (isset($this->_data[$var])){
          return $this->_data[$var];
      }
      return $default_value;
  }

  public function set($var, $val = null, $dirty = true){

      if (is_array($var)){
          foreach($var as $k=>$v){
              $this->set($k, $v, false);
          }
          return $this; // chainable;
      }

      $this->_data[$var] = $val;

      if ($dirty || in_array($var, $this->fillable)){
          $this->_dirty[$var] = 1;
      }
      return $this; // chainable;
  }

  public function __isset($var){
      return isset($this->_data[$var]);
  }

  public function __get($var){
      return $this->get($var, '');
  }

  public function __set($var, $val){
      return $this->set($var, $val);
  }

  public function __toString(){
      return json_encode($this->_data, 128);
  }

  public function getHtml($field){
      return htmlentities($this->get($field));
  }

  public function delete(){

      self::select(sprintf('DELETE FROM `%s` WHERE `id`=%d', self::GetTableName(), $this->id));
      return true;
      
  }




  public function oncreate(){}
  public function onbeforesave(){}
  public function onsave(){}
}

?>
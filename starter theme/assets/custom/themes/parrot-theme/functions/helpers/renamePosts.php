<?php
class rename_posts {

   private $singular = 'Product';
   private $plural   = 'Producten';

   /**
    * Class Constructor
    */
   public function __construct()
   {
      add_action( 'admin_menu', [ $this, 'change_post_label' ] );
      add_action( 'init', [ $this, 'change_post_object' ] );
   }

   // -----------------------------------------------------------------------

   /**
    * Change Post Label
    */
   public function change_post_label()
   {
      global $menu;
      global $submenu;

      $menu[5][0]                 = 'Collectie';
      $submenu['edit.php'][5][0]  = $this->plural;
      $submenu['edit.php'][10][0] = 'Nieuw '.$this->singular;
      $submenu['edit.php'][16][0] = $this->singular . ' Tags';
   }

   // -----------------------------------------------------------------------

   /**
    * Change Post Object
    */
   public function change_post_object()
   {
      global $wp_post_types;

      $labels                     = &$wp_post_types['post']->labels;
      $wp_post_types['post']->menu_icon = 'dashicons-cart';
      $labels->name               = 'Collectie';
      $labels->singular_name      = 'Collectie';
      $labels->add_new            = $this->singular . ' toevoegen';
      $labels->add_new_item       = $this->singular . ' toevoegen';
      $labels->edit_item          = $this->singular . ' bewerken';
      $labels->new_item           = 'Nieuw ' . $this->singular;
      $labels->view_item          = $this->singular . ' bekijken';
      $labels->search_items       = $this->plural . ' zoeken';
      $labels->not_found          = 'Geen ' . $this->plural . ' gevonden';
      $labels->not_found_in_trash = 'Geen ' . $this->plural . ' gevonden in de prullenbak';
      $labels->all_items          = 'Alle ' . $this->plural;
      $labels->menu_name          = 'Collectie';

      $labels->name_admin_bar     = $this->singular;
   }

   // -----------------------------------------------------------------------

}
new rename_posts;

$menu_args = apply_filters('nrdq_main_menu_args', array(
    'theme_location'        => 'primary',
    'menu_class'            => 'desktop-navigation  {{#obj.hasArrows}}has-arrows{{/obj.hasArrows}} {{#obj.isMegaMenu}}is-mega-menu{{/obj.isMegaMenu}}',
    'container'             => 'nav',
    'container_id'          => true,
    'container_class'       => 'desktop-navigation-container',
    'depth'                 => {{obj.getDepth}},
    'fallback_cb'           => false
));

wp_nav_menu( $menu_args );
{{#obj.hasSearch}}
?>
<div class="search-container">
    <form role="search" method="get" class="searchform-page" action="<?= home_url('/'); ?>">
        <input type="search" value="<?= esc_attr(get_search_query()); ?>" name="s" placeholder="<?php _e( 'Zoeken…', 'DEFINE_LANG' ); ?>">
        <button id="searchsubmit" type="submit"  class="btn-red searchsubmit postfix align-center"><?php _e( 'Zoeken', 'DEFINE_LANG' ); ?></button>
    </form>
</div>
<?php
{{/obj.hasSearch}}
?>
<div class="mobile-menu-container {{#obj.isDrilldown}}is-drilldown{{/obj.isDrilldown}} {{#obj.isAccordion}}is-accordion{{/obj.isAccordion}} {{#obj.isOffCanvas}}is-offcanvas{{/obj.isOffCanvas}} {{#obj.isOverlay}}is-overlay{{/obj.isOverlay}}">
    {{#obj.isOffCanvas}}
    <div class="off-canvas position-left hide-for-large" id="offCanvasMainMenu" data-off-canvas>
        {{/obj.isOffCanvas}}
        {{#obj.hasSearch}}
        <div class="search-container">
            <form role="search" method="get" class="searchform-page" action="<?= home_url('/'); ?>">
                <input type="search" value="<?= esc_attr(get_search_query()); ?>" name="s" placeholder="<?php _e( 'Zoeken…', 'DEFINE_LANG' ); ?>">
                <button id="searchsubmit" type="submit"  class="btn-red searchsubmit postfix align-center"><?php _e( 'Zoeken', 'DEFINE_LANG' ); ?></button>
            </form>
        </div>
        {{/obj.hasSearch}}
        <?php
        $menu_args = apply_filters('nrdq_main_menu_args', array(
            'theme_location'        => 'primary',
            'menu_class'            => 'mobile-navigation {{#obj.hasArrows}}has-arrows{{/obj.hasArrows}} {{#obj.isMegaMenu}}is-mega-menu{{/obj.isMegaMenu}}',
            'container'             => 'nav',
            'container_id'          => true,
            'container_class'       => 'mobile-navigation-container',
            'depth'                 => {{obj.getDepth}},
            'items_wrap'            => '<ul id="%1$s" class="%2$s" {{#obj.isAccordion}}data-accordion-menu {{#obj.hasArrows}}data-submenu-toggle="true"{{/obj.hasArrows}}{{/obj.isAccordion}} {{#obj.isDrilldown}}data-drilldown{{/obj.isDrilldown}}>%3$s</ul>',
            'fallback_cb'           => false
        ));

        wp_nav_menu( $menu_args );

        get_template_part('includes/nav/top-nav');
    ?>
        {{#obj.isOffCanvas}}
    </div>
    {{/obj.isOffCanvas}}
</div>
<?php
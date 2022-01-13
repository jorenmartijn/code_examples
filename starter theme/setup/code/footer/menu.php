{{#obj.hasMenu}} ?>
<div class="row">
    {{#obj.getAllMenus}}
    <div class="columns small-48 medium-<?php echo intval(48 / {{obj.numberOfMenus}}); ?>">
        <?php
        $menu_args = apply_filters('nrdq_footer_menu_args', array(
        'theme_location'        => 'footer {{.}}',
        'menu_class'            => 'footer-navigation',
        'container'             => 'nav',
        'container_id'          => true,
        'container_class'       => 'footer-navigation-container',
        'depth'                 => 1,
        'fallback_cb'           => false
        )); ?>

        <?php wp_nav_menu( $menu_args ); ?>
    </div>
    {{/obj.getAllMenus}}
</div> <?php
{{/obj.hasMenu}}
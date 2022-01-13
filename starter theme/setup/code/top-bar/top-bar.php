{{#obj.hasTopBar}}
?>
<div class="topbar row align-right align-middle show-for-large xlarge-collapse">
    
    {{#obj.hasEmail}}
    <?php if(function_exists('get_field')): ?>
        <?php $top_email = get_field('company_email', 'option'); ?>
        <?php if($top_email): ?>
            <div class="columns shrink">
                <a href="mailto:<?= antispambot($top_email, 1); ?>"><?=esc_html($top_email);?></a>
            </div>
        <?php endif; ?>
    <?php endif; ?>
    {{/obj.hasEmail}}

    {{#obj.hasPhone}}
    <?php if(function_exists('get_field')): ?>
        <?php $top_phone = get_field('company_phone', 'option'); ?>
        <?php if($top_phone): ?>
            <div class="columns shrink">
                <a href="tel:<?= $top_phone; ?>"><?=esc_html($top_phone);?></a>
            </div>
        <?php endif; ?>
    <?php endif; ?>
    {{/obj.hasPhone}}

    {{#obj.hasMenu}}
    <div class="columns shrink">
       <?php get_template_part('includes/nav/desktop-top-nav'); ?>
    </div>
    {{/obj.hasMenu}}
</div><!-- /.topbar -->
<?php
{{/obj.hasTopBar}}
?>
<div class="footer-top">
    <div class="row xlarge-collapse">
        {{#obj.hasLogo}}
        <div class="column small-48 medium-24 large-12">
            <a href="<?=get_bloginfo('url');?>" title="<?= get_bloginfo('name').' - '.get_bloginfo('description'); ?>">
                <figure>
                    <img src="<?=content_url();?>/build/svg/logo.svg" role="logo" alt="<?=get_bloginfo('name'); ?>" title="<?=get_bloginfo('name'); ?>"/>
                </figure>
            </a>
        </div><!-- /.column -->
        {{/obj.hasLogo}}
        {{#obj.hasMenu}}
        <div class="column small-48 medium-24 large-36">
            <?php get_template_part('includes/nav/footer-nav'); ?>
        </div><!-- /.column -->
        {{/obj.hasMenu}}

    </div><!-- /.row -->
</div><!-- /.footer-top -->
<?php
{{#obj.hasSocket}}
?>
<div class="footer-bottom">
    <div class="row align-middle xlarge-collapse">

            {{#obj.hasCopyright}}
                <div class="column shrink">
                    <span>&copy; <?= get_bloginfo('name') . ' ' .  date('Y'); ?></span>
                </div>
            {{/obj.hasCopyright}}
            {{#obj.hasMenu}}
                <div class="column shrink">
                    <?php get_template_part('includes/nav/socket-nav'); ?>
                </div>
            {{/obj.hasMenu}}
        </div>

    </div><!-- /.row -->
</div><!-- /.footer-bottom -->
<?php
{{/obj.hasSocket}}
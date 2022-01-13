<?php get_header();

$post_type = get_post_type();

$archive_title = get_field($post_type . '_archive_title', 'option'); // always required
$archive_intro = get_field($post_type . '_archive_intro', 'option');

// Get total published post count to determine the status of the load more button
$total_count = wp_count_posts( $post_type )->publish;
$show_count = defined(strtoupper($post_type) . '_ARCHIVE_COUNT') ? constant(strtoupper($post_type) . '_ARCHIVE_COUNT') : DEFAULT_ARCHIVE_COUNT;
?>

<?php if ($post_type): ?>
    <section class="archive section" data-type="<?= esc_attr($post_type); ?>">
        <div class="row">
            <h1 class="title-big"><?= $archive_title; ?></h1>

            <div class="row">
                <div class="columns small-48">
                    <?php get_template_part('includes/content/breadcrumbs');?>
                </div>
            </div><!-- /.row -->

            <?php if ($archive_intro): ?>
                <div class="columns small-48">
                    <p class="text-center"><?= $archive_intro; ?></p>
                </div>
            <?php endif; ?>
        </div><!-- /.row -->

        <div class="row">
            <div class="small-48 columns">
                <div class="row post-container">
                    {{#ajax-pagination}}
                    <?php include(locate_template('includes/content/loader.php')); ?>
                    {{/ajax-pagination}}

                    <?php while(have_posts()) : the_post();
                        $id = get_the_ID();
                        if(file_exists(locate_template( 'includes/content/cards/card-' . sanitize_title(strtolower($post_type)) . '.php' ))):
                            include(locate_template( 'includes/content/cards/card-' . sanitize_title(strtolower($post_type)) . '.php' ));
                        endif;
                    endwhile; wp_reset_query(); ?>
                </div>
                {{#ajax-pagination}}
                <div class="pagination-container text-center">
                    <a href="javascript:;" class="load-more load-more-posts <?php if($total_count <= $show_count): ?>hide<?php endif;?>">
                        <?= __('Toon meer', 'DEFINE_LANG');?><i class="icon-plus"></i>
                    </a>
                </div>
                {{/ajax-pagination}}

                {{#default-pagination}}
                <div class="pagination-container text-center">
                    <?php nrdq_default_pagination(); ?>
                </div>
                {{/default-pagination}}
            </div>
        </div>
    </section>
<?php endif; ?>

<?php get_footer(); ?>
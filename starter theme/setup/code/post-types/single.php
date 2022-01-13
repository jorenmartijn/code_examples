<?php get_header(); ?>

    <section id="page-intro">
        <div class="row">
            <?php if (have_posts()) : ?>
                <?php while (have_posts()) : the_post(); ?>
                    <div class="columns small-48">
                        <header>
                            <h1 class="title"><?= get_the_title(); ?></h1>

                            <span class="post-meta caption">
                                <?= __('Publicatiedatum', 'DEFINE_LANG');?>: <?= get_the_time('d F Y'); ?>
                                <?= __('om', 'DEFINE_LANG');?>  <?= get_the_time('H:i'); ?>
                                | <?= __('Laatst bewerkt', 'DEFINE_LANG');?>: <?= get_the_modified_time('d F Y'); ?>
                                <?= __('om', 'DEFINE_LANG');?> <?= get_the_modified_time('H:i'); ?>
                            </span>
                        </header>

                        <div class="entry-content">
                            <?php the_content(); ?>
                        </div>
                    </div>

                <?php endwhile; ?>
            <?php endif; ?>
        </div><!-- /.row -->
    </section>

<?php get_footer(); ?>
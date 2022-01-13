<?php get_header(); ?>

<?php get_template_part('includes/content/breadcrumbs'); ?>

<?php if (have_posts()) : ?>

	<section class="section-cards">
		<div class="row small-up-1 medium-up-2 large-up-3">
			<?php while (have_posts()) : the_post(); ?>
				<?php
				$post_title = get_the_title();
				$thumbnail_id = get_post_thumbnail_id(get_the_ID());
				if ($thumbnail_id) {
					$image = wp_get_attachment_image_src($thumbnail_id, 'full');
					$alt = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
					$title = get_the_title($thumbnail_id);
				}
				?>
				<div class="column flex-container">
					<div class="card">
						<?php if ($thumbnail_id && $image) : ?>
							<a href="<?= get_the_permalink(); ?>" target="_self" title="<?= $post_title; ?>">
								<figure>
									<img class="lazy" alt="<?= $alt; ?>" title="<?= $title; ?>" data-src="<?= content_url(); ?>/build/img/pixel.gif" data-lazy="
		    					[<?= wp_get_attachment_image_url($thumbnail_id, 'content-image-small'); ?>, small],
		    					[<?= wp_get_attachment_image_url($thumbnail_id, 'card-xlarge'); ?>, xlarge],
		    					[<?= wp_get_attachment_image_url($thumbnail_id, 'card-retina'); ?>, retina]">
								</figure>
							</a>
						<?php endif; ?>
						<div class="content">

							<h2 class="is-h4">
								<span><?= get_the_date(); ?></span>
								<a href="<?= get_the_permalink(); ?>" target="_self" title="<?= $post_title; ?>"><?= $post_title; ?></a>
							</h2>

							<?php the_excerpt(); ?>
							<a href="<?= get_the_permalink(); ?>"><?= __('View this message', 'parrot-theme'); ?></a></p>
						</div>
					</div>
				</div>

			<?php endwhile;
			wp_reset_postdata(); ?>

		</div>
		<div class="row">
			<div class="column">

				<?php
				the_posts_pagination(array(
					'mid_size'  => 2,
					'prev_text' => __('Previous', 'parrot-theme'),
					'next_text' => __('Next', 'parrot-theme'),
				));
				?>

			</div>
		</div>
	</section>

<?php endif; ?>

<?php get_footer(); ?>
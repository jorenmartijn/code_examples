<?php
$choice = get_sub_field('fc_cards_choice');
$args = array(
	'post_type' => 'post',
	'post_status' => 'publish',
);

if ($choice == 'latest') {
	$args['posts_per_page'] = get_sub_field('fc_cards_number');
	$args['orderby'] = 'date';
	$args['order'] = 'DESC';
	$args['offset'] = 0;
} else {
	$args['post__in'] = get_sub_field('fc_cards_posts');
}

$posts = get_posts($args);
?>

<?php if ($posts) : ?>

	<section class="<?= get_section_class('section-cards'); ?>">
		<div class="row small-up-1 medium-up-2<?php if (post_has_sidebar()) : ?> large-up-2<?php else : ?> large-up-3<?php endif; ?>">

			<?php foreach ($posts as $post) : setup_postdata($post); ?>
				<?php
				$post_title = get_the_title();
				$thumbnail_id = get_post_thumbnail_id(get_the_ID());
				if ($thumbnail_id) {
					$image = wp_get_attachment_image_src($thumbnail_id, 'full');
					$alt = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
					$title = get_the_title($thumbnail_id);
				}
				?>

				<div class="columns small-48 flex-container">
					<div class="card<?php if (!$thumbnail_id) : ?> no-image<?php endif; ?>">

						<?php if ($thumbnail_id && $image) : ?>
							<a href="<?= get_the_permalink(); ?>" target="_self" title="<?= $post_title; ?>">
								<figure>
									<img class="lazy" alt="<?= $alt; ?>" title="<?= $title; ?>" data-src="<?= content_url(); ?>/build/img/pixel.gif" data-lazy="[<?= wp_get_attachment_image_url($thumbnail_id, 'content-image-small'); ?>, small], [<?= wp_get_attachment_image_url($thumbnail_id, 'card-xlarge'); ?>, xlarge], [<?= wp_get_attachment_image_url($thumbnail_id, 'card-retina'); ?>, retina]">
								</figure>
							</a>
						<?php endif; ?>
						<div class="content">
							<h2 class="is-h4">

								<span class="card-meta"><i class="fa fa-clock"></i> <?= get_the_date(); ?></span>
								<a href="<?= get_the_permalink(); ?>" target="_self" title="<?= $post_title; ?>"><?= $post_title; ?></a>
							</h2>
							<?php the_excerpt(); ?>
							<a href="<?= get_the_permalink(); ?>" title="<?= __('View this message', 'parrot-theme'); ?>"><?= __('View this message', 'parrot-theme'); ?></a>
						</div>
					</div>
				</div>

			<?php endforeach;
			wp_reset_postdata(); ?>

		</div>
	</section>

<?php endif; ?>
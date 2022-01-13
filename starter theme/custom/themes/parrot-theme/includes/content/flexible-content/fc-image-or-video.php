<?php

// var
$choice 	= get_sub_field('fc_image_or_video_choice');
$position = get_sub_field('fc_image_or_video_position');
$content 	= get_sub_field('fc_image_or_video_content')
?>

<section class="<?= get_section_class('section-content'); ?>">
	<div class="row small-up-1 medium-up-2 align-middle">
		<div class="column<?php if ($position == 'left') : ?> small-order-2<?php endif; ?>">

			<?php if ($title = $content['fc_image_or_video_title']) : ?>

				<h3><?= $title; ?></h3>

			<?php endif; ?>

			<?php if ($text = $content['fc_image_or_video_text']) : ?>

				<p><?= $text; ?></p>

			<?php endif; ?>

			<?= get_variable_button('', $content['var_button_link'], $content['var_button_color']); ?>

		</div>
		<div class="column <?php if ($position == 'left') : ?> small-order-1<?php endif; ?>">

			<?php if ($choice == 'image') : ?>
				<?php $image_id = get_sub_field('fc_image_or_video_image'); ?>
				<?php $image = wp_get_attachment_image_src($image_id, 'full'); ?>

				<?php $alt = get_post_meta($image_id, '_wp_attachment_image_alt', true); ?>
				<?php $title = get_the_title($image_id); ?>

				<figure class="<?php if ($position == 'left') : ?>left<?php else : ?>right<?php endif; ?>">
					<img class="lazy" alt="<?= $alt; ?>" title="<?= $title; ?>" data-src="<?= content_url(); ?>/build/img/pixel.gif" data-lazy="[<?= wp_get_attachment_image_url($image_id, 'content-image-small'); ?>, small], [<?= wp_get_attachment_image_url($image_id, 'content-image-medium'); ?>, medium], [<?= wp_get_attachment_image_url($image_id, 'content-image-large'); ?>, large], [<?= wp_get_attachment_image_url($image_id, 'content-image-retina'); ?>, retina]">
				</figure>

			<?php else : ?>

				<?php $video_url = get_sub_field('fc_image_or_video_video'); ?>
				<div class="video-container is-cover<?php if ($position == 'left') : ?> left<?php else : ?> right<?php endif; ?>" data-interchange="[<?= getVideoImage($video_url); ?>, small]">
					<a href="<?= $video_url; ?>" class="play-button" title="<?= __('Play video', 'nordique'); ?>" data-lity>
						<i class="far fa-play"></i>
					</a>
				</div>

			<?php endif; ?>

		</div>
	</div>
</section>
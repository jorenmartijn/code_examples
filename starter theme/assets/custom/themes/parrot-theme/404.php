<?php get_header(); ?>

<?php get_template_part('includes/content/breadcrumbs'); ?>

<section class="error-page">
	<div class="row">
		<div class="column">
			<h1><?= __('This page was not found', 'nordique'); ?></h1>
			<p><?= __('Apologies, the page you requested doesn\'t exist (anymore).', 'DEFINE_LANG'); ?></p>
			<h2><?= __('What do I do?', 'nordique'); ?></h2>
			<ul class="arrow-list">
				<li><?php _e('If you typed in the URL yourself: please check your spelling', 'DEFINE_LANG'); ?></li>
				<li><?php printf(__('Go back to the <a href=\"%s\">home page</a>', 'DEFINE_LANG'), home_url()); ?></li>
				<li><?php _e('Go <a href=\"javascript:history.back()\">back</a> to the previous page', 'DEFINE_LANG'); ?></li>
			</ul>
		</div>
	</div>
</section>

<?php get_footer(); ?>
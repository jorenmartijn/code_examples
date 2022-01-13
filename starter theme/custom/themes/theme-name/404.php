<?php get_header(); ?>

	<div class="row">
		<div class="columns">
			<h1><?=__('Pagina niet gevonden','DEFINE_LANG');?></h1>
		    <p><?=__('Excuses, de pagina die je hebt opgevraagd bestaat niet (meer).','DEFINE_LANG');?></p>
		    <h2><?=__('En nu?','DEFINE_LANG');?></h2>
		    <ul>
	        <li><?php _e('Als je de URL zelf in hebt getypt: controleer je spelling', 'DEFINE_LANG'); ?></li>
	        <li><?php printf(__('Ga terug naar de', 'DEFINE_LANG') . ' <a href="%s">' . __('home pagina', 'DEFINE_LANG') . '</a> ', home_url()); ?></li>
	        <li><?php echo __('Ga', 'DEFINE_LANG') . ' <a href="javascript:history.back()">' . __('terug', 'DEFINE_LANG') . '</a> ' . __('naar de vorige pagina', 'DEFINE_LANG'); ?></li>
		    </ul>
		</div>
	</div>

<?php get_footer(); ?>
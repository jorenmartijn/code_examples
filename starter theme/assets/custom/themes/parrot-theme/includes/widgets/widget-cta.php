<?php
  $title = get_field('w_cta_title', 'widget_' . $widget_id);
  $image_id = get_field('w_cta_image', 'widget_' . $widget_id); 
  
  $link = get_field('var_button_link', 'widget_' . $widget_id); 
  $link_color = get_field('var_button_color', 'widget_' . $widget_id); 
  
  $background_color = get_field('var_background_color', 'widget_' . $widget_id); 
  $height = get_field('w_cta_height', 'widget_' . $widget_id); 
  if($image_id) {
    $image = wp_get_attachment_image_src($image_id, 'full');
  }
?>

<div class="small-48 medium-24 large-48 columns">
	<div class="card <?php if($image_id && $image): ?>has-bg-image<?php endif;?> <?=$background_color;?>">
	  <?php if($image_id && $image) : ?>
		  <div class="bg-image is-cover" data-interchange="[<?= wp_get_attachment_image_url( $image_id, 'widget-small-background' ); ?>, small], [<?= wp_get_attachment_image_url( $image_id, 'widget-small-background-retina' ); ?>, retina]">
			</div>
	  <?php endif; ?>
		<div class="row full-height align-middle">
			<div class="small-48 text-center columns">
				<div class="content">	
	  			<?php if($title) : ?>
					  <h2 class="is-h5"><?=$title;?></h2>
					<?php endif; ?>
					<?php if($link && $link_color) : ?>
	      	  <?=get_variable_button('', $link, $link_color, true); ?>
	      	<?php endif; ?>
				</div>
			</div>
		</div>
	</div>
</div>
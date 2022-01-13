<?php
  $title = get_field('w_content_title', 'widget_' . $widget_id);
  $text = get_field('w_content_text', 'widget_' . $widget_id); 
  $image_id = get_field('w_content_image', 'widget_' . $widget_id); 
  
  $link = get_field('var_button_link', 'widget_' . $widget_id); 
  $link_color = get_field('var_button_color', 'widget_' . $widget_id); 
  
  $background_color = get_field('var_background_color', 'widget_' . $widget_id); 
?>

<div class="small-48 medium-24 large-48 columns">
	<div class="card <?=$background_color;?>">
	  <?php if($image_id) : 
	    $alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);  
		  $img_title = get_the_title($image_id);  
	    if($image_id): ?>
	    	<figure>
	    		<img class="lazy" alt="<?=$alt;?>" title="<?=$img_title;?>" data-src="<?=content_url(); ?>/build/img/pixel.gif" data-lazy="[<?= wp_get_attachment_image_url( $image_id, 'widget-small' ); ?>, small], [<?= wp_get_attachment_image_url( $image_id, 'widget-small-retina' ); ?>, retina]"> 
	    	</figure>
	    <?php endif; ?>
		<?php endif; ?>
		<div class="content">	
	  	<?php if($title) : ?>
			  <h2 class="is-h6"><?=$title;?></h2>
			<?php endif; ?>
			<?php if($text) : ?>
	  		<p><?=$text;?></p>
	  	<?php endif; ?>
	  	<?php if($link && $link_color) : ?>
	  	  <?=get_variable_button('', $link, $link_color, true); ?>
	  	<?php endif; ?>
		</div>
	</div>
</div>
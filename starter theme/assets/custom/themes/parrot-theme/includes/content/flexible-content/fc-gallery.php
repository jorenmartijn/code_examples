<?php
	
	// var
  $title 	= get_sub_field('fc_gallery_title');
  $images = get_sub_field('fc_gallery_gallery');	
	?>
	
	<section class="<?=get_section_class('section-slider');?>">
		<div class="row">
			<div class="small-48 columns">
				
	  	<?php if($title) : ?>
	  	
				<h2 class="is-h4"><?=$title;?></h2>
				
	    <?php endif; ?>
	    
			</div>
		</div>
		
		<?php if($images) : ?>
		
	  	<div class="gallery-slider">
		  	
	    	<?php foreach( $images as $image ): ?>
	    	
	    	  <div class="gallery-container">
		    	  <figure class="gallery-image">
		    	  
	            <?=wp_get_attachment_image($image['ID'],'gallery-medium');?>
	            
		        </figure>
	    	  </div>
	    	  
	      <?php endforeach;?>
	      
	  	</div>
	  	
	  <?php endif; ?>
	  
	</section>
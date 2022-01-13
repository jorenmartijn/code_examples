<?php
  $column_count = get_sub_field('fc_content_columns');

  $section_class = 'section-content';
  if($column_count > 1) $section_class .= ' multiple-content';

  $row_class = 'row small-up-1';
  if($column_count > 1) $row_class .= ' large-up-' . $column_count . '';
?>

<section class="<?=get_section_class($section_class);?>">
	<div class="<?=$row_class;?>">
  
  	<?php for($idx = 1; $idx <= $column_count; $idx++) : ?>

  	  <div class="column">
    	 
    	  <?php if($title = get_sub_field('fc_content_title_' . $idx)) : ?>
  			
  			  <h2 <?=($column_count == 3) ? 'class="is-h5"' : '' ;?> ><?=$title;?></h2>  			
  			
  			<?php endif; ?>
       
        <?php if($text = get_sub_field('fc_content_text_' . $idx)) : ?>
  			
  			  <p><?=$text;?></p>
       
        <?php endif; ?>
        
        <?php if(get_sub_field('fc_content_buttons_' . $idx)) : ?>
         
          <div class="button-group">
          
            <?= get_variable_button('fc_content_buttons_' . $idx); ?>
         
          </div>
          
        <?php endif; ?>
        
  		</div>
  		
  	<?php endfor; ?>
  	
	</div>
</section>
<?php if(get_sub_field('fc_button_buttons')) : ?>

<section class="<?=get_section_class('section-cta-bar');?>">
	<div class="row">
		<div class="small-48 columns">
			<div class="button-group">
				
        <?=get_variable_button('fc_button_buttons');?>
        
			</div>
		</div>
	</div>
</section>

<?php endif; ?>
<?php
	
	// var
  $cta_text = get_sub_field('fc_cta_text');
  ?>
  
	<section class="<?=get_section_class('section-cta-bar');?>">
		<div class="row">
			<div class="small-48 columns">
				<div class="container">
					<div class="row  align-middle collapse align-justify text-center large-text-left">
						<div class="column small-48 medium-36">
							
	  				<?php if($cta_text) : ?>
	  				
							<?=$cta_text;?>
							
						<?php endif; ?>
						
						</div>
						<div class="column small-48 medium-10">
							
							<?=get_variable_button();?>
							
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
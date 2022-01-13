<?php
	
	// var
	$title 			= get_sub_field('fc_share_title');
	$tweettext 	= str_replace(' ','%20',get_the_title());
	
	?>
	
	<section class="<?=get_section_class('section-share');?>">
		<div class="row align-middle">
			<div class="small-48 columns">
				<ul class="social-list">
					
	  			<?php if($title) : ?>
	  			
					  <li class="title">
					  	<strong><?=$title;?></strong>
					  </li>
					  
					<?php endif; ?>
					
					<li class="share"><a href="http://www.facebook.com/sharer.php?u=<?php the_permalink(); ?>" target="_blank" class="button sharer action facebook" onclick="return fbs_click()" title="Deel op Facebook"><i class="fab fa-facebook-f"></i> Facebook</a></li>
					<li class="share"><a href="http://twitter.com/share?text=<?= $tweettext; ?>" class="tw sharer button action twitter" title="Deel op Twitter" target="_blank"><i class="fab fa-twitter"></i> Twitter</a></li>
					<li class="share"><a href="http://www.linkedin.com/cws/share?url=<?php the_permalink(); ?>" class="li sharer button action linkedin" title="Deel op LinkedIn" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a></li>
				</ul>
			</div>
		</div>
	</section>
<form role="search" method="get" id="searchform" action="<?= home_url('/'); ?>">
	<div class="row collapse">
		<div class="columns">
			<input type="search" value="" name="s" id="s" placeholder="<?php _e( 'Zoeken naar...', 'DEFINE_LANG' ); ?>">
			<input type="submit" id="searchsubmit" value="" class="button postfix">
		</div>
	</div>
</form>

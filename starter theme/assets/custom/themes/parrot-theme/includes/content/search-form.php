<form role="search" method="get" class="searchform" action="<?= esc_url(home_url('/')); ?>">
	<div class="input-group">
	  	<input class="input-group-field" type="text" value="<?=(isset($_GET['s'])) ? esc_attr($_GET['s']) : '';?>" name="s" placeholder="<?php _e( 'Zoeken…', 'nordique' ); ?>" >
	  	<div class="input-group-button">
	    	<button type="submit" value="Submit" class="searchsubmit btn-search button postfix">
				<i class="far fa-search"></i>
			</button>
	  	</div>
	</div>
</form>
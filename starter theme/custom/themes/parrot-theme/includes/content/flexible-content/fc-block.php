<?php 
switch( get_row_layout() ):
	
	case "fc_content":
		get_template_part('includes/content/flexible-content/fc','content');
	break; 
	
	case "fc_cta":
		get_template_part('includes/content/flexible-content/fc','cta');  
	break; 

	case "fc_button":
		get_template_part('includes/content/flexible-content/fc','button');
	break; 
	
	case "fc_image_or_video":
		get_template_part('includes/content/flexible-content/fc','image-or-video');
	break; 

	case "fc_cards":
		get_template_part('includes/content/flexible-content/fc','cards');  
	break; 
		
	case "fc_contact":
		get_template_part('includes/content/flexible-content/fc','contact');
	break;
		
	case "fc_gallery":
		get_template_part('includes/content/flexible-content/fc','gallery');  
	break; 	
	
	case "fc_share":
		get_template_part('includes/content/flexible-content/fc','share');  
	break; 	

endswitch;
?>
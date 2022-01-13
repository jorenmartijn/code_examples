<?php
$short_link = wp_get_shortlink();
$title = get_the_title();
$image  = '';
$twitter_user = '';
?>

<ul class="social-share">
	<li class="share"><a class="sharer" data-sharer="facebook" data-url="<?=$short_link;?>" href="javascript:;" target="_blank"><i class="icon-facebook"></i></a></li>
	<li class="share"><a class="sharer" data-sharer="twitter" data-title="<?=$title;?>" data-picture="<?=$image;?>" data-via="<?=$twitter_user;?>" data-url="<?=$short_link;?>" href="javascript:;" target="_blank"><i class="icon-twitter"></i></a></li>
	<li class="share"><a class="sharer" data-sharer="linkedin" data-url="<?=$short_link;?>" href="javascript:;" target="_blank"><i class="icon-linkedin"></i></a></li>
	<li class="share"><a class="sharer" data-sharer="pinterest" data-url="<?=$short_link;?>" href="javascript:;" target="_blank"><i class="icon-pinterest"></i></a></li>
	<li class="share"><a class="sharer" data-sharer="email" data-url="<?=$short_link;?>" href="javascript:;" target="_blank"><i class="far fa-envelope"></i></a></li>
</ul>

?>
<ul class="social-list">
    <?php $socials = array(
        'facebook' 	    => 'facebook-f',
        'twitter' 	    => 'twitter',
        'linkedin' 	    => 'linkedin',
        'instagram'     => 'instagram',
        'youtube' 	    => 'youtube',
        'vimeo' 		=> 'vimeo-v',
        'pinterest'     => 'pinterest',
        'skype' 		=> 'skype',
    );
    ?>

    <?php foreach($socials as $social => $class) : ?>
        <?php if($field = get_field('sm_' . $social, 'option')) : ?>
            <li><a class="sm_<?=$class;?>" href="<?=$field;?>" title="<?=ucfirst($social);?>" target="_blank"><i class="fab fa-<?=$class;?>"></i></a></li>
        <?php endif; ?>
    <?php endforeach; ?>

</ul>
<?php
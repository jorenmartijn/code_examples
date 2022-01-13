<?php if(get_field('address', 'option')) : ?>
  <p>
    <?php the_field('address', 'option'); ?><br>
    <?php if(get_field('zipcode', 'option')) the_field('zipcode', 'option'); ?> <?php if(get_field('town', 'option')) the_field('town', 'option'); ?>
  </p>
<?php endif; ?>

<?php if(get_field('phone', 'option') && wpmd_is_phone()) : ?>
  <p class="phone">
    <a href="tel:<?php the_field('phone', 'option'); ?>" title="<?php the_field('phone', 'option'); ?>"><i class="fa fa-phone"></i><?php the_field('phone', 'option'); ?></a>
  </p>
<?php elseif(get_field('phone', 'option') && wpmd_is_notphone()) : ?>
  <p class="phone">
    <i class="fa fa-phone"></i> <?php the_field('phone', 'option'); ?>
  </p>
<?php endif; ?>
<?php if(get_field('email', 'option')) : ?>
  <p>
    <a href="mailto:<?php the_field('email', 'option'); ?>" title="<?php the_field('email', 'option'); ?>"><i class="fa fa-envelope"></i><?php the_field('email', 'option'); ?></a>
  </p>
<?php endif; ?>
<p>
  <?php if(get_field('facebook', 'option')) : ?><a href="<?php the_field('facebook', 'option'); ?>" target="_blank" class="button facebook"><i class="fa fa-facebook"></i></a><?php endif; ?>

  <?php if(get_field('linkedin', 'option')) : ?><a href="<?php the_field('linkedin', 'option'); ?>" target="_blank" class="button linkedin"><i class="fa fa-linkedin"></i></a><?php endif; ?>

  <?php if(get_field('twitter', 'option')) : ?><a href="<?php the_field('twitter', 'option'); ?>" target="_blank" class="button twitter"><i class="fa fa-twitter"></i></a><?php endif; ?>
</p>

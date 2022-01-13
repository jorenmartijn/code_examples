<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<header id="ikwil-header"  style="background-image: url('<?= get_field('header_img');?>');">
  <nav id="ikwil-nav">
    <div class="row">
      <div class="small-22 large-24 columns">
        <a href="<?=get_bloginfo('url');?>" title="<?= get_bloginfo('name').' - '.get_bloginfo('description'); ?>" class="logo">
            <figure>
              <img src="<?=content_url();?>/build_ikwil/svg/logo-spril.svg" role="logo" alt="<?=get_bloginfo('name'); ?>" title="<?=get_bloginfo('name'); ?>"/>
            </figure>
        </a>
     </div>
     <div class="small-24 large-16 columns hide-for-small-only">
       <ul id="ikwil-navigation">
         <li><a href="#ikwil-packages">Abonnementen</a></li>
         <li><a href="#contact">Contact</a></li>
       </ul>
     </div>
    </div>
  </nav>
  <div class="speech"></div>
</header>
<div class="row">
  <div class="small-48 large-26 columns">
    <article id="ikwil-article">
      <h1 class="h2-title"><?= get_field('intro_title'); ?></h1>
      <?= get_field('intro_text'); ?>
    </article>
  </div>
  <div class="small-48 large-22 columns" class="ikwil-form-container">
    <div id="ikwil-form">
      <h2 class="h1-title"><?= get_field('header_form_title');?></h2>
      <?= get_field('header_form_text');?>
      <?= ninja_forms_display_form(get_field('header_form'));?>
    </div>
  </div>
</div>
<aside id="ikwil-packages">
  <div class="row">
    <div class="small-48 medium-48 large-16 columns">
      <div id="ikwil-package-left">
        <h2 class="h3-title"><?= get_field('package_title_left');?></h2>
        <?= get_field('package_text_left');?>
        <a href="<?= get_field('package_button_link_left');?>" class="button yellow arrow">
        <?= get_field('package_button_text_left');?>
        <i class="far fa-arrow-right"></i>
        </a>
      </div>
    </div>
    <div class="small-48 medium-24 large-16 columns">
      <div id="ikwil-package-middle">
        <h2 class="h3-title"><?= get_field('package_title_middle');?></h2>
        <span class="price">&euro;<?= get_field('package_price_middle');?>,-</span><span class="text"> / maand</span>
        <sub><?= get_field('package_text_middle');?></sub>
        <?php 
          $package_usps_middle = get_field('package_usps_middle');  
          if(count($package_usps_middle) > 0): ?>
          <ul class="package-usps">
          <?php foreach($package_usps_middle as $usp):?>
            <li class="package-usp">
              <strong class="big-text"><?= $usp['big_text']; ?></strong><br/>
              <span class="small-text"><?= $usp['small_text']; ?></span>
            </li>
          <?php endforeach; ?>
          </ul>
        <?php endif; ?>

      </div>
    </div>
    <div class="small-48 medium-24 large-16 columns">
      <div id="ikwil-package-right">
      <h2 class="h3-title"><?= get_field('package_title_right');?></h2>
      <span class="price">&euro;<?= get_field('package_price_right');?>,-</span><span class="text"> / maand</span>
        <sub><?= get_field('package_text_right');?></sub>
        <?php 
          $package_usps_right = get_field('package_usps_right');  
          if(count($package_usps_right) > 0): ?>
          <ul class="package-usps">
          <?php foreach($package_usps_right as $usp):?>
            <li class="package-usp">
              <strong class="big-text"><?= $usp['big_text']; ?></strong><br/>
              <span class="small-text"><?= $usp['small_text']; ?></span>
            </li>
          <?php endforeach; ?>
          </ul>
        <?php endif; ?>
      </div>
    </div>
  </div>
</aside>
<footer id="ikwil-footer" class="row">
  <div class="small-48 large-16 columns">
    <h3 class="h2-title"><?= get_field('about_title');?></h3>
    <?= get_field('about_text');?>
    <a href="<?= get_field('about_readmore_link'); ?>"><?= get_field('about_readmore_text');?></a>
  </div>
  <div class="hide-for-small-only large-16 columns"></div>
  <div class="small-48 large-16 columns ikwil-contact">
    <h4 id="contact" class="h4-title">Contact gegevens</h4>
    <strong><?= get_field('company_name', 'option');?></strong><br/>
    <?= get_field('company_address', 'option');?><br/>
    <?= get_field('company_zip_city', 'option');?><br/><br/>
    <i class="fa fa-phone" id="phone"></i> <a href="<?= nrdq_get_phone_link(get_field('company_phone', 'option'));?>"><?= get_field('company_phone', 'option');?></a><br/>
    <i class="fa fa-envelope" id="email"></i> <a href="<?= nrdq_get_email_link(get_field('company_email', 'option'));?>"><?= get_field('company_email', 'option');?></a>
    <ul class="social">
      <li><a href="<?= get_field('sm_facebook', 'option');?>" target="_blank" title="Facebook"><i class="fab fa-facebook-square"></i></a></li>
      <li><a href="<?= get_field('sm_twitter', 'option');?>" target="_blank"  title="Twitter"><i class="fab fa-twitter"></i></a></li>
      <li><a href="<?= get_field('sm_linkedin', 'option');?>" target="_blank"  title="LinkedIn"><i class="fab fa-linkedin-square"></i></a></li>
    </ul>
  </div>
  <div class="copyright">
      &copy; <?= date('Y'); ?> <?= get_field('company_name', 'option'); ?>
  </div>
</footer>

  <?php wp_footer(); ?>

<?php get_template_part('includes/nav/mobile-nav'); // get main navigation ?>
</body>
</html>
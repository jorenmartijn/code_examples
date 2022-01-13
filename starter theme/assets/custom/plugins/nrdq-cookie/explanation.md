# Nordique Cookie Melding
---
Onderstaande code voorbeelden kunnen gebruikt worden op de website zelf om bepaalde cookies/scripts wel of niet in te laden op basis van de, door de gebruiker,
uitgevoerde actie in de cookiemelding. Dit werkt voor zowel de uitgebreide als voor de simpele cookiemelding. Let op: dit verschilt in het geval dat er gebruik gemaakt wordt van de AJAX optie in de plugin.

## Normale versie
```php
if(function_exists('nrdq_check_cookie_level') && nrdq_check_cookie_level('functional')){
  // Functionele cookie scripts hier;
}

if(function_exists('nrdq_check_cookie_level') && nrdq_check_cookie_level('analytics')){
  // Analytische cookie scripts hier;
}

if(function_exists('nrdq_check_cookie_level') && nrdq_check_cookie_level('social')){
  // Sociale cookie scripts hier;
}

if(function_exists('nrdq_check_cookie_level') && nrdq_check_cookie_level('ads')){
  // Adverterende cookie scripts hier;
}

//Monster Insights Analytics
if(function_exists('nrdq_check_cookie_level') && !nrdq_check_cookie_level('analytics')){
  // Anonymize IP if cookies not accepted 
  add_filter('monsterinsights_frontend_tracking_options_analytics_before_scripts', function($options){
    $options['anonymize_ips'] = "'set', 'anonymizeIp', true";
    return $options;
  });
}

//Pixel Your Site
if(function_exists('nrdq_check_cookie_level') && !nrdq_check_cookie_level('social')){
  add_filter('pys_disable_by_gdpr', '__return_true');
}

//Pixel Caffeine
add_action('init', function(){
  if(function_exists('nrdq_check_cookie_level') && !nrdq_check_cookie_level('social')){
    remove_action('wp_head', array('AEPC_Pixel_Scripts', 'pixel_init'), 99);
    remove_action('wp_footer', array('AEPC_Pixel_Scripts', 'pixel_init'), 1);
  }
}, 2);

//Olark for WP
if(function_exists('nrdq_check_cookie_level') && !nrdq_check_cookie_level('analytics')){
  remove_action('wp_footer', 'ofw_insert');
}
```
## AJAX versie
```php
  <script type="text" nrdq-cookie-permission="analytics" data-type="javascript">
    // Analytische cookie (java)scripts hier;
  </script>
  
  <script type="text" nrdq-cookie-permission="analytics" data-type="html">
    // Analytische cookie HTML/PHP hier;
  </script>
```
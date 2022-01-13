<?php
/*
 * Breadcrumbs
 */

if ( function_exists('yoast_breadcrumb') ) : ?>

<div class="breadcrumbs gray-light-blue">
  <div class="row">
    <div class="columns">

      <?php yoast_breadcrumb('<div id="breadcrumbs">','</div>'); ?>

    </div>
  </div>
</div>

<?php endif; ?>

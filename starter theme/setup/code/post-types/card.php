<?php
if(!isset($is_ajax)) $is_ajax = false;
if(!isset($id)) $id = get_the_ID();

$image_id = get_post_thumbnail_id($id);
$publish_date = get_the_date('j F Y', $id);
$title = get_the_title($id);
$link = get_the_permalink($id);
$content = get_the_excerpt($id);
?>

<div class="columns small-48 flex-container" data-href>
    <div class="card <?php if ($is_ajax): ?>initialize-interchange<?php endif;?>">
        <div class="card-image bg-lazy" data-src="<?=content_url();?>/build/img/nothing.gif" data-lazy="
            [<?=nrdq_get_image_url($image_id, 'card-small');?>, small],
            [<?=nrdq_get_image_url($image_id, 'card-xlarge');?>, xlarge],
            [<?=nrdq_get_image_url($image_id, 'card-xlargeretina');?>, xlargeretina]">
        </div>

        <div class="card-content">
            <span class="card-date"><?= $publish_date; ?></span>

            <div class="card-box">
                <h3 class="card-title"><?= $title; ?></h3>

                <p class="card-text"><?= $content; ?></p>

                <a href="<?= $link; ?>" class="card-button">
                    <?= __('Lees verder', 'DEFINE_LANG'); ?>
                </a>
            </div>
        </div>
    </div><!-- /.card -->
</div><!-- /.columns -->
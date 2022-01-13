<div class="google-maps">
    <?php $location = get_field('location','option');
    if (!empty($location)) : ?>
        <div class="acf-map">
            <div class="marker" data-lat="<?= esc_attr($location['lat']); ?>" data-lng="<?= esc_attr($location['lng']); ?>"></div>
        </div>
    <?php endif; ?>
</div>
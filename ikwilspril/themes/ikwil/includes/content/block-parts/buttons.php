<?php if ( have_rows( 'buttons' ) ) : ?>
    <div class="button-wrapper">
        <?php while ( have_rows( 'buttons' ) ) : the_row(); ?>
            <?php $button = get_sub_field( 'button' ); ?>
            <?php if ( $button ) { ?>
                <a class="button" href="<?php echo $button['url']; ?>" target="<?php echo $button['target']; ?>"><?php echo $button['title']; ?></a>
            <?php } ?>
        <?php endwhile; ?>
    </div>
<?php endif; ?>
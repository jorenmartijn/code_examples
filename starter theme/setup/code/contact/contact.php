/*
* contact information
*/

$company_name     = get_field('company_name', 'option');
$address          = get_field('company_address', 'option');
$zip_city         = get_field('company_zip_city', 'option');
$email            = get_field('company_email', 'option');
$phone            = get_field('company_phone', 'option');
$fax              = get_field('company_fax', 'option');
$company_kvk      = get_field('company_kvk', 'option');
$company_btw      = get_field('company_btw', 'option');
?>

<?php if($company_name) : ?>
    <div class="row">
        <div class="column">
            <strong><?= $company_name; ?>
        </div>
    </div>
<?php endif; ?>


<?php if($address || $zip_city) : ?>
    <div class="row">
        <div class="column">
            <ul class="contact-list">
                <li class="address">
                    <address>
                        <span><?= $address; ?></span>
                        <span><?= $zip_city; ?></span>
                    </address>
                </li>
            </ul>
        </div>
    </div>
<?php endif; ?>

<?php if($phone || $email) : ?>
    <div class="row">
        <div class="column">
            <ul class="contact-list">
                <?php if($phone) : ?>
                    <li><strong><?= __('T: ', 'DEFINE_LANG');?></strong><a href="tel:"><?= $phone;?></a></li>
                <?php endif; ?>
                <li><strong><?= __('E: ', 'DEFINE_LANG');?></strong><a href="mailto:<?= $email; ?>"><?= $email; ?></a></li>
            </ul>
        </div>
    </div>
<?php endif; ?>

<?php if($company_btw) : ?>
    <div class="row">
        <div class="column">
            <strong><?= __('BTW: ', 'DEFINE_LANG');?></strong><?= $company_btw; ?>
        </div>
    </div>
<?php endif; ?>

<?php if($company_kvk) : ?>
    <div class="row">
        <div class="column">
            <strong><?= __('KVK: ', 'DEFINE_LANG');?></strong><?= $company_kvk; ?>
        </div>
    </div>
<?php endif; ?>
<?php

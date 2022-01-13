<section class="<?= get_section_class('section-contact'); ?>">
	<div class="row expanded <?php if (!post_has_sidebar()) : ?>small-up-1 large-up-2<?php endif; ?> collapse">
		<div class="<?php if (!post_has_sidebar()) : ?>column<?php else : ?>small-48 columns<?php endif; ?>">

			<?php $location = get_field('company_location', 'option');
			if (!empty($location)) : ?>

				<div class="map">
					<div class="acf-map">
						<div class="marker" data-lat="<?= $location['lat']; ?>" data-lng="<?= $location['lng']; ?>"></div>
					</div>
				</div>

			<?php endif; ?>

		</div>
		<div class="<?php if (!post_has_sidebar()) : ?>column<?php else : ?>small-48 columns<?php endif; ?>">
			<div class="contact-info">
				<div class="row small-up-1 medium-up-2 large-up-1 xlarge-up-2<?php if (post_has_sidebar()) : ?> small-collapse medium-uncollapse<?php endif; ?>">
					<div class="column">
						<div class="contact-block">
							<h3 class="is-h4"><?= __('Contact information'); ?></h3>
							<address>
								<span><strong><?= get_field('company_name', 'option'); ?></strong></span>
								<span><?= get_field('company_address', 'option'); ?></span>
								<span><?= get_field('company_zip_city', 'option'); ?></span>
							</address>

							<?php

							// var
							$companyEmail = get_field('company_email', 'option');
							$companyPhone = get_field('company_phone', 'option');
							$companyMobilePhone = get_field('company_phone_mobile', 'option');
							$phoneCaller = preg_replace('/\s+/', '', $companyPhone);
							$mobilePhoneCaller = preg_replace('/\s+/', '', $companyMobilePhone);
							if ($companyEmail || $companyPhone || $companyMobilePhone) : ?>

								<ul class="contact-list">

									<?php if ($companyPhone) : ?><li><i class="far fa-phone"></i><a href="tel:<?= antispambot($phoneCaller, 1); ?>" class="phone-number" title="<?php _e('Bel:', 'nordique'); ?> <?= $companyPhone; ?>"><?= $companyPhone; ?></a></li><?php endif; ?>
									<?php if ($companyMobilePhone) : ?><li><i class="far fa-mobile"></i><a href="tel:<?= antispambot($mobilePhoneCaller, 1); ?>" class="phone-number" title="<?php _e('Bel:', 'nordique'); ?> <?= $companyMobilePhone; ?>"><?= $companyMobilePhone; ?></a></li><?php endif; ?>
									<?php if ($companyEmail) : ?><li><i class="far fa-envelope"></i><a href="mailto:<?= antispambot($companyEmail, 1); ?>" class="email" title="<?php _e('E-mail:', 'nordique'); ?> <?= $companyEmail; ?>"><?= $companyEmail; ?></a></li><?php endif; ?>

								</ul>

							<?php endif; ?>


							<?php

							// var
							$kvk = get_field('company_kvk', 'option');
							$btw = get_field('company_btw', 'option');

							if ($kvk || $btw) : ?>

								<ul class="no-bullet-list extra-mar-top extra-mar-bottom">

									<?php if ($kvk) : ?><li><strong><?= __('KvK:', 'parrot-theme'); ?></strong> <?= $kvk; ?></li><?php endif; ?>
									<?php if ($btw) : ?><li><strong><?= __('VAT:', 'parrot-theme'); ?></strong> <?= $btw; ?></li><?php endif; ?>

								</ul>

							<?php endif; ?>

							<div class="button-group">
								<?= get_variable_button('fc_contact_buttons'); ?>
							</div>
						</div>
					</div>

					<?php if (get_field('company_opening_hours_show', 'option') && have_rows('company_opening_hours_rpt', 'option')) : ?>

						<div class="column">
							<div class="opening-block">
								<h3 class="is-h4"><?= __('Opening hours', 'parrot-theme'); ?></h3>
								<ul class="opening-list">

									<?php while (have_rows('company_opening_hours_rpt', 'option')) : the_row(); ?>
										<?php $current_day = strtolower(date('l')); ?>

										<li <?php if ($current_day == get_sub_field('company_opening_hours_rpt_day')['value']) : ?>class="current-day" <?php endif; ?>>
											<span class="day"><?= get_sub_field('company_opening_hours_rpt_day')['label']; ?></span>

											<?php if (get_sub_field('company_opening_hours_rpt_custom')) : ?>

												<span class="time"><?= get_sub_field('company_opening_hours_rpt_text'); ?></span>

											<?php else : ?>

												<span class="time"><?= get_sub_field('company_opening_hours_rpt_open'); ?> - <?= get_sub_field('company_opening_hours_rpt_closed'); ?></span>

											<?php endif; ?>

										</li>

									<?php endwhile; ?>

								</ul>
							</div>
						</div>

					<?php endif; ?>

				</div>
			</div>
		</div>
	</div>
</section>
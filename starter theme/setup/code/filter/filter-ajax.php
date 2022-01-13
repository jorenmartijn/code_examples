$tax_1 = get_terms(array('taxonomy' => 'tax_1'));
$tax_2 = get_terms(array('taxonomy' => 'tax_2'));
?>

<div class="idea-filter">
    <!--        Search and sort          -->
    <div class="input-container">
        <input type="text" id="filter-search" name="filter-search" placeholder="<?= __('Zoek in berichten', 'DEFINE_LANG');?>">
    </div>

    <div class="input-container">
        <select class="sort" name="filter-sort" id="filter-sort">
            <option selected value=""><?= __('Sorteer berichten', 'DEFINE_LANG'); ?></option>
            <option value="random"><?= __('Willekeurig', 'DEFINE_LANG');?></option>
            <option value="recent"><?= __('Meest recente', 'DEFINE_LANG');?></option>
        </select>
    </div>

    <!--        Tax 1          -->
    <?php if($tax_1): ?>
        <h4 class="filter-title"><?= __('Thema\'s', 'DEFINE_LANG');?></h4>
        <div class="filter-list">
            <?php foreach($tax_1 as $term): ?>
                <div>
                    <input class="filter" type="checkbox" id="<?=esc_attr($term->slug);?>" value="<?=$term->term_id;?>" data-slug="<?=$term->slug;?>" data-tax="<?=$term->taxonomy;?>">
                    <label for="<?=esc_attr($term->slug);?>"><?=$term->name;?></label>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <!--        Tax 2          -->
    <?php if($tax_2): ?>
        <h4 class="filter-title"><?= __('Schaalgrootte', 'DEFINE_LANG');?></h4>
        <div class="filter-list">
            <?php foreach($tax_2 as $term): ?>
                <div>
                    <input class="filter" type="checkbox" id="<?=esc_attr($term->slug);?>" value="<?=$term->term_id;?>" data-slug="<?=$term->slug;?>" data-tax="<?=$term->taxonomy;?>">
                    <label for="<?=esc_attr($term->slug);?>"><?=$term->name;?></label>
                </div>
            <?php endforeach; ?>
        </div><!-- /.filter-list -->
    <?php endif; ?>


</div><!-- /.idea-filter -->
function nrdq_custom_type_archive_display($query) {
    if ( is_admin() || ! $query->is_main_query() )
        return;

    {{#obj.getAllPostTypes}}
    if (is_post_type_archive('{{type-slug}}')) {
        {{#no-pagination}}
        $query->set('posts_per_page', -1);
        {{/no-pagination}}
        {{^no-pagination}}
        $define = strtoupper('{{type-slug}}');
        $query->set('posts_per_page', defined($define . '_ARCHIVE_COUNT') ? constant($define . '_ARCHIVE_COUNT') : DEFAULT_ARCHIVE_COUNT);
        {{/no-pagination}}
    }
    {{/obj.getAllPostTypes}}

    if(is_search()){
        $query->set('posts_per_page', SEARCH_COUNT);
    }

    return;
}

add_action('pre_get_posts', 'nrdq_custom_type_archive_display');
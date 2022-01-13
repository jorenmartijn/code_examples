function nrdq_add_favicon_to_header(){
echo
'
<link rel="apple-touch-icon" sizes="144x144" href="custom/build/favicon/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="custom/build/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="custom/build/favicon/favicon-16x16.png">
<link rel="manifest" href="custom/build/favicon/site.webmanifest">
<link rel="mask-icon" href="custom/build/favicon/safari-pinned-tab.svg" color="#5bbad5">
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="theme-color" content="#ffffff">
';
}
add_action('wp_head', 'nrdq_add_favicon_to_header', 1);
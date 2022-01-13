<?php

// DEFINES
// ARCHIVE POST COUNTS
define('DEFAULT_ARCHIVE_COUNT', 6);

// SEARCH POST COUNT
define('SEARCH_COUNT', 7);

// AJAX ARCHIVE LOAD MORE COUNT
define('DEFAULT_AJAX_LOAD_MORE_COUNT', 6);

require_once (TEMPLATEPATH . '/functions/security.php'); // wordpress/theme security
require_once (TEMPLATEPATH . '/functions/scripts.php'); // load js scripts and css stylesheets
require_once (TEMPLATEPATH . '/functions/theme.php'); // declare output related to theme options
require_once (TEMPLATEPATH . '/functions/filters.php'); // declare content filters
require_once (TEMPLATEPATH . '/functions/admin.php'); // theme options for admin
require_once (TEMPLATEPATH . '/functions/post-types.php'); // add custom post types
require_once (TEMPLATEPATH . '/functions/helpers.php'); // add custom helpers
require_once (TEMPLATEPATH . '/functions/cleanup.php'); // cleanup wp, remove unnecessary scripts
require_once (TEMPLATEPATH . '/functions/gutenberg.php'); // all gutenberg related code (cleanups, blocks, custom functions)

// AJAX Scripts
require_once (TEMPLATEPATH . '/functions/ajax/load-more.php'); // load more and filters

// Classes
require_once (TEMPLATEPATH . '/functions/classes/curl.php');
require_once (TEMPLATEPATH . '/functions/classes/mailchimp.php');
require_once (TEMPLATEPATH . '/functions/classes/ImportDB.php');

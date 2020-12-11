<?php
  /*
   * Hozokit
   * The statement below imports Hozokit Core and other internal plugins.
   * Please keep this require statement at all times at the top.
   * 
  */
  defined( 'ABSPATH' ) || exit;
  require_once(__DIR__ . '/plugins/index.php');

  /*
   * Functions
   * Add theme specific functions below.
   * 
  */
  
  // Loads bundled styles and scripts into the theme.
  // This enqueues the files the way Wordpress intends but
  // if these need to be included a different way, remove this statement and 
  // use the enqueue functions instead: https://developer.wordpress.org/reference/hooks/wp_enqueue_scripts/#user-contributed-notes
  // It resets styles by default (with Normalise).
  Hozokit::load_styles_scripts(
    array(
      'reset_styles' => true
    )
  );
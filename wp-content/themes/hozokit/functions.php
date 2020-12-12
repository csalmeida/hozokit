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
  // It resets styles by default (with Normalize).
  Hozokit::load_styles_scripts(
    array(
      'reset_styles' => true
    )
  );

  // Adds additional data to the site context.
  // This makes it available in the templates.
  // The filter is required so the data is added at the correct stage.
  add_filter( 'timber/context', function( $context ) {
    $global_context = array(
      'example' => 'add new entries to this array to make them available anywhere in any Twig template.'
    );
    
    $context = $context + $global_context;
    return $context;
  } );
<?php
  /*
   * Hozokit
   * The statement below imports Hozokit Core and other internal plugins.
   * Please keep this require statement at all times at the top.
   * 
  */
  require_once(__DIR__ . '/plugins/index.php');

  /*
   * Functions
   * Add theme specific functions below.
   * 
  */
  
  // Insert styles and scripts to be used in the theme.
  // The stylesheet is compiled from SASS files in /styles, scripts from /scripts using Gulp.
  function hozokit_load_styles_scripts() {
    // Retrieves theme version to be provided to bundled styles and script files.
    $theme_version = wp_get_theme()['Version'];

    // Normalize is used to reset styles. Remove this line if not required or an alternative is being used.
    wp_enqueue_style( 'normalize', get_template_directory_uri() . '/assets/css/normalize.css', null, 'v8.0.0');

    // Enqueues the theme's styles and scripts.
    wp_enqueue_style( 'style', get_stylesheet_uri(), null,  $theme_version);
    wp_register_script( 'script', get_template_directory_uri() . '/assets/scripts/bundle.js', "", $theme_version, true );
    wp_enqueue_script('script');
    $translation_array = array( 'templateUrl' => get_template_directory_uri() );      
    //after wp_enqueue_script
    wp_localize_script( 'script', 'wordpress', $translation_array );
  }

  // Load styles and scripts (might need wp_head or wp_footer).
  add_action('wp_enqueue_scripts', 'hozokit_load_styles_scripts');
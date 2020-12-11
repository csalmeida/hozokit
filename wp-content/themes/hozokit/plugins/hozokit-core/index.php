<?php
/*
 * This file includes setup functionality for Hozokit
 * and any additional methods that aid theme development.
*/

// Requires autoload to allow Composer dependencies to be loaded in this file.
// DIR_VENDOR is defined at plugins/index.php
// In this case this includes environment variables.
if (file_exists(DIR_VENDOR . 'autoload.php')) {
  require(DIR_VENDOR . 'autoload.php');
}

class Hozokit {
  // Run any functions common to all sites.
  // Adds a few properties to context.
  public static function setup() {
    // Keeps Gutenberg from rendering <p> tags on Timber's post.preview.
    remove_filter( 'the_content', 'wpautop' );

    // Adds additional data to the site context.
    // This makes it available in the templates.
    // The filter is required so the data is added at the correct stage.
    add_filter( 'timber/context', function( $context ) {
      $context['gateway'] = array(
        'user_is_admin' => current_user_can('administrator'),
        'tracking_enabled' => !self::do_not_track_enabled()
      );

      return $context;
    } );

    self::register_menus();
    self::enable_environment_variables();
  }

  // Verifies if user requested to not be tracked.
  public static function do_not_track_enabled() {
    return (bool)isset($_SERVER['HTTP_DNT']) ?? false;
  }

  // Resets meta boxes and flushes rewrite rules.
  // To be used when adding ACF Fields and custom post types.
  public static function flush() {
    // Resets metabox data positions.
    // Useful when adding custom fields to posts and pages.
    // No need to run this method once ACF field structure becomes permanent.
    delete_user_meta( wp_get_current_user()->ID, 'meta-box-order_post' );
    delete_user_meta( wp_get_current_user()->ID, 'meta-box-order_page' );

    /* !IMPORTANT: Only run this one when adding new custom post types.
      * Remove when related features are added.
    */
    flush_rewrite_rules();
  }

  // Registers default menus and locations.
  private static function register_menus() {
    // Makes menu locations available.
    register_nav_menus(array(
      'primary' => __('Primary'),
      'footer' => __('Footer')
    ));

    // Adds additional data to the site context.
    // This makes it available in the templates.
    // The filter is required so the data is added at the correct stage.
    add_filter( 'timber/context', function( $context ) {
      // Add the default menus to context so they can be accessed in templates.
      $context['menus'] = array(
        'primary' => new Timber\Menu('primary'),
        'footer' => new Timber\Menu('footer')
      );

      return $context;
    } );
  }

  // Enables the use of environment variables if 
  // a .env file is present at the theme folder.
  private static function enable_environment_variables() {
    // A .env variable is required to configure certain services.
    // It looks for an .env file in the theme directory.
    $theme_directory = get_template_directory();

    if (file_exists(get_template_directory() . '/.env')) {
      $dotenv = Dotenv\Dotenv::createImmutable($theme_directory);
      $dotenv->load();
  
      // Adds additional data to the site context.
      // This makes it available in the templates.
      // The filter is required so the data is added at the correct stage.
      add_filter( 'timber/context', function( $context ) {
        // Environment variables are exposed if an environment is specified.
        // A .env file needs to be added to the theme directory with this to work, an error will be thrown otherwise.
        if ($_ENV['APP_ENVIRONMENT']) {
          $context['env'] = $_ENV;
        }
        
        return $context;
      } );
    }
  }
}

Hozokit::setup();
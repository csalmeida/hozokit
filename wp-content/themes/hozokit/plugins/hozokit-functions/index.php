<?php
  /**
   * Loading Environment Variables
  */ 

  // Requires autoload to allow Composer dependencies to be loaded in this file.
  // DIR_VENDOR is defined at plugins/index.php
  // In this case this includes environment variables.
  if (file_exists(DIR_VENDOR . 'autoload.php')) {
    require_once(DIR_VENDOR . 'autoload.php');
  }

  // A .env variable is required to configure certain services.
  // It looks for an .env file in the theme directory.
  $theme_directory = get_template_directory();
  $dotenv = Dotenv\Dotenv::createImmutable($theme_directory);
  $dotenv->load();

  /**
    * Additional functionality
  */ 

  // Verifies if user requested to not be tracked.
  function do_not_track_enabled() {
    return (bool)isset($_SERVER['HTTP_DNT']) ?? false;
  }
  
  /**
    * Adds data to context
  */ 

  // Adds additional data to the site context.
  // This makes it available in the templates.
  // The filter is required so the data is added at the correct stage.
  add_filter( 'timber/context', function( $context ) {
    // Environment variables are exposed if an environment is specified.
    // A .env file needs to be added to the theme directory with this to work, an error will be thrown otherwise.
    if ($_ENV['APP_ENVIRONMENT']) {
      $context['env'] = $_ENV;
    }

    $context['gateway'] = array(
      'user_is_admin' => current_user_can('administrator'),
      'tracking_enabled' => !do_not_track_enabled()
    );
    return $context;
} );
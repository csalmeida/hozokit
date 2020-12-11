<?php
  // Used to include Composer dependencies where necessary.
  define('DIR_VENDOR', __DIR__ . '/vendor/');

  // Initializes all plugins the theme depends on.
  function hozokit_plugins_init() {
    
    // Importing Custom Gutenberg Blocks
    require_once(__DIR__ . '/blocks/index.php');
    require_once(__DIR__ . '/hozokit-core/index.php');
  }

  // Initializing Timber.
  require_once(get_template_directory() . '/vendor/autoload.php');
  $timber = new \Timber\Timber();
  // This is where Timber will look for components.
  // That's why the whole directory of a component (e.g `/templates/components/button/index.twig`) does not need to be specified. 
  $timber::$dirname = array('templates', 'templates/components/');

  class Site extends Timber\Site {
    public function __construct() {
      // Enables admin bar styling and adds support for other elements in the theme.
      add_theme_support( 'admin-bar', array( 'callback' => '__return_false' ) );
      add_theme_support( 'post-thumbnails' );
      add_theme_support( 'menus' );
      add_theme_support( 'html5', array( 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption' ) );
      
      // Adds a few properties to context when the site is initialized.
      add_filter( 'timber_context', array( $this, 'add_to_context' ) );

      // Initializes internal plugins.
      hozokit_plugins_init();
      parent::__construct();
    }

    // Initializes context with the registered menus and site properties.
    function add_to_context( $context ) {
      $context['site'] = $this;

      return $context;
    }
  }

  // Instantiates a new site.
  new Site();

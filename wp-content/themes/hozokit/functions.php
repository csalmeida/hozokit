<?php
    // Importing Hozokit Internal Plugins
    require_once(__DIR__ . '/plugins/index.php');

    // Initializing Timber.
    require_once(__DIR__ . '/vendor/autoload.php');
    $timber = new \Timber\Timber();
    $timber::$dirname = array('templates', 'templates/components/');
    
    // Insert styles and scripts to be used in the theme.
    // The stylesheet is compiled from SASS files in /styles, scripts from /scripts using Gulp.
    function loadStylesAndScripts() {
        $theme_version = wp_get_theme()['Version'];
        wp_enqueue_style( 'normalize', get_template_directory_uri() . '/assets/css/normalize.css' );
        wp_enqueue_style( 'style', get_stylesheet_uri() );
        wp_register_script( 'script', get_template_directory_uri() . '/assets/scripts/bundle.js', "", $theme_version, true );
        wp_enqueue_script('script');
        $translation_array = array( 'templateUrl' => get_template_directory_uri() );
        //after wp_enqueue_script
        wp_localize_script( 'script', 'wordpress', $translation_array );
    }

    class Site extends Timber\Site {
      public function __construct() {
        // Enables admin bar styling.
	      add_theme_support( 'admin-bar', array( 'callback' => '__return_false' ) );
        add_theme_support( 'post-thumbnails' );
        add_theme_support( 'menus' );
        add_theme_support( 'html5', array( 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption' ) );
        add_filter( 'timber_context', array( $this, 'add_to_context' ) );
        // Makes menu locations available.
        register_nav_menus(array(
          'primary' => __('Primary'),
          'footer' => __('Footer'),
          // 'other' => __('Other'),
        ));
        hozokit_plugins_init();
        parent::__construct();
      }

      function add_to_context( $context ) {
        $context['menus'] = array(
          'primary' => new Timber\Menu('primary'),
          'footer' => new Timber\Menu('footer'),
          // 'other' => new Timber\Menu('other'),
        );
        $context['site'] = $this;
        return $context;
      }
    }
    new Site();

    // Load styles and scripts (might need wp_head or wp_footer).
    add_action('wp_enqueue_scripts', 'loadStylesAndScripts');


  // Removes dashboard widgets.
  function remove_dashboard_widgets() {
    global $wp_meta_boxes;
    unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_quick_press']);
    unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_incoming_links']);
    unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_right_now']);
    unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_plugins']);
    unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_recent_drafts']);
    unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_recent_comments']);
    unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_primary']);
    unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_secondary']);
  }

  // Triggers dashboard widgets removal.
  add_action('wp_dashboard_setup', 'remove_dashboard_widgets');


  // Temporary: Resets metabox data positions.
  // This needs to be commented out when the ACF field structure becomes permanent.
  function prefix_reset_metabox_positions(){
    delete_user_meta( wp_get_current_user()->ID, 'meta-box-order_post' );
    delete_user_meta( wp_get_current_user()->ID, 'meta-box-order_page' );
  }

  // Temporary: Remove admin bar in order to avoid extra margins.
  show_admin_bar(false);

  // Temporary: Keeps Gutenberg from rendering <p> tags on Timber's post.preview.
  remove_filter( 'the_content', 'wpautop' );

  /* !IMPORTANT: Only run this one when adding new custom post types.
   * Remove when related features are added.
  */
  // flush_rewrite_rules();
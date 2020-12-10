<?php
/**
 * @package Hozokit_ACF_Blocks
 * @version 1.0
 */
/*
Plugin Name: Hozokit ACF Blocks
Plugin URI: https://github.com/csalmeida/hozokit
Description: This plugin was developed as a way to streamline the register of Gutenberg blocks in Advanced custom fields.

It does not include any markup, only the logic and data exports for them to be used on blocks.

Blocks tend to live at <code>/templates/blocks/</code>.
Author: Cristiano Almeida
Version: 1.0
Author URI: https://www.csalmeida.com
Text Domain: hozokit-acf-blocks
*/

// This line protects files that are not meant to be accessed directly.
defined( 'ABSPATH' ) or die( 'This file cannot be accessed directly.' );

/* Creates dashboard widget to issue warning in case ACF is missing. */
function hozokit_block_dashboard_messages() {
  global $wp_meta_boxes;
  add_meta_box(
    'hozokit_blocks_messages',
    'Hozokit Custom Gutenberg Blocks',
    'hozokit_block_admin_warning',
    'dashboard', 'normal', 'high'
  );
}

// Issues warning when Advanced Custom Fields are not available.
function hozokit_block_admin_warning() {
  if ( !function_exists( 'acf' ) ) {
    echo '<div class="notice notice-error is-dismissible">';
    echo "<p>There seems to be an issue with Advanced Custom fields.</p>";
    echo "<p><b>Hozokit custom Gutenberg Blocks was not loaded.</b></p>";
    echo "</div>";
  }
}

// Registers all available blocks.
function hozokit_acf_init() {
  // Imports block definitions.
  require(__DIR__ . '/blocks.php');
  
  // Bail out if function doesn’t exist.
  if ( !function_exists( 'acf_register_block_type' ) ) {
      return;
  }
  // Register an array of blocks.
  foreach ($blocks as $block) {
    acf_register_block_type($block);
  }
}

/**
 *  This is the callback that displays the block.
 *
 * @param   array  $categories Current defined block categories.
 * @param   array $post To sort categories contextual to post type.
 */

function hozokit_block_categories( $categories, $post ) {
  // Useful when skipping a type to render blocks.
  // if ( $post->post_type === 'page' ) {
  //   return $categories;
  // }

  // Adds additional category.
  return array_merge(
    $categories,
    array(
        array(
            'slug' => 'hozokit',
            'title' => __( 'Hozokit', 'hozokit-blocks' ),
            'icon'  => 'translation',
        ),
    )
  );
}

add_filter( 'block_categories','hozokit_block_categories', 10, 2 );

/**
 *  This is the callback that displays the block.
 *
 * @param   array  $block      The block settings and attributes.
 * @param   string $content    The block content (empty string).
 * @param   bool   $is_preview True during AJAX preview.
 */
function hozokit_block_render( $block, $content = '', $is_preview = false ) {
  $context = Timber::get_context();

  // Store block values.
  $context['block'] = $block;

  // Store field values.
  $context['fields'] = get_fields();

  // Store $is_preview value.
  $context['is_preview'] = $is_preview;

  // Render the block.
  Timber::render("templates/blocks/{$block['key']}/index.twig", $context);
}

// Blocks have dedicated stylesheet.
function hozokit_block_editor_style() {
  wp_enqueue_style(
    'hozokit_block_css',
    get_template_directory_uri() . '/assets/css/block_styles.css'
  );
}

// Registers blocks and stylesheet.
add_action( 'acf/init', 'hozokit_acf_init');
add_action( 'enqueue_block_assets', 'hozokit_block_editor_style' );

// Checks if plugin is activated, if not sends warning to admin.
add_action('admin_notices', 'hozokit_block_admin_warning');
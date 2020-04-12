<?php
defined( 'ABSPATH' ) or die( 'This file cannot be accessed directly.' );

$render_callback = 'hozokit_block_render';

/**
 * This is the definition of an example block with the parameters it needs.
 * Feel free to use this as a template for your first block.
 * The block will only show in Gutenberg if added in ACF.
 */
$example_block = array(
  'name'            => 'example-block',
  'key'				      => 'example-block',
  'title'           => __('Example'),
  'description'     => __("Renders an example block with text."),
  'render_callback' => $render_callback,
  'category'        => 'hozokit',
  'icon'            => 'admin-comments',
  'keywords'        => array( 'example', 'content' ),
);

/** 
 * All blocks need to be added to this array.
 * These will then be registered in ACF and will display in Gutenberg once a field is created that requires the block.
 */
$blocks = array(
  $example_block,
);
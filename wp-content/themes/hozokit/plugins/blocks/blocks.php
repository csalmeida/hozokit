<?php
defined( 'ABSPATH' ) or die( 'This file cannot be accessed directly.' );

$render_callback = 'hozokit_block_render';

$tagline = array(
  'name'            => 'tagline-block',
  'key'				      => 'tagline-block',
  'title'           => __('Tagline'),
  'description'     => __("Site's tagline."),
  'render_callback' => $render_callback,
  'category'        => 'hozokit',
  'icon'            => 'admin-comments',
  'keywords'        => array( 'tagline', 'content' ),
);

$button = array(
  'name'            => 'button-block',
  'key'				      => 'button-block',
  'title'           => __('Button'),
  'description'     => __("Renders button with given url and text."),
  'render_callback' => $render_callback,
  'category'        => 'hozokit',
  'icon'            => 'admin-comments',
  'keywords'        => array( 'button', 'content' ),
);

$blocks = array(
  $tagline,
  $button
);
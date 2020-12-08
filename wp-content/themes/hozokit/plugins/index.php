<?php
// Initializes all plugins the theme depends on.
function hozokit_plugins_init() {
  // Including dependencies.
  define('DIR_VENDOR', __DIR__.'/vendor/');
  
  // Importing Custom Gutenberg Blocks
  require_once(__DIR__ . '/blocks/index.php');
  require_once(__DIR__ . '/hozokit-functions/index.php');
}
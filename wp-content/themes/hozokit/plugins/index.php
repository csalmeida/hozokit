<?php
// Initializes all plugins the theme depends on.
function hozokit_plugins_init() {
  // Importing Custom Gutenberg Blocks
  require_once(__DIR__ . '/blocks/index.php');
}
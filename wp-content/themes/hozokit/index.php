<?php
   // Get Timber's context.
   $context = Timber::get_context();

   // Add new data to this specific view.
   // In this case the current instance of the post (userful to get the title of the page for example)
   // and an array with all posts
   $context['post'] = new Timber\Post();
   $context['posts'] = Timber::get_posts();

   // Then the Twig template that should be rendered is specified
   // and the $context with the new added values is passed to it. 
   Timber::render( 'index.twig', $context);
?>
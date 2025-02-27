![Hozokit logo.](wp-content/themes/hozokit/screenshot.png)

# Hozokit - Theme Building Framework for WordPress
>Hozokit gives you the power to create unique WordPress themes without the WordPress hassle.

By combining modern web technologies and a component based architecture, Hozokit is a theme building
framework structured clearly for both, long-time [WordPress](https://wordpress.org/) developers and beginners.

> [!IMPORTANT]
> This repository has been archived and is no longer actively maintained.

### The benefit of Hozokit is in the setup.

With [Gulp](https://gulpjs.com/) built-in, theme development is streamlined from the off, freeing you from arduous project setup by handling configuration and automation tasks for you. Meaning you can dive straight in to your next project. Hozokit automatically bundles styles, transpiles scripts, watches for changes and handles component files. Meaning you can get right to coding.

Hozokit uses [Timber](https://www.upstatement.com/timber/) which keeps your PHP theme code clean so you can focus on supplying the data and logic, while [Twig](https://twig.symfony.com/) is used for your HTML output. For styling, [SCSS](https://sass-lang.com/) is used in favour of others.

The component based approach helps to streamline development with markup and styling mostly scoped to their own components. Components are scoped to their respective files and can be used on demand by higher order pages such as `'index'`, `'pages'` and other.

Hozokit can also make use of [Advanced Custom Fields](https://www.advancedcustomfields.com/) if you choose. This combination enables the creation of custom Gutenberg blocks without the need to introduce [React](https://reactjs.org/) in the codebase, this can be useful if you would like to stick mostly with HTML, CSS, Javascript and PHP.

This is not a library but can rather be seen as an initial setup to jumpstart the development of custom themes for [WordPress](https://wordpress.org/).

## Documentation

- [Creating Custom Blocks](/docs/blocks.md)
- [Enabling Environment Variables](/docs/environment_variables.md)
- [Enabling Hot Reload](/docs/hot_reload.md)
- [Hozokit Generator](https://github.com/csalmeida/generator-hozokit)

## Requirements

- WordPress `5.0`
- MySQL `8.0.19`
- PHP `7.2.32`
- Node `14.15.1`

## Setup


## Using the Hozokit Generator

One way to create a new project is to use the [Hozokit Generator](https://github.com/csalmeida/generator-hozokit) powered by [Yeoman](https://yeoman.io).

The generator creates a project folder with a Hozokit theme with the option to install WordPress as well.

> Having a PHP server setup and a database to configure WordPress is still required.

```bash
npm install -g yo
npm install -g generator-hozokit
```

Then generate your new project:

```bash
yo hozokit
```

Twig components can also be generated by changing directory into the project:

```bash
yo hozokit:component
```

#### Further Steps

Once the generator has finished running, the following steps might be required if not done already:

1. Setup a webserver capable of running PHP and create a mySQL database for WordPress. Read [how to install WordPress](https://wordpress.org/support/article/how-to-install-wordpress/) to learn more.

1. If dependencies fail to install: Manually install Hozokit Node dependencies for your theme.
   1. Change directory to `your-project-name/wp-content/themes/your-project-name`
   1. Check you are using Node version _14.15.1_ by running `node --version`
   1. Run `npm install` to install dependencies
1. To start development run `npm start`


## Manual install

Download [WordPress](https://wordpress.org/download/) and copy the template folder to `wp-content/themes` folder.
Rename the template folder to match your chosen theme name.

Create a database and either add the details to a `wp-config.php` file or setup using the WordPress onboarding.

> A webserver with PHP and mySQL installed is required in order to follow these steps.

Navigate to the theme directory and set the Node version to the one available in [`.nvmrc`](wp-content/themes/hozokit/.nvmrc). In this example the [Node Version Manager](https://github.com/nvm-sh/nvm) is used, but other methods of setting the version can be used.

Given that `nvm` is installed:

```bash
# Please check the included .nvmrc to get the correct version number.
nvm install 14.15.1

# Will make use of .nvmrc to set the version.
# There might be a prompt to install the requested Node version if it's not present already.
nvm
```

<details>
<summary><b>Running npm scripts on WSL2</b> ⚠️</summary>
<br>

> This is required for Windows users who have a WSL2 setup.

There is an issue (described [here](https://github.com/microsoft/WSL/issues/4224) and [here](https://github.com/microsoft/WSL/issues/4739)) where Windows Subsystem Linux 2 won't listen to any changes made via a text editor running on Windows.

If you're a WSL2 user, these are the steps we took to solve the issue temporarily until a patch is released:

1. [Install Node for Windows](https://nodejs.org/en/download/)
1. [Install nvm for Windows](https://github.com/coreybutler/nvm-windows)
1. Open a Powershell window as an Administrator
1. On the Powershell, navigate to the theme directory. e.g wp-content/themes/hozokit
1. Run nvm use 14.15.1 (in this case .nvmrc seems to be ignored so it needs to be specific)
1. npm install (if not already done)
1. npm start (to watch changes)

Any other tasks can still run on WSL2, however any Node tasks should be run from the Powershell to avoid issues.
</details>

<br>

Download and install dependencies (requires `Node`):

```bash
npm install
```

When changing scripts and styling run the following commands (might require `gulp-cli` installed globally):

```bash
npm start
# or
npm run watch
```
In order to build without watching for changes:

```bash
npm run build
```
> See `gulpfile.js` for all tasks.

### Optional Steps

Create an `.env` file in the [theme folder directory](wp-content/themes/hozokit). An `.env.example` file is provided as a starting point. See [related documentation](/docs/environment_variables.md) for details.

[Hot Reloading can be enabled](/docs/hot_reload.md) once the steps above have been followed.

## Setup with Docker 🐋

1. Make sure you have Docker installed and running on your machine.
1. Using the terminal `cd` into the theme folder directory (e.g `wp-content/themes/hozokit`) where `docker-compose.yml` is located.
1. Run `docker compose up --detach` in order to get the project running.
1. Export the production database into an SQL dump with a method of your choice. (This requires access to the server and cPanel) (optional)
1. Import database using a software of your choice (e.g MySQL Workbench or Table Plus), use the credentials below to connect to the database container. (optional)
1. Once imported add any plugins to `docker/volumes/wordpress/plugins`. These can be downloaded from the cPanel file manager. (optional)
1. Add the uploads folder to `docker/volumes/wordpress/uploads`. Can also be downloaded from the cPanel file manager. (optional)
1. Access `localhost:8080` via the browser and sign in with one of the users available in the production version of the site.
1. Make changes in the files and develop your theme.

#### Database container credentials

```
IP: 127.0.0.1
PORT: 3307

DATABASE NAME: wordpress
USER: wordpress
PASSWORD: password
ROOT PASSWORD: password
```

> ⚠️ These credentials are generated when the container is created and are meant to be used in development only.

#### Using Docker day to day

1. Run `docker compose up --detach`.
1. Access the project in the browser via `localhost:8080`.
1. Make any changes in the files.
1. Run `docker compose down` to stop the containers.

> **Why don't I have to run `npm run watch` or install Node dependencies?**
> That's because one of the Docker containers has taken care of that for you. See `wp-content/themes/hozokit/docker/node.dockerfile` to learn more.

# Customizing the theme

A starting point is to [set the theme name and other information](https://codex.wordpress.org/File_Header) at `hozokit/styles/base.scss`. A custom `screenshot.png` can also be added later on to better identify the theme.

## Writing markup and setting up components

This implementation uses [Timber](https://www.upstatement.com/timber/) and most of the markup will be written in [Twig, a template engine for PHP](https://twig.symfony.com/) that allows you to separate logic markup.

This means that the `HTML` can include values that come from `PHP` scrips. Using Timber also abstracts some of the WordPress API in order to make it friendlier to use.

A component will usually live in `/templates/components` unless it is a part of the [WordPress' template page system](https://developer.wordpress.org/themes/template-files-section/page-template-files/). Each component is composed of a `index.twig` and a `styles.scss`.

For instance a `navigation` component could be created by adding the two files mentioned before to `templates/components/navigation`. Then it can be included in pages, become part of other components and be reused as needed.

## Adding data to context

The idea behind this pattern is to separate markup from PHP logic. To achieve this we use `$context`, a PHP associative array that holds the data to be used in templates.

The data available to these templates can be scoped to a WordPress view (`index.php`, `single.php`, `page.php` and so on) or globaly meaning they can be accessed from any template at any time.

To define context for a specific view, we first get the current Timber context and add to it just like adding to any other associative array. Here's an `index.php` as an example:

```php
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
```

Now all values currently present in `$context` are available to `index.twig` alongside the new `post` and `posts` values we've added in. Here's how to access these values in `index.twig`:

```twig
  {% block content %}
    {# Using the post data added to context #}
    <h2>{{post.title}}</h2>
    <p>{{post.content}}</p>

    <h3>Posts:</h3>
    <ol>
      {# Using the posts data added to context #}
      {% for post in posts %}
      <li><a href="{{post.link}}">{{post.title}}</a></li>
      {% endfor %}
    </ol>
  {% endblock %}
```

Now the values can be accessed through a variable using dot notation, nice!

However, `post` and `posts` won't be available outside `index.twig`. Sometimes it is useful to have values in `$context` that can be accessed in any template.

This is useful when, for example, it is needed to display dynamic information on a footer, or perhaps there's a menu that shows in all pages, or the user avatar.

To add data to `$context` that can be accessed in any template (globally) we need to make use of a filter. Here's an example in `functions.php`:

```php
  // Adds additional data to the site context.
  // This makes it available in the templates.
  // The filter is required so the data is added at the correct stage.
  add_filter( 'timber/context', function( $context ) {
    # Add the new data here.
    $global_context = array(
      'example' => 'add new entries to this array to make them available anywhere in any Twig template.',
      'user_is_admin' => current_user_can('administrator')
    );

    # Merges your additions with the current context.
    $context = $context + $global_context;
    return $context;
  } );
```

To use it, we can reference it in our templates the same way as before. Here's an updated example of `index.twig`, notice how `example` is used but it was not added to context via `index.php` but via `functions.php`:

```twig
  {% block content %}
    {# Added via index.php #}
    <h2>{{post.title}}</h2>
    <p>{{post.content}}</p>

    <h3>Posts:</h3>
    <ol>
    {# Added via index.php #}
      {% for post in posts %}
      <li><a href="{{post.link}}">{{post.title}}</a></li>
      {% endfor %}
    </ol>

    {# Added via functions.php and can be accessed in other templates #}
    <blockquote>{{example}}</blockquote>
  {% endblock %}
```


## Styling the theme and components
Styles are written in [SCSS](https://sass-lang.com/) files and are then merged and converted into a `style.css` for the browser to understand. There are two strands of files, *base* files that live in `/styles` such as `base.scss` or `palette.scss` which hold rules that multiple elements and components make use of.

Then there are more indivual files that define styling for a single component. Each component has a `styles.scss` file attached to it and styles from components can make use of what is defined in `base.scss`.

When styling components it is important that they have their own [`class`](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) in order to avoid unexpected results in styling as all the rules will be merged into a single file.

When styling components make sure to run `npm run watch` or `npm start` from the terminal in order to update styles.

> To enable Hot Reloading [follow this link](/docs/hot_reload.md) for more information.


## Creating scripts
Scripts should be imported into `/scripts/index.js`, ECMAScript 2015+ (ES6) is supported as similar to the styling, [scripts are transpiled](https://babeljs.io/) and then bundled into a single file at `assets/scripts/bundle.js`.

Scripts can be split into multiple files and imported as needed.


### Supporting and maintaining the project
Please feel free to ask any questions, add suggestions or point out bugs by creating an issue. Pull requests are welcome as well! Thank you 🙇🏻

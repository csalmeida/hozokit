![Hozokit logo.](wp-content/themes/hozokit/screenshot.png)

# Hozokit Template for Wordpress
> A template that aims to streamline component based development in [Wordpress](https://wordpress.org/) using [Timber](https://www.upstatement.com/timber/).

This theme template uses Gulp to bundle styles as well as a setup to create components from Twig files. Components are scoped to their respective files and can be used on demand by higher order pages such as `index`, `pages` and other.

This was created to streamline the process of setting up the creation on themes and I've decided to share it in case someone else wants to make use of it. As a consequence, it is somehow opinionated. Markup and styling are mostly scoped to their own components and tools such as [Timber](https://www.upstatement.com/timber/) and [SCSS](https://sass-lang.com/) are used in favor of other ones.

It also makes use of Advanced Custom Fields to allow the creation of Gutenberg blocks without the need to introduce [React](https://reactjs.org/) in the codebase, this can be useful if you would like to stick mostly with HTML, CSS, Javascript and PHP.

This is not a library but rather an initial setup to jumpstart the development of custom themes for [Wordpress](https://wordpress.org/).

## Documentation

- [Creating Custom Blocks](/docs/blocks.md)
- [Enabling Hot Reload](/docs/hot_reload.md)

## Requirements

- Wordpress `5.0`
- MySQL `8.0.19`
- PHP `7.2.32`
- Node `14.15.1`

## Setup

Download [Wordpress](https://wordpress.org/download/) and copy the template folder to `wp-content/themes` folder.
Rename the template folder to match your chosen theme name.

Create a database and either add the details to a `wp-config.php` file or setup using the Wordpress onboarding.

> A webserver with php and mysql installed is required in order to follow these steps.

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

[Hot Reloading can be enabled](/docs/hot_reload.md) once the steps above have been followed.

# Customizing the theme

A starting point is to [set the theme name and other information](https://codex.wordpress.org/File_Header) at `hozokit/styles/base.scss`. A custom `screenshot.png` can also be added later on to better identify the theme.

## Writing markup and setting up components

This implementation uses [Timber](https://www.upstatement.com/timber/) and most of the markup is will be written in [Twig, a template engine for PHP](https://twig.symfony.com/) that allows to separate logic markup.

This means that the `HTML` can include values that come from `PHP` scrips. Using Timber also abstracts some of the Wordpress API in order to make it friendlier to use.

A component will usually live in `/templates/components` unless it is a part of the [Wordpress' template page system](https://developer.wordpress.org/themes/template-files-section/page-template-files/). Each component is composed of a `index.twig` and a `styles.scss`.

For instance a `navigation` component could be created by adding the two files mentioned before to `templates/components/navigation`. Then it can be included in pages, become part of other components and be reused as needed.

## Styling the theme and components
Styles are written in [SCSS](https://sass-lang.com/) files and are then merged and converted into a `style.css` for the browser to understand. There are two strands of files, *base* files that live in `/styles` such as `base.scss` or `palette.scss` which hold rules that multiple elements and components make use of.

Then there are more indivual files that define styling for a single component. Each component has a `styles.scss` file attached to it and styles from components can make use of what is defined in `base.scss`.

When styling components it is important that they have their own [`class`](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) in order to avoid unexpected results in styling as all the rules will be merged into a single file.

When styling components make sure to run `npm run watch` from the terminal in order to update styles. There is no hot reloading so you still need to refresh the page in order to see the results.

## Creating scripts
Scripts should be imported into `/scripts/index.js`, ECMAScript 2015+ (ES6) is supported as similar to the styling, [scripts are being transpiled](https://babeljs.io/) and then bundled into a single file at `assets/scripts/bundle.js`.

Scripts can be splited into multiple files and imported as needed.

### Supporting and maintaining the project
Please feel free to ask any questions, add suggestions or point out bugs by creating an issue. Pull requests are welcome as well! Thank you 🙇🏻




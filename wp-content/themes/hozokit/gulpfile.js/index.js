// Used to create tasks.
const { src, dest, watch, series } = require('gulp');

// Used in compiling SCSS to CSS.
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');

// Used in bundling JavaScript.
const rollup = require('rollup');
const rollupTerser = require('rollup-plugin-terser');
const rollupResolve = require('@rollup/plugin-node-resolve');
const rollupBabel = require('rollup-plugin-babel');

// Manages environment variables.
const dotenv = require('dotenv');

// Used to enable hot reloading.
const browserSync = require('browser-sync').create();

const { componentForwarding } = require('./componentForwarding');

// Initializes environment variables.
// Will look available variables in .env file.
dotenv.config()

// Retrieving environment from env file.
const environment = process.env.APP_ENVIRONMENT
const envIsNotDevelopment = environment != "development" && environment != undefined
if (environment === undefined) console.info('🛑 Environment is not specified in .env, add APP_ENVIRONMENT to enable development features.\n')

// Used in cases where minify if needed in development environments.
// For instance, the staging version of the site.
// Pass to command as an argument. e.g npm run watch --minify
const minifyEnabled = process.argv.includes('--minify')

// Scripts won't minify on development environments.
let rollupPlugins = []
if (envIsNotDevelopment || minifyEnabled) {
  rollupPlugins.push(rollupTerser.terser())
}

/*
  Enables Hot Reloading
  Needs to be configured to the server being used in your .env file. example hozokit.test or localhost:3000
*/

// Hot reloading is setup is APP_URL is available at .env.
let browserSyncProxy = null;
if (environment === "development" && (process.env.APP_URL !== undefined || process.env.APP_URL === null)) {
  browserSyncProxy = process.env.APP_URL
}

// Used to reload browser when changes are made.
const hotReload = browserSync.reload

/*
  Transpiles JavaScript files using Rollup.
*/
function scripts() {
  return rollup.rollup({
    input: './scripts/index.js',
    plugins: [
      rollupResolve(),
      rollupBabel({
        exclude: 'node_modules/**' // only transpile our source code
      }),
    ]
  }).then(bundle => {
    return bundle.write({
      file: './assets/scripts/bundle.js',
      format: 'cjs',
      name: 'version',
      plugins: [
        ...rollupPlugins
      ],
    })
  })
}

/*
  Compiles SCSS into CSS,
  minifies CSS.
*/


/**
 * Paths to compile a theme stylesheet (style.css)
 * and another for the admin side to style blocks (block_styles.css)
 */
const stylesheetCompilePath = 'styles/base.scss'
const stylesheetBlockCompilePath = 'styles/admin.scss'

/**
 * Watches changes in most stylesheets
 * aside from component and block imports. 
 * Used to trigger style compilation or in some cases browser reloads.
*/
const stylesheetWatchPaths = [
  'styles/**/*.scss',
  'templates/components/**/*.scss',
  'templates/components/**', // This path is needed to determine if a whole component folder has been removed.
  'templates/blocks/**/*.scss',
  'templates/blocks/**', // This path is needed to determine if a whole blocks folder has been removed.
  '!styles/_components.scss', // Ignores this file in order to not throw the watcher into a loop.
  '!styles/_blocks.scss' // Ignores this file in order to not throw the watcher into a loop.
]

/**
 * The partials that list components.
 * These are watched on their own to avoid triggering
 * the component forwarding task which would throw the watcher into an infinite loop.
*/
const componentPartialWatchPaths = [
  'styles/_components.scss',
  'styles/_blocks.scss'
]

/* 
 * Watches changes in .twig and php files.
 * php is included because it could include markup
 * or another reason to reload in some edge cases. 
*/
const markupWatchPaths = [
  'templates/**/*.twig',
  '**/*.php',
]

/**
 * Compiles styles into a style.css.
 * Used to render theme styling.
 * @returns {Stream}
 */
function styles() {
  const outputStyle = envIsNotDevelopment|| minifyEnabled ? 'compressed' : 'expanded'

  return src(stylesheetCompilePath)
  .pipe(sass.sync({ outputStyle }).on('error', sass.logError))
  .pipe(rename('style.css'))
  .pipe(dest('./'))
}

/** 
 * Compiles styles scoped to the block editor.
 * Resulting file is assets/css/block_styles.css
 * Used to style blocks and other items on the admin side as needed.
 */
function blockStyles() {
  const outputStyle = envIsNotDevelopment|| minifyEnabled ? 'compressed' : 'expanded'
  
  return src(stylesheetBlockCompilePath)
    .pipe(sass.sync({ outputStyle }).on('error', sass.logError))
    .pipe(rename('block_styles.css'))
    .pipe(dest('./assets/css/'))
}

/**
 * Registers changes in scripts and sass files. 
 * Will enable hot reloading if APP_URL environment variable is provided.
*/
function watcher(callback) {
  // A series of tasks to be performed by the watcher.
  const styleSeries = [componentForwarding, styles, blockStyles];

  if (browserSyncProxy != null && typeof(browserSyncProxy) != 'undefined') {
    // Initiates Browser Sync to allow hot reloading when watching files.
    browserSync.init({
      proxy: browserSyncProxy,
      port: 2077,
      ui: {
        port: 2020
      }
    })

    watch('scripts/*.js', series(scripts))
    .on("change", hotReload)
    
    watch(stylesheetWatchPaths, series(styleSeries))
    .on("change", hotReload)

    watch(componentPartialWatchPaths, series([styles, blockStyles]))
    .on("change", hotReload)

    watch(markupWatchPaths)
    .on("change", hotReload)
  } else {
    // Informs that hot reloading is not available.
    console.info('\n🛑 Hot reloading is not available. Add the address of your server to APP_URL in .env')
    console.info('Find examples of proxies at: https://www.browsersync.io/docs/options/#option-proxy')
    console.info('Files will still be watched and compiled.\n')

    // Bundles scripts.
    watch('scripts/*.js', series(scripts))

    // Keeps watch over style files and runs associated tasks.
    watch(stylesheetWatchPaths)
    .on('change', series(styleSeries)) // Keeps track of changes in files.
    .on('unlinkDir', series(styleSeries)) // Makes sure to unlink any components if a whole directory is removed.
    .on('unlink', series(styleSeries)) // Makes sure these tasks run when a style file is removed.

    // Compiles styles when component partials are changed. 
    watch(componentPartialWatchPaths, series([styles, blockStyles]))
  }

  callback() // This task does not return anything so the callback pattern is used.
}

/**
 * Transpiles scripts and compiles styles.
 * Exits task once done.
*/
function build(callback) {
  series([scripts, componentForwarding, styles, blockStyles])
  callback()
}

/* Compiles all files. */
exports.build = build

/* Watches files during development. */
exports.watch = watcher

/* The default task builds styles and scripts before watching. */
exports.default = series([build, watcher])
const gulp = require('gulp')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const clean = require('gulp-clean')
const rollup = require('rollup')
const rollupTerser = require('rollup-plugin-terser')
const rollupResolve = require('@rollup/plugin-node-resolve')
const rollupBabel = require('rollup-plugin-babel')
const browserSync = require('browser-sync').create();


/*
  Enables Hot Reloading
  Needs to be configured to the server being used. example hozokit.test or localhost:3000
*/

// Change this to where your webserver points to.
const browserSyncProxy = null
// Used to reload browser when changes are made.
const hotReload = browserSync.reload

/*
  Tasked with reloading the browser window everytime there are changes.
*/
gulp.task('hot-reload', function (done) {
  browserSync.reload();
  done();
});

/*
  Transpiles JavaScript files using Rollup.
*/
gulp.task('scripts', () => {
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
        rollupTerser.terser(),
      ],
    })
  })
})

/*
  Compiles SCSS into CSS,
  minifies CSS.
*/

const stylesheetCompilePaths = [
  'styles/base.scss',
  'templates/components/*/style.scss',
  'templates/blocks/*/style.scss',
]

/* These files are concatenated into a temp.scss
 * which is used by admin.scss to scope styles to
 * the component editor in the admin panel of Wordpress.
*/
const stylesheetBlockCompilePaths = [
  'styles/general.scss',
  'templates/components/*/style.scss',
  'templates/blocks/*/style.scss',
]

/* Watches changes in all stylesheets
 * but the temp.scss file used to
 * create a compiled version of styles.
*/
const stylesheetWatchPaths = [
  'styles/*.scss',
  'templates/components/*/*.scss',
  'templates/blocks/*/*.scss',
  '!styles/temp.scss'
]

/* 
 * Watches changes in .twig and php files.
 * php is included because it could include markup
 * or reason to reload in some edge cases. 
*/
const markupWatchPaths = [
  'templates/**/*.twig',
  '**/*.php',
]

/* Compiles a style.css for the front facing side of the site. */
gulp.task('styles', () => {
  return gulp.src(stylesheetCompilePaths)
    .pipe(concat({path: './styles/temp.scss'}))
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./'))
})

/* Compiles styles scoped to the block editor. */
gulp.task('block-styles', () => {
  return gulp.src(stylesheetBlockCompilePaths)
  .pipe(concat({path: './styles/temp.scss'}))
  .pipe(gulp.dest('./'))
  .on('finish', () => {
    gulp.src('./styles/admin.scss')
    .pipe(sass({includePaths: ['./styles/temp.scss']}).on('error', sass.logError))
    .pipe(gulp.src('./styles/temp.scss', {read: false}))
    .pipe(clean())
    .pipe(cleanCSS())
    .pipe(rename('block_styles.css'))
    .pipe(gulp.dest('./assets/css/'))
  })
})

/* Registers changes in scrips and sass files. */
gulp.task('watch', () => {
  if (browserSyncProxy != null && typeof(browserSyncProxy) != 'undefined') {
    // Initiates Browser Sync to allow hot reloading when watching files.
    browserSync.init({
      proxy: browserSyncProxy
    })

    gulp.watch('scripts/*.js', gulp.series('scripts'))
    .on("change", hotReload)
    
    gulp.watch(stylesheetWatchPaths, gulp.series(['styles', 'block-styles']))
    .on("change", hotReload)

    gulp.watch(markupWatchPaths)
    .on("change", hotReload)
  } else {
    // Informs that hot reloading is not available.
    console.info('\n🛑 Hot reloading is not available. Add the address of your server to browserSyncProxy in gulpfile.js')
    console.info('Find examples of proxies at: https://www.browsersync.io/docs/options/#option-proxy')
    console.info('Files will still be watched and compiled.\n')

    gulp.watch('scripts/*.js', gulp.series('scripts'))
    gulp.watch(stylesheetWatchPaths, gulp.series(['styles', 'block-styles']))
  }
})

/* Compiles all files. */
gulp.task('build', gulp.series(['scripts', 'styles', 'block-styles']))

/* The default task builds styles and scripts before watching. */
gulp.task('default', gulp.series(['build', 'watch']))
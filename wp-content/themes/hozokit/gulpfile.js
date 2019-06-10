const gulp = require('gulp')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const clean = require('gulp-clean')

/*
  Transpiles JavaScript files,
  concatenates as needed, (this might not be necessary)
  minifies and exports them.
*/
gulp.task('scripts', () => {
  return gulp.src("./scripts/index.js")
      .pipe(babel({
        presets: ['@babel/env']
      }))
     .pipe(concat('main.js'))
     .pipe(uglify())
     .pipe(gulp.dest('./assets/scripts'))
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
  gulp.watch('scripts/*.js', gulp.series('scripts'));
  gulp.watch(stylesheetWatchPaths, gulp.series(['styles', 'block-styles']));
})

/* Compiles all files. */
gulp.task('build', gulp.series(['scripts', 'styles', 'block-styles']))

const gulp = require("gulp");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify");
const pug = require("gulp-pug");
const concat = require("gulp-concat");
const browserSync = require("browser-sync");

//setting : paths
const paths = {
  root: "./dist/",
  html: "./dist/",
  cssSrc: "./src/scss/**/*.scss",
  cssDist: "./dist/css/",
  jsSrc: "./src/js/**/*.js",
  jsDist: "./dist/js/",
  pug: "./src/pug/",
};

//gulpコマンドの省略
const { watch, series, task, src, dest, parallel } = require("gulp");

//Sass
task("sass", function () {
  return src(paths.cssSrc)
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      sass({
        outputStyle: "expanded", // Minifyするなら'compressed'
      })
    )
    .pipe(
      autoprefixer({
        browsers: ["ie >= 11"],
        cascade: false,
        grid: true,
      })
    )
    .pipe(dest(paths.cssDist));
});

//JS Compress
task("js", function () {
  return src(["./src/js/sample.js", "./src/js/main.js"])
    .pipe(plumber())
    .pipe(concat("bundle.js"))
    .pipe(uglify())
    .pipe(dest(paths.jsDist));
});

// browser-sync
task("browser-sync", () => {
  return browserSync.init({
    server: {
      baseDir: paths.root,
    },
    port: 8080,
    reloadOnRestart: true,
  });
});

task("pug", function () {
  return src([paths.pug + "/**/*.pug", "!" + paths.pug + "/**/_*.pug"])
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>"),
      })
    )
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.html));
});

// browser-sync reload
task("reload", (done) => {
  browserSync.reload();
  done();
});

//watch
task("watch", (done) => {
  watch([paths.pug], series("pug", "reload"));
  watch([paths.cssSrc], series("sass", "reload"));
  watch([paths.jsSrc], series("js", "reload"));
  watch([paths.html], series("reload"));
  done();
});
task("default", parallel("watch", "browser-sync"));

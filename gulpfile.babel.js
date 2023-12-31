import gulp from "gulp";
import { deleteSync } from "del";
import minify from "gulp-csso";
import gulpSass from "gulp-sass";
import sass2 from "sass";
import autoprefixer from "gulp-autoprefixer";

const sass = gulpSass(sass2);

const routes = {
  css: {
    watch: "src/scss/*",
    src: "src/scss/*.scss",
    dest: "dist/css",
  },
  font: {
    src: "src/font/*.otf ",
    dest: "dist/font",
  },
  html: {
    src: "src/index.html",
    dest: "dist",
  },
  image: {
    src: "src/images/*",
    dest: "dist/images",
  },
};

const fonts = () => gulp.src(routes.font.src).pipe(gulp.dest(routes.font.dest));
const htmls = () => gulp.src(routes.html.src).pipe(gulp.dest(routes.html.dest));
const images = () =>
  gulp.src(routes.image.src).pipe(gulp.dest(routes.image.dest));

const styles = () =>
  gulp
    .src(routes.css.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        flexbox: true,
        grid: "autoplace",
      })
    )
    .pipe(minify())
    .pipe(gulp.dest(routes.css.dest));

const watch = () => {
  gulp.watch(routes.css.watch, styles);
  gulp.watch(routes.html.src, htmls);
};

const clean = async () => await deleteSync(["dist/"]);

const prepare = gulp.series([clean]);

const assets = gulp.series([styles, fonts, htmls, images]);

const live = gulp.parallel([watch]);

export const dev = gulp.series([prepare, assets, live]);

export const deploy = gulp.series([prepare, assets]);

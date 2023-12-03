const gulp = require('gulp');
const rename = require("gulp-rename");
const cht = require('gulp-cht');

gulp.task('localization', () => {
    // gulp.src('./index.html')
    // .pipe(cht())
    // .pipe(rename("zh-HK.html"))
    // .pipe(gulp.dest("./"));

    return gulp.src([
        'dist/relationship.min.js',
        'dist/relationship.min.mjs',
        'dist/relationship-mode.min.js',
        'dist/relationship-mode.min.mjs',
        'dist/relationship.d.ts',
    ]).pipe(cht())
    .pipe(rename(function(path) {
        console.log('path', path)
        path.basename = path.basename.replace('.min','.zh-HK.min').replace(".d", '.zh-HK.d');
    }))
    .pipe(gulp.dest('dist/lang/'))
});

gulp.task('default', gulp.series(['localization']))
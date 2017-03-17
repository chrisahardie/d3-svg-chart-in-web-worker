var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gulp = require('gulp');

gulp.task('browserify', function() {
  return browserify('./src/index.js', {
    paths: [
            "./",
            "./src"
          ]
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'));
});

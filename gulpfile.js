var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    shell = require('gulp-shell'),
    spawn = require('child_process').spawn;

gulp.task('clean', shell.task([
    'node ./node_modules/.bin/bem make -m clean -v error'
]));

gulp.task('build', shell.task([
    'node ./node_modules/.bin/bem make -v error'
]));

var bemServerProcess = spawn('node', [
    './node_modules/.bin/bem',
    'server',
    '-v',
    'error'
]);

bemServerProcess.stderr.on('data', function (data) {
    console.log('' + data);
    process.exit();
});

var nodemonInstance;
gulp.task('run', ['build'], function () {
    if (!nodemonInstance) {
        nodemonInstance = nodemon({
            script: 'desktop.bundles/index/index.node.js',
            watch: '__manual__',
            ext: '__manual__'
        }).on('restart', function () {
            console.log('~~~ restart server ~~~');
        });
    } else {
        nodemonInstance.emit('restart');
    }
});

gulp.task('dev', ['run'], function () {
    gulp.watch('desktop.blocks/**/*', ['run']);
    gulp.watch('desktop.bundles/index/*.{yml,bemdecl.js}', ['run']);
});

gulp.task('default', ['dev']);


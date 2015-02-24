var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    shell = require('gulp-shell'),
    spawn = require('child_process').spawn,
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    isInBuildProcess = false,
    needReRun = false,
    reRun = function () {
        needReRun = false;
        gulp.start('run');
    },
    createBuildStream = shell.task([
        'node ./node_modules/.bin/bem make -v error'
    ]),
    isBuildFailed = false,
    onBuildError = function () {
        isBuildFailed = true;
        this.end();
    };

gulp.task('clean', shell.task([
    'node ./node_modules/.bin/bem make -m clean -v error'
]));

gulp.task('build', function () {
    isBuildFailed = false;
    var stream = createBuildStream();

    stream.on('error', onBuildError);

    return plumber().pipe(stream).pipe(plumber());
});

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
    if (!isBuildFailed) {
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
    }
    if (needReRun) { // it seems that some something changed during build process
        setTimeout(reRun, 0); // lets run it again
    } else {
        isInBuildProcess = false; // end of build process
    }
});

gulp.task('watch', function () {
    watch([
        'desktop.blocks/**/*',
        'desktop.bundles/index/*.{yml,bemdecl.js}'
    ], {
        // usePolling: true // use this option if watch didn't catch your changes
    }, function () {
        if (isInBuildProcess) { // if something is changed during build process
            needReRun = true; // we will need to run it again
        } else {
            isInBuildProcess = true; // build process started
            gulp.start('run');
        }
    });
});

gulp.task('default', ['run', 'watch']);

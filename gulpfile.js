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
        'node ./node_modules/.bin/enb make'
    ]),
    isBuildFailed = false,
    onBuildError = function () {
        isBuildFailed = true;
        this.end();
    };

gulp.task('clean', shell.task([
    'node ./node_modules/.bin/enb make clean'
]));

gulp.task('build', function () {
    isBuildFailed = false;
    var stream = createBuildStream();

    stream.on('error', onBuildError);

    return plumber().pipe(stream).pipe(plumber());
});

var enbServerProcess = spawn('node', [
    './node_modules/.bin/enb',
    'server'
]);

enbServerProcess.stderr.on('data', function (data) {
    console.log('' + data);
    process.exit();
});

enbServerProcess.stdout.on('data', function (data) {
    console.log('' + data);
});

process.on('exit', function () {
    enbServerProcess.kill();
});

var nodemonInstance;
gulp.task('run', ['build'], function () {
    if (!isBuildFailed) {
        if (!nodemonInstance) {
            nodemonInstance = nodemon({
                script: 'bundles/index/_index.node.js',
                watch: '__manual__',
                ext: '__manual__'
            }).on('restart', function () {
                console.log('~~~ restart server ~~~');
            });
        } else {
            nodemonInstance.emit('restart');
        }
    }
    if (needReRun) { // it seems that something changed during the build process
        setTimeout(reRun, 0); // lets run it again
    } else {
        isInBuildProcess = false; // end of build process
    }
});

gulp.task('watch', function () {
    watch([
        'blocks/**/*',
        'bundles/index/*.{yml,bemdecl.js}'
    ], {
        // usePolling: true // use this option if watch didn't catch your changes
    }, function () {
        if (isInBuildProcess) { // if something is changed during the build process
            needReRun = true; // we will need to run it again
        } else {
            isInBuildProcess = true; // build process started
            gulp.start('run');
        }
    });
});

gulp.task('default', ['run', 'watch']);

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    shell = require('gulp-shell'),
    spawn = require('child_process').spawn,
    watch = require('gulp-watch'),
    enb = require('enb'),
    isInBuildProcess = false,
    needReRun = false,
    isBuildFailed = false;

gulp.task('clean', shell.task([
    'node ./node_modules/.bin/enb make clean && rm -rf ./.enb/tmp'
]));

gulp.task('test', shell.task([
    'node ./node_modules/.bin/enb make specs'
]));

gulp.task('build', function () {
    isBuildFailed = false;
    return enb.make().fail(function (err) {
        console.error(err);
        isBuildFailed = true;
    });
});

var enbServerProcess;

process.on('SIGINT', function () {
    if (enbServerProcess) {
        enbServerProcess.kill();
    }
    process.exit(0);
});

var nodemonInstance;
gulp.task('run', ['build'], function () {
    if (!enbServerProcess) {
        enbServerProcess = spawn('node', [
            './node_modules/.bin/enb',
            'server',
            '-p',
            '8080'
        ]);

        enbServerProcess.stderr.on('data', function (data) {
            console.warn('' + data);
            process.exit();
        });

        enbServerProcess.stdout.on('data', function (data) {
            console.log('' + data);
        });
    }
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
        setTimeout(function () {
            needReRun = false;
            gulp.start('run');
        }, 0); // lets run it again
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

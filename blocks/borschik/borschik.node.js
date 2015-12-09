var path = require('path');

modules.define('borschik', ['app-logger'], function (provide, logger) {
    var map;
    try {
        var freezeMapPath = path.resolve(path.dirname(require.main.filename), './freeze.json');
        logger.info('Trying to load freeze map JSON by path: ' + freezeMapPath);
        map = require(freezeMapPath);
        logger.info('map loaded');
    } catch (e) {
        logger.warn('freeze.json is not exist, going ahead without freezing...');
    }

    provide({
        link: function (link) {
            var filePath = map ? map[link] : path.join('/bundles/', link);
            if (!filePath) {
                throw new Error('Frozen version for file ' + link + ' has not been found');
            }
            return filePath;
        }
    });
});

var techs = {
        // essential
        fileProvider: require('enb/techs/file-provider'),
        fileMerge: require('enb/techs/file-merge'),

        // optimization
        borschik: require('enb-borschik/techs/borschik'),

        // css
        cssStylus: require('enb-stylus/techs/css-stylus'),
        cssAutoprefixer: require('enb-autoprefixer/techs/css-autoprefixer'),

        // js
        jsBorschikInclude: require('enb-borschik/techs/js-borschik-include'),
        nodeJsWithSources: require('./techs/node-js-with-sources'),
        prependYm: require('enb-modules/techs/prepend-modules'),

        // bemtree
        bemtree: require('enb-bemxjst/techs/bemtree'),

        // bemhtml
        bemhtml: require('enb-bemxjst/techs/bemhtml'),

        // bnsf stuff
        pages: require('./techs/pages'),
        pagesBrowser: require('./techs/pages-browser'),
        controllers: require('./techs/controllers'),
        parameters: require('./techs/parameters')
    },
    enbBemTechs = require('enb-bem-techs'),
    levels = [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/desktop.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/desktop.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bnsf/blocks', check: false },
        { path: 'libs/bnsf/dev.blocks', check: false },
        { path: 'libs/bnsf/history-api-fallback.blocks', check: false },
        { path: 'libs/bnsf/ie-dev.blocks', check: false },
        'desktop.blocks'
    ];

module.exports = function(config) {
    var isProd = process.env.YENV === 'production';

    config.nodes('*.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: levels }],
            [enbBemTechs.deps],
            [enbBemTechs.files],
            [techs.fileProvider, { target: '?.bemdecl.js' }],

            // css
            [techs.cssStylus, { target: '?.noprefix.css' }],
            [techs.cssAutoprefixer, {
                sourceTarget: '?.noprefix.css',
                destTarget: '?.css',
                browserSupport: ['last 2 versions', 'ie 10', 'opera 12.16']
            }],

            // bemtree
            [techs.bemtree, { devMode: process.env.BEMTREE_ENV === 'development' }],

            // bemhtml
            [techs.bemhtml, { devMode: process.env.BEMHTML_ENV === 'development' }],

            // bnsf stuff
            [techs.pages],
            [techs.pagesBrowser],
            [techs.controllers],
            [techs.parameters],

            // browser js
            [techs.jsBorschikInclude, {target: '?.browser.js', sourceSuffixes: ['vanilla.js', 'js', 'browser.js']}],
            [techs.fileMerge, {
                target: '?.pre.js',
                sources: ['?.bemhtml.js', '?.bemtree.js', '?.browser.js', '?.pages.js']
            }],
            [techs.prependYm, { source: '?.pre.js' }],

            // node js
            [techs.nodeJsWithSources, {
                sources: ['?.bemhtml.js', '?.bemtree.js', '?.pages.node.js', '?.controllers.node.js', '?.parameters.js']
            }],
            [techs.prependYm, { source: '?.node.js', target: '_?.node.js' }],

            // borschik
            [techs.borschik, { sourceTarget: '?.js', destTarget: '_?.js', freeze: true, minify: isProd }],
            [techs.borschik, { sourceTarget: '?.css', destTarget: '_?.css', tech: 'cleancss', freeze: true, minify: isProd }]
        ]);

        nodeConfig.addTargets([ '?.bemtree.js', '_?.css', '_?.js', '_?.node.js']);
    });
};

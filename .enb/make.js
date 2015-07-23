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
        nodeJsWithSources: require('../libs/bnsf/.enb/techs/node-js-with-sources'),
        prependYm: require('enb-modules/techs/prepend-modules'),

        // bemtree
        bemtree: require('../libs/bnsf/.enb/techs/bemtree'),

        // bemhtml
        bemhtml: require('enb-bemxjst/techs/bemhtml'),

        // bnsf stuff
        pages: require('../libs/bnsf/.enb/techs/pages'),
        pagesBrowser: require('../libs/bnsf/.enb/techs/pages-browser'),
        controllers: require('../libs/bnsf/.enb/techs/controllers'),
        parameters: require('../libs/bnsf/.enb/techs/parameters'),
        routes: require('../libs/bnsf/.enb/techs/routes'),
        nodeConfigs: require('../libs/bnsf/.enb/techs/node-configs')
    },
    enbBemTechs = require('enb-bem-techs'),
    levels = [
        { path: 'libs/bnsf/pre-bem-core.blocks', check: false },
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/desktop.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/desktop.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bnsf/blocks', check: false },
        { path: 'libs/bnsf/dev.blocks', check: false },
        { path: 'libs/bnsf/history-api-fallback.blocks', check: false },
        { path: 'libs/bnsf/ie-dev.blocks', check: false },
        'blocks'
    ];

module.exports = function(config) {
    var isProd = process.env.YENV === 'production';

    config.nodes('bundles/*', function(nodeConfig) {
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
                browserSupport: ['last 2 versions', 'ie 10', 'opera 12']
            }],

            // bemtree
            [techs.bemtree, {
                devMode: process.env.BEMTREE_ENV === 'development',
                modulesDeps: {
                    'vow': 'Vow',
                    'bemtree-extensions__path': 'path',
                    'bemtree-extensions__redirect': 'redirect'
                }
            }],

            // bemhtml
            [techs.bemhtml, { devMode: process.env.BEMHTML_ENV === 'development' }],

            // bnsf stuff
            [techs.pages],
            [techs.pagesBrowser],
            [techs.controllers],
            [techs.parameters],
            [techs.fileProvider, { target: '?.routing.yml' }],
            [techs.routes, {source: '?.routing.yml'}],
            [techs.fileProvider, { target: '?.api.routing.yml' }],
            [techs.routes, {source: '?.api.routing.yml', target: '?.routes-private.js', moduleName: 'routes-private', public: false}],
            [techs.fileProvider, { target: '?.config.node.yml' }],
            [techs.nodeConfigs, {source: '?.config.node.yml', target: '?.config.node.js'}],

            // browser js
            [techs.jsBorschikInclude, {target: '?.browser.js', sourceSuffixes: ['vanilla.js', 'js', 'browser.js']}],
            [techs.fileMerge, {
                target: '?.pre.js',
                sources: ['?.bemhtml.js', '?.bemtree.js', '?.browser.js', '?.pages.js', '?.routes.js']
            }],
            [techs.prependYm, { source: '?.pre.js' }],

            // node js
            [techs.nodeJsWithSources, {
                before: [
                    '?.config.node.js'
                ],
                after:  [
                    '?.bemhtml.js', '?.bemtree.js',
                    '?.pages.node.js', '?.controllers.node.js',
                    '?.routes.js', '?.routes-private.js'
                ]
            }],
            [techs.prependYm, { source: '?.node.js', target: '_?.node.js' }],

            // borschik
            [techs.borschik, { sourceTarget: '?.js', destTarget: '_?.js', freeze: true, minify: isProd }],
            [techs.borschik, { sourceTarget: '?.css', destTarget: '_?.css', tech: 'cleancss', freeze: true, minify: isProd }]
        ]);

        nodeConfig.addTargets(['_?.css', '_?.js', '_?.node.js']);
    });
};

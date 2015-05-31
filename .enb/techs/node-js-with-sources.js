/**
 * node-js-with-sources
 * =======
 *
 * Collects *vanilla.js* and *node.js*-files by deps using `require`, saves as `?.node.js`.
 *
 * **Options**
 *
 * * *String* **target** - `?.node.js` by default.
 * * *String* **filesTarget** — `?.files` by default.
 *
 * **Example**
 *
 * ```javascript
 * nodeConfig.addTech(require('path/to/node-js-with-sources'));
 * ```
 */
module.exports = require('enb/lib/build-flow').create()
    .name('node-js-with-sources')
    .target('target', '?.node.js')
    .useFileList(['vanilla.js', 'node.js'])
    .defineRequiredOption('sources')
    .useSourceListFilenames('sources')
    .builder(function (sourceFiles, sources) {
        sourceFiles = sources ? sourceFiles.concat(sources.map(function (source) {
            return {
                fullname: source
            };
        })) : sourceFiles;

        var node = this.node,
            dropRequireCacheFunc = [
                'function dropRequireCache(requireFunc, filename) {',
                '    var module = requireFunc.cache[filename];',
                '    if (module) {',
                '        if (module.parent) {',
                '            if (module.parent.children) {',
                '                var moduleIndex = module.parent.children.indexOf(module);',
                '                if (moduleIndex !== -1) {',
                '                    module.parent.children.splice(moduleIndex, 1);',
                '                }',
                '            }',
                '            delete module.parent;',
                '        }',
                '        delete module.children;',
                '        delete requireFunc.cache[filename];',
                '    }',
                '};'
            ].join('\n');

        return [
            dropRequireCacheFunc,
            sourceFiles.map(function (file) {
                var relPath = node.relativePath(file.fullname);

                return [
                    'dropRequireCache(require, require.resolve("' + relPath + '"));',
                    'require("' + relPath + '")'
                ].join('\n');
            }).join('\n')
        ].join('\n');
    })
    .createTech();

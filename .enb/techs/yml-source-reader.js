/**
 * yml-source-reader
 * =======
 *
 * Makes pages declaration out of ?.decl.js
 *
 * **Options**
 *
 * * *String* **target** - `?.node.js` by default.
 * * *String* **filesTarget** — `?.files` by default.
 *
 * **Example**
 *
 * ```javascript
 * nodeConfig.addTech(require('path/to/pages'));
 * ```
 */
module.exports = require('enb/lib/build-flow').create()
    .useSourceFilename('parameters', '?.parameters.js')
    .methods({

        /**
         * @param {string} path
         * @param {object} parameters
         * @param {Function} contentWrapper
         * @returns {Promise}
         * @protected
         */
        _readYmlFileAndReplacePlaceholders: function (path, parameters, contentWrapper) {
            return Vow.all([this._getConfig(output), this._readFile(path)])
                .spread(function (config, content) {
                    for (var key in config) {
                        if (config.hasOwnProperty(key)) {
                            content = content.replace(new RegExp('%' + key + '%', 'g'), config[key]);
                        }
                    }
                    return {
                        path: path.replace('yml', 'js'),
                        content: contentWrapper.call(this, yml.safeLoad(content))
                    };
                }, this);
        }
    });

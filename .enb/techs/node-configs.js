/**
 * node-configs
 * ======
 *
 * Makes node-configs declaration out of ?.config.node.yml
 *
 * **Options**
 *
 * * *String* **target** - `?.config.node.js` by default.
 *
 * **Example**
 *
 * ```javascript
 * nodeConfig.addTech(require('path/to/node-configs', {source: '?.config.node.yml'}));
 * ```
 */
module.exports = require('./yml-source-reader')
    .name('node-configs')
    .target('target', '?.config.node.js')
    .methods({
        /**
         * @param {object} content
         * @returns {string}
         * @protected
         */
        _buildResultString: function (content) {
            if (!content) {
                content = {};
            }

            var output = '';
            for (var key in content) {
                if (content.hasOwnProperty(key)) {
                    output += this._getJSONModuleDefinition(key + '__config', content[key]) + "\n";
                }
            }
            return output;
        }
    })
    .createTech();

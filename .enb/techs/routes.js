/**
 * routes
 * ======
 *
 * Makes routes declaration out of ?.routing.yml
 *
 * **Options**
 *
 * * *String* **target** - `?.routes.js` by default.
 *
 * **Example**
 *
 * ```javascript
 * nodeConfig.addTech(require('path/to/routes', {source: '?.routing.yml'}));
 * ```
 */
module.exports = require('./yml-source-reader')
    .name('routes')
    .defineOption('moduleName', 'routes')
    .target('target', '?.routes.js')
    .methods({
        /**
         * @param {Array} content
         * @returns {string}
         * @protected
         */
        _buildResultString: function (content) {
            if (!content) {
                LOGGER.warn('There is no routes in %s%s', this.node.resolvePath(this.node.unmaskTargetName(this._target)));
                content = [];
            }
            return this._getJSONModuleDefinition(this._moduleName, content);
        }
    })
    .createTech();

/**
 * controllers
 * =======
 *
 * Makes controllers declaration out of ?.decl.js
 *
 * **Options**
 *
 * * *String* **target** - `?.controllers.node.js` by default.
 *
 * **Example**
 *
 * ```javascript
 * nodeConfig.addTech(require('path/to/controllers'));
 * ```
 */
module.exports = require('./bemdecl-reader')
    .name('controllers')
    .target('target', '?.controllers.node.js')
    .methods({
        /**
         * @param {string} blockName
         * @returns {boolean}
         * @protected
         */
        _checkBlockName: function (blockName) {
            return /^controller-/.test(blockName);
        },

        /**
         * @param {Array.<String>} controllers
         * @returns {String}
         * @protected
         */
        _getResultString: function (controllers) {
            return this._getJSONModuleDefinition('controllers', controllers);
        },

        /**
         * @param {String} name
         * @param {Object} data
         * @returns {string}
         * @protected
         */
        _getJSONModuleDefinition: function (name, data) {
            return this._getModuleDefinition(name, JSON.stringify(data));
        }
    })
    .createTech();

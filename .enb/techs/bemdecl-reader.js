/**
 * bemdecl-reader
 * =======
 *
 * Base tech for pages and controllers
 *
 * **Options**
 *
 * * *String* **bemDecl** - `?.bemdecl.js` by default.
 *
 */
module.exports = require('enb/lib/build-flow').create()
    .useSourceFilename('bemDecl', '?.bemdecl.js')
    .builder(function (pathToDecl) {
        return this._processBlocksFromDecl(this._getBlocksFromDecl(pathToDecl));
    })
    .methods({
        /**
         * @param {string} pathToDecl
         * @returns {Array.<string>}
         * @private
         */
        _getBlocksFromDecl: function (pathToDecl) {
            return require(pathToDecl).blocks
                .map(function (block) {
                    return block.name;
                });
        },

        /**
         * @param {Array.<string>} decls
         * @returns {string}
         * @private
         */
        _processBlocksFromDecl: function (decls) {
            var pages = decls.filter(this._checkBlockName, this);
            return this._getResultString(pages);
        },

        /**
         * @param {string} blockName
         * @returns {boolean}
         * @protected
         */
        _checkBlockName: function (blockName) {
            return true;
        },

        /**
         * @param {string} name
         * @param {string} data
         * @returns {string}
         * @protected
         */
        _getModuleDefinition: function (name, data) {
            return "modules.define('" + name + "', function(provide){provide(" + data + ");});\n";
        }
    });

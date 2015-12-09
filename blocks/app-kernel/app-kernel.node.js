modules.define('app-kernel', ['borschik', 'objects'], function (provide, borschik, objects, AppKernel) {
    "use strict";

    provide(AppKernel.decl(/**@lends AppKernel.prototype#*/{

        /**
         * @param {Function} Page
         * @param {NodeRequestData} data
         * @returns {Object}
         * @protected
         */
        _getPageBEMJSON: function (Page, data) {
            return objects.extend(this.__base(Page, data), {
                scripts: [
                    {elem: 'js', url: '//' + this.params.staticHost + borschik.link('index/freezing/_index.js')}
                ],
                styles: [
                    {elem: 'css', url: '//' + this.params.staticHost + borschik.link('index/freezing/_index.css')}
                ]
            });
        }
    }));
});

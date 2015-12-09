modules.define('page-dynamic-with-params', ['i-page'], function (provide, Page) {
    "use strict";

    provide(Page.decl(this.name, {

        update: function (data) {
            return this._update('code-presenter-with-params', data);
        }

    }));
});

modules.define('page-3', ['i-page'], function (provide, Page) {
    "use strict";

    provide(Page.decl(this.name, {

    }, {

        _route: this.name,

        _title: 'dynamic page'

    }));
});

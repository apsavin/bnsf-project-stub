modules.define('page-1', ['i-page'], function (provide, Page) {
    "use strict";

    provide(Page.decl(this.name, {

    }, {

        _route: this.name,

        _title: 'main page'

    }));
});

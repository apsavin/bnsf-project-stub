modules.define('page-4', ['BEMHTML', 'BEMTREE'], function (provide, BEMHTML, BEMTREE, Page4) {
    "use strict";

    provide(Page4.decl({

        update: function (data) {
            return BEMTREE.apply({
                block: 'code-presenter-with-params',
                tech: data.route.parameters.tech
            }).then(function (BEMJSON) {
                Page4.replace(this.findBlockInside('code-presenter-with-params').domElem, BEMHTML.apply(BEMJSON));
            }, this);
        }

    }));
});

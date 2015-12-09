modules.define('test', function (provide) {

    provide({
        sum: function (a, b) {
            return a + b;
        }
    })
});

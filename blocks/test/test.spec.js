modules.define('spec', ['test'], function (provide, test) {
    describe('test sum function', function () {
        it('should be able to return sum of two arguments', function () {
            test.sum(2, 2).should.be.eq(4);
        })
    });

    provide();
});

/*global App */

// TODO: add tests for onBeforeXXX() and onAfterXXX() methods

AsyncTestCase("App.controller.base.Controller", {
    /**
     * This function calls every time before test starts and creates empty container for current view
     */
    setUp: function () {
        //
        // {jQuery} We should create temporary placeholder for views on current document
        //
        $('body').append('<div id="viewContainer"></div>');
        this.ct  = $('#viewContainer');
    },
    /**
     * This function calls after test will complete and removes containers children
     */
    tearDown: function () {
        $('body').children().remove();
    },


    //
    // This is configuration section. All tests below will test config parameters.
    //

    testAutoRunConfig: function () {
        var res  = false;
        var ctrl = new App.controller.base.Controller({autoRun: true, listeners: {run: function () {res = true;}}});
        assertTrue('Controller should run with autoRun set to true', res === true);
        ctrl.destroy();
    },

    testInitMethod: function () {
        var res  = false;
        var ctrl = new App.controller.base.Controller({listeners: {
            init: function () {res = true;}
        }});

        assertTrue('Controller should create itself without bugs', res === true);
    }
});
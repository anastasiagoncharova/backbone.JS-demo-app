/**
 * @singleton
 * Application class. Creates global objects and runs an application. It
 * contains an application entry point in run() method. Should be created
 * in main html file at the end of it only once.
 *
 * @author DeadbraiN
 */
N13.define('App.base.App', {
    mixins : {iface: 'App.mixin.Interface'},

    /**
     * @interface
     * This is where an application starts and our html document is loaded and ready. You should
     * override this method in your child class.
     */
    run: N13.emptyFn,

    /**
     * @constructor
     * Do main initialization of the application and bind run() handler to the document ready state.
     */
    init: function () {
        var me = this;

        this.callMixin('iface');
        //
        // We should run our application after document will be ready
        //
        $(document).ready(function () {
            me.run();
        });
    }
});
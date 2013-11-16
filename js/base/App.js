/**
 * @singleton
 * Application class. Creates global objects and runs an application. It
 * contains an application entry point in run() method, which should be overridden
 * in your child class. You should create it in main html file at the end of it and
 * only once (see example below). Remember, that you shouldn't store any reference
 * to this instance anywhere.
 *
 * Usage:
 *     N13.init({appRoot: ['App', 'js']});  // Binds App namespace to js folder
 *     N13.create('App.Application');       // We don't need to save an app reference
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
     * run() method will be called after document will be ready. So, you need to override this
     * method in your child class.
     */
    init: function () {
        this.callMixin('iface');
        $(document).ready(_.bind(this.run, this));
    }
});
/**
 * Base controller class. All controllers should be derived from this one. The main idea of the controller in
 * listening of events from different objects and call appropriate handlers. This class contains only basic
 * controlling logic. It can create, run, stop and destroy controller. Every methods from this list calls
 * before and after methods. For example, run() method calls onBeforeRun() and onAfterRun() methods inside.
 * You may override these methods for your needs. Also, you may return false in on/beforeRun() method and
 * as a result this controller will not be run. This rule works for all other methods as well.
 * There are additional controller mixins, which extends this class. For example, if your controller should
 * work with views, you may add controller.View mixin for that. For details, about special controller's mixins
 * see App.mixin.controller.* mixins.
 *
 * Usage:
 *     N13.define('App.controller.my.Controller', {
 *         extend  : 'App.controller.base.Controller',
 *         //
 *         // Turns view functionality on for this class. It adds findView() method.
 *         //
 *         mixins  : {view: 'App.mixin.controller.View'},
 *         requires: 'App.view.my.MainView',
 *         //
 *         // This is how we are creating the view. It should be with autoRender: true config
 *         //
 *         configs : {view: 'my.MainView'},
 *
 *         //
 *         // Here we may bind event handlers to views
 *         //
 *         onAfterInit: function () {
 *             this.findView('my.MainView').on('ready', this._onReady, this);
 *         },
 *         //
 *         // 'ready' event handler
 *         //
 *         onReady: function () {
 *             alert('Main view is ready!!!');
 *         }
 *     });
 *
 *
 * @author DeadbraiN
 */
N13.define('App.controller.base.Controller', {
    mixins : {
        iface  : 'App.mixin.Interface',
        observe: 'App.mixin.Observer'
    },
    configs: {
        /**
         * {Boolean} true if we want to run current controller in the constructor
         */
        autoRun: false
    },


    /**
     * @interface
     * Calls before run() method. Is used for initialization and data preparing.
     */
    onBeforeRun: N13.emptyFn,
    /**
     * @interface
     * Calls after run() method. Is used for post initialization.
     */
    onAfterRun: N13.emptyFn,
    /**
     * @interface
     * Calls before class instantiation. Can be used for pre initialization or data set. You can set an items here
     * with setConfig({items: [...]}) method.
     */
    onBeforeInit: N13.emptyFn,
    /**
     * @interface
     * Calls after class instantiation. Can be used for post initializing.
     * Also see onBeforeInit() method.
     */
    onAfterInit: N13.emptyFn,
    /**
     * @interface
     * Calls before controller stops. Can be used for saving data ar last chance actions
     */
    onBeforeStop: N13.emptyFn,
    /**
     * @interface
     * Calls after controller stops.
     */
    onAfterStop: N13.emptyFn,
    /**
     * @interface
     * Calls before controller stops. Can be used for saving data ar last chance actions
     */
    onBeforeDestroy: N13.emptyFn,
    /**
     * @interface
     * Calls after controller stops.
     */
    onAfterDestroy: N13.emptyFn,


    /**
     * Initializes and creates private fields
     */
    initPrivates: function () {
        /**
         * {Boolean} will be true after run() method will be run.
         * @private
         */
        this._running = false;
    },

    /**
     * @constructor
     * Run init() method for all controller related mixins. See App.mixin.controller.* for details
     */
    init: function () {
        this.callMixin('iface');
        this.onBeforeInit();
        //
        // Method init() will be called for all mixins of this class
        //
        this._callMethodFromMixins('init');
        if (this.autoRun) {
            this.run();
        }
        this.onAfterInit();
    },

    /**
     * This method will be called when controller is ready to do main job - create views, models and collections
     */
    run: function () {
        if (this._running || this.onBeforeRun() === false) {
            return;
        }

        this._running = true;
        this.onAfterRun();
    },

    /**
     * Calls before controller will stop. All event handler will be unbind here automatically
     */
    stop: function () {
        if (!this._running || this.onBeforeStop() === false) {
            return;
        }

        this.callMixin('observe');
        this._running = false;
        this.onAfterStop();
    },

    /**
     * Destroys a controller. Can be used as a destructor. Removes the view.
     */
    destroy: function () {
        if (this.onBeforeDestroy() === false) {
            return;
        }
        //
        // Method destroy() will be called from all mixins of this class
        //
        this._callMethodFromMixins('destroy');
    },


    /**
     * Calls specified method in each mixin excepting mixins from except argument
     * @param {String} method Name of the method
     * @param {Array|String=} except Array of class names or class name for which
     * we should skip calling of specified method
     * @private
     */
    _callMethodFromMixins: function (method, except) {
        var mixin;
        var mixins     = this.mixins;
        var exceptions = N13.isArray(except) ? except : N13.isString(except) ? [except] : [];
        var isFunction = N13.isFunction;

        for (mixin in mixins) {
            if (mixins.hasOwnProperty(mixin)) {
                if (exceptions.indexOf(mixin) === -1) {
                    //
                    // This is a small hack. this.callMixin() method doesn't work here, because
                    // it can't resolve in which class callMixin() method is called. This method
                    // should be called only from child classes, not from base one.
                    //
                    if (isFunction(this.mixins[mixin][method])) {
                        this.mixins[mixin][method].call(this);
                    }
                }
            }
        }
    }
});
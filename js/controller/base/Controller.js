/**
 * Base controller class. All controllers should be derived from this one. The main idea of the controller in
 * listening of events from different objects and call appropriate handlers. This class contains only basic
 * controlling logic. It can create, run, stop and destroy controller. Every methods from this list calls
 * before and after methods. For example, run() method calls onBeforeRun() and onAfterRun() methods inside.
 * You may override these methods for your needs. Also, you may return false in on/beforeRun() method and
 * as a result this controller will not be run. This rule works for all other methods as well.
 * There are additional controller mixins, which extends this class. For example, if your controller should
 * work with views, you may add controller.View mixin for that. For details, about special controller's mixins
 * see App.mixin.controller.* namespace.
 *
 * Usage:
 *     N13.define('App.controller.my.Controller', {
 *         extend  : 'App.controller.base.Controller',    // This is parent class, we are inherited from
 *         mixins  : {view: 'App.mixin.controller.View'}, // Turns view functionality on for this class. It adds findView() method.
 *         requires: 'App.view.my.MainView',              // We should add main view class to requires section
 *         configs : {view: 'my.MainView'},               // This is how we are creating the view. It should be with autoRender: true config
 *
 *         onAfterInit: function () {                     // Here we may bind event handlers to views
 *             this.findView('my.MainView').listen(       // Add ready event handler
 *                 'ready',
 *                 this._onReady,
 *                 this
 *             );
 *         },
 *         onReady: function () {                         // 'ready' event handler
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
         * {Boolean} Means that init() method was called or not. It must be called only once.
         * @private
         */
        this._inited    = false;
        /**
         * {Boolean} Means that destroyed instance mustn't be destroyed twice or more
         */
        this._destroyed = false;
        /**
         * {Boolean} will be true after run() method will be run.
         * @private
         */
        this._running   = false;
    },

    /**
     * @constructor
     * Run init() method for all controller related mixins. See App.mixin.controller.* for details
     */
    init: function () {
        if (this._inited) {
            //noinspection JSUnresolvedVariable,JSUnresolvedFunction
            this.trigger('debug', 'init() method is called twice or more in class "' + this.className + '"');
            return;
        }

        this.callMixin('iface');
        this.callMixin('observe');
        this.trigger('beforeinit');
        this.onBeforeInit();
        //
        // Method init() will be called for all mixins of this class
        //
        this._callFromMixins('init');
        if (this.autoRun) {
            this.run();
        }
        this.onAfterInit();
        this.trigger('init');
    },

    /**
     * This method will be called when controller is ready to do main job - create views, models and collections
     * @returns {Boolean} true if it run was done, false - if not.
     */
    run: function () {
        if (this._running) {
            this.trigger('debug', 'Method run() was called, but controller "' + this.className + '" has already run');
            return false;
        }

        this.trigger('beforerun');
        if (this.onBeforeRun() === false) {
            this.trigger('debug', 'Running of controller "' + this.className + '" was stopped, because onBeforeRun() method has returned false');
            return false;
        }
        this._running = true;
        this.onAfterRun();
        this.trigger('run');

        return true;
    },

    /**
     * Calls before controller will stop. All event handler will be unbind here automatically
     * @returns {Boolean} true if controller was stopped, false - otherwise
     */
    stop: function () {
        if (!this._running) {
            this.trigger('debug', 'Method stop() was called, but controller "' + this.className + '" has already stopped');
            return false;
        }

        this.trigger('beforestop');
        if (this.onBeforeStop() === false) {
            this.trigger('debug', 'Stopping of controller "' + this.className + '" was stopped, because onBeforeStop() method has returned false');
            return false;
        }
        this.callMixin('observe');
        this._running = false;
        this.onAfterStop();

        return true;
    },

    /**
     * Destroys a controller. Can be used as a destructor. Removes the view.
     * @return {App.controller.base.Controller|Boolean} this or false
     */
    destroy: function () {
        if (this._destroyed) {
            this.trigger('debug', 'destroy() method is called twice or more in class "' + this.className + '"');
            return false;
        }
        if (!this._inited) {
            this.trigger('debug', 'destroy() method is called in class "' + this.className + '", which was not initialized (created)');
            return false;
        }

        this.trigger('beforedestroy', this);
        if (this.onBeforeDestroy() === false) {
            this.trigger('debug', 'Destroying of view "' + this.className + '" was stopped, because onBeforeDestroy() method has returned false');
            return false;
        }
        //
        // Method destroy() will be called from all mixins of this class
        //
        this._callFromMixins('destroy');
        this.onAfterDestroy();
        this.trigger('destroy');

        return this;
    },


    /**
     * Calls specified method in each mixin excepting mixins from except argument
     * @param {String} method Name of the method
     * @param {Array|String=} except Array of class names or class name for which
     * we should skip calling of specified method
     * @private
     */
    _callFromMixins: function (method, except) {
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
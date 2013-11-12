/**
 * Base controller class. All controllers should be derived from this one. The main idea of the controller is in
 * listening the events from views and call appropriate handlers. You should use "events" configuration property for
 * that. To set the view, use "view" config property. In general it contains two main methods: run() and stop().
 * They call on controller run (after creation) and stop(before destroy). By default, it creates/renders a view in
 * run and adds all event handlers to it. On stop(), it destroys the view and unbind all events.
 *
 * It may find view by query. Query is a string in format: 'view1 [> view2 [> view3 ...]]'. > symbol means embedded
 * or nested view. For example query: 'view1 > view2' means view2 inside view1. Symbol > means not only one view
 * inside other, it also means that one view inside other, inside other and so on. For example, if we have views:
 * 'view1 > view2 > view3'. We may create a query in different ways: 'view1 > view3' or 'view1 > view2 > view3'
 * or 'view1 > view2'. First and second queries are similar in case if there is only one view3 inside the view2.
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
         * TODO:
         * TODO: i should rework this. parsing should be here, but not in the router class
         * TODO:
         * {String} Matcher string. This string will be used for parsing of parameters obtained from
         * URL hash. For example: '#libraryNavigator/key/123/id34' with matcher string '/*location/id:facilityId' will
         * be parsed into the ['/key/123', '34']
         */
        paramRe     : null,
        /**
         * {Boolean} true if we want to run current controller in the constructor
         */
        autoRun     : false
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
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
         * {String|Object|Backbone.View} The name of the view or configuration object, which will be controlled
         * by this controller. e.g.: 'libraryNavigator.View' or {cl: 'libraryNavigator.View', title: 'Yahoo!'}
         * Controller listens specified events from view and calls bind handlers.
         */
        view        : null,
        /**
         * {String} Prefix namespace of the view, according to the view folder. For example: 'App.view'. Should
         * be set without dot at the end.
         */
        viewNs      : 'App.view',
        /**
         * {String} Prefix namespace for all controllers. This prefix + alias will produce full namespace for specified
         * class. For example: controllerNs + '.' + 'module.MyController' -> 'App.controller.module.MyController'.
         */
        controllerNs: 'App.controller',
        /**
         * {Array|String} Nested controllers aliases or configurations. e.g.: ['Controller'] or [{cl: 'Controller', cfg: 123}] or 'Controller'
         */
        controllers : [],
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
         * {Boolean} true to skip rendering the view (but it can contain tree reference), false - otherwise
         */
        noView      : false,
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
     * with setItems() method.
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
     * Initializes and creates private fields
     */
    initPrivates: function () {
        this.callMixin('iface');

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
        this._createView();
        this._createControllers();
        if (this.autoRun) {
            this.run();
        }
        this.onAfterInit();
    },

    /**
     * This method will be called when controller is ready to do main job - create views, models and collections
     */
    run: function () {
        if (!this._running) {
            if (this.onBeforeRun() !== false) {
                this._running = true;
                this._runControllers();
                this.onAfterRun();
            }
        }
    },

    /**
     * Calls before controller will stop. All event handler will be unbind here automatically
     */
    stop: function () {
        if (this._running) {
            if (this.onBeforeStop() !== false) {
                this.callMixin('observe');
                this._running = false;
                this.onAfterStop();
            }
        }
    },

    /**
     * Destroys a controller. Can be used as a destructor. Removes the view.
     */
    destroy: function () {
        if (this.onBeforeDestroy() !== false) {
            if (!this.noView && this.view instanceof Backbone.View) {
                this.view.destroy();
                delete this.view;
            }
        }
    },

    /**
     * Sets view config or name. e.g.: 'libraryNavigator.View' or {cl: 'libraryNavigator.View', title: 'Yahoo!'}.
     * Should be called before run() method. For example in onBeforeInit().
     * @param {Object|String|Backbone.View} view Class name or config.
     */
    setView: function (view) {
        if (view === '' || !N13.isString(view) && !N13.isObject(view) && !(view instanceof Backbone.View)) {
            this.trigger('error', 'Invalid view parameter in method App.controller.base.Controller::setView(). String, object or Backbone.View required.');
            return;
        }

        this.view = view;
    },

    /**
     * Finds view by query. Query is a string in format: 'view1 [> view2 [> view3 ...]]'
     * > symbol means embedded or nested view. For example query: 'view1 > view2' means
     * view2 inside view1. Symbol > means not only one view inside other, it also means
     * that one view inside other, inside other and so on. For example, if we have views:
     * 'view1 > view2 > view3'. We may create a query in different ways: 'view1 > view3'
     * or 'view1 > view2 > view3' or 'view1 > view2'. First and second queries are similar
     * in case if there is only one view3 inside the view2.
     * @param {String} query
     * @return {App.view.base.View|null} found view instance or null
     */
    findView: function (query) {
        if (this.view && N13.isString(query) && query !== '') {
            return this._findView(query.split('>'), [this.view]);
        }

        return null;
    },

    /**
     * Returns controller instance or null if not found by index or class name
     * @param {String|Number} id Class name or index
     * @return {Object} an instance or null
     */
    findController: function (id) {
        if (N13.isString(id)) {
            return _.find(this.controllers, function (v) {return v.className === id;}) || null;
        } else if (_.isNumber(id)) {
            return this.controllers[id];
        }

        return null;
    },

    /**
     * Recursive view finder. It walks thought views hierarchy and try to find
     * view by query array. See public findView() for details.
     * @param {Array} query Array of nested views from left to right.
     * @param {Array} views Array of nested views on current view
     * @return {null|App.view.base.View}
     * @private
     */
    _findView: function (query, views) {
        var viewAlias = query.length ? query[0].replace(/^\s+|\s+$/g, '') : null; // this is a trim
        var i;
        var len;

        if (viewAlias && views) {
            for (i = 0, len = views.length; i < len; i++) {
                //
                // 9 - means len of 'App.view.' string
                //
                if (views[i].className.substr(9) === viewAlias) {
                    query.shift();
                    if (query.length === 0) {
                        return views[i];
                    } else {
                        return this._findView(query, views[i].items);
                    }
                }
            }
        }

        return null;
    },

    /**
     * Creates view, which was set by setView() method or through "view" config. It also binds events of
     * view to the handlers of current controller.
     * @private
     */
    _createView: function () {
        var cfg  = {};
        var view;
        var View;

        /**
         * @type {{cl: String}|String} The string class name or it's configuration
         */
        view = this.view;
        if (N13.isString(view)) {
            View = N13.ns(this.viewNs + '.' + view, false);
        } else if (N13.isObject(view) && N13.isString(view.cl)) {
            View = N13.ns(this.viewNs + '.' + view.cl, false);
            cfg  = view;
        }

        if (View) {
            this.view = new View(cfg);
        }
    },

    /**
     * Creates sub controllers instances from it's configurations or class names. This method
     * uses controllers configuration parameter to do this.
     * @private
     */
    _createControllers: function () {
        var i;
        var len;
        var ctrl;
        var isObject    = N13.isObject;
        var isString    = N13.isString;
        var ns          = N13.ns;
        var controllers = isString(this.controllers) ? [this.controllers] : this.controllers;
        var instances   = [];
        var ctrlNs      = this.controllerNs;

        for (i = 0, len = controllers.length; i < len; i++) {
            ctrl = controllers[i];

            if (isString(ctrl)) {
                instances.push(new (ns(ctrlNs + '.' + ctrl, false))());
            } else if (isObject(ctrl)) {
                instances.push(new (ns(ctrlNs + '.' + ctrl.cl, false))(ctrl));
            } else {
                this.trigger('debug', 'Invalid nested controller "' + ctrl + '" of controller "' + this.className + '". This controller will be skipped.');
            }
        }
        this.controllers = instances;
    },

    /**
     * Runs all sub controllers if exist.
     * @private
     */
    _runControllers: function () {
        var i;
        var len;
        var controllers = this.controllers;

        for (i = 0, len = controllers.length; i < len; i++) {
            controllers[i].run();
        }
    }
});
/**
 * This mixin is created only for App.controller.base.Controller class. It adds
 * view related logic into the controller. So, after that you may control views
 * and its nested views also. It depends on some configuration:
 *
 *     view   {String|Object|Backbone.View} The name of the view or configuration
 *            object, which will be controlled by this controller. e.g.:
 *            'libraryNavigator.View' or {cl: 'libraryNavigator.View', title: 'Yahoo!'}.
 *            Should be null by default
 *            Controller listens specified events from view and calls bind handlers.
 *     viewNs {String} Prefix namespace of the view, according to the view folder. For
 *            example: 'App.view'. Should be set without dot at the end. Should be
 *            'App.view' by default.
 *     noView {Boolean} true means that, this controller may control specified view,
 *            but it can't create or destroy it. false - means that current controller
 *            should create view and destroy it later.
 *
 * Usage:
 *
 *     N13.define('App.controller.MyController', {
 *         extend  : 'App.controller.base.Controller',
 *         mixins  : {view: 'App.mixin.controller.View'},
 *         requires: ['App.view.my.MainView'],
 *         configs : {
 *             view  : 'my.MainView',
 *             viewNs: 'App.view'
 *         }
 *     });
 *
 *     var ctrl    = new App.controller.MyController(...);
 *     var subView = ctrl.findView('my.MainView > my.SubView');
 *
 * @author DeadbraiN
 */
N13.define('App.mixin.controller.View', {
    configs : {
        /**
         * {String} Prefix namespace of the view, according to the view folder. For
         * example: 'App.view'. Should be set without dot at the end. Should be
         * 'App.view' by default.
         */
        viewNs: 'App.view',
        /**
         * {String|Object|Backbone.View} The name of the view or configuration
         * object, which will be controlled by this controller. e.g.:
         * 'libraryNavigator.View' or {cl: 'libraryNavigator.View', title: 'Yahoo!'}.
         * Should be null by default
         */
        view  : null
    },


    /**
     * @constructor
     * Creates view instance and all nested views also
     */
    init: function () {
        var cfg  = {};
        var view;
        var View;

        //
        // view parameter must be set from outside by setConfig({view: App.view.ase.View})
        //
        if (this.noView) {
            return;
        }

        /**
         * {String=} This field contains normalized view query. For example: 'view1 > view2' -> 'view1>view2'
         */
        this.normalViewQuery = null;

        /**
         * {RegEx} String left+right trimming regular expression.
         * @private
         */
        this._trimRe         = /^\s+|\s+$/g;
        /**
         * {Array} Array of view instances, which were found with findView() method
         */
        this._views          = [];

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
     * Finds view by query. Query is a string in format: 'view1 [> view2 [> view3 ...]]'
     * > symbol means embedded or nested view. For example query: 'view1 > view2' means
     * view2 inside view1. Symbol > means not only one view inside other, it also means
     * that one view inside other, inside other and so on. For example, if we have views:
     * 'view1 > view2 > view3'. We may create a query in different ways: 'view1 > view3'
     * or 'view1 > view2 > view3' or 'view1 > view2'. First and second queries are similar
     * in case if there is only one view3 inside the view2.
     * @param {String} query
     * @return {Array} Array of App.view.base.View instances or empty array
     */
    findView: function (query) {
        var queryArr;
        var me = this;

        if (!me.view || !N13.isString(query) || query === '') {
            return null;
        }

        queryArr = _.map(query.split('>'), function (q) {return q.replace(me._trimRe, '');});
        me._views          = [];
        me.normalViewQuery = queryArr.join('>');
        me._findView(queryArr, [me.view]);

        return me._views[0] || me._views;
    },

    /**
     * Destroys a view related logic from the controller. This is an analog of a destructor.
     * In case of noView configuration parameter is set to true, then destroy will be skipped.
     */
    destroy: function () {
        if (!this.view instanceof Backbone.View || this.noView) {
            return;
        }

        this.view.destroy();
        this.view = null;
    },


    /**
     * Recursive view finder. It walks thought views hierarchy and try to find
     * view by query array. See public findView() for details.
     * @param {Array} query Array of nested views from left to right.
     * @param {Array} views Array of nested views on current view
     * @private
     */
    _findView: function (query, views) {
        //
        // As you remember, we have App.util.trim() method for trimming, but here we shouldn't use
        // it, because of additional dependency. All base classes should have as minimum dependencies
        // as possible. It's important if we are speaking about loose coupling.
        //
        var viewAlias  = query[0] || null;
        var classNsLen = this.viewNs.length + 1;
        var i;
        var len;

        if (viewAlias && views) {
            for (i = 0, len = views.length; i < len; i++) {
                if (views[i].className.substr(classNsLen) === viewAlias) {
                    query.shift();
                    if (query.length === 0) {
                        this._views.push(views[i]);
                        query = this.normalViewQuery.split('>');
                        if (query.length > 1) {
                            this._findView(this.normalViewQuery.split('>'), [views[i]]);
                        }
                    }
                }
                this._findView(query, views[i].items);
            }
        }
    }
});
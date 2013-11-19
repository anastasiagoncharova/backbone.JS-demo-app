/**
 * Base view. Contains base interface for all views in application. It encapsulates App.mixin.Interface mixin.
 * So you may use methods like initPrivates(), initPublics() and afterInit() as well. In general this view operates
 * with a few entities: template, items, root element, data and so on. All of them are available in configuration (see
 * N13.configs property for details). Also, you can set these values by setConfig() method.
 *
 * In general, there are two view types: Singleton (viewport) view and reusable views.
 * 1. For singleton views we should set elPath to special unique css selector ('#container', '.some-class',...).
 *    In this case, html page should contain the tag with this selector. In general these views contain nested views.
 * 2. Reusable views should contain 'auto' value in elPath (default value). You can just skip this parameter for that.
 *    Later, the application will apply unique ids for this views and this.el properties will be pointed to this ids.
 *    It means, that it will be unique for all sub view instances.
 *
 * Also, you may need for some additional functionality. For example: show/hide or enable/disable view. For this, we
 * have special mixins in App.mixin.view.* namespace. See them for details.
 *
 * Usage:
 *   N13.define('App.view.MyView', {
 *       extend : 'App.view.base.View',
 *       configs: {
 *           template: 'myTemplate',      // Underscore template for main view
 *           items   : [                  // Sub views
 *               'subView1',
 *               {
 *                   cl   : 'subView2',
 *                   title: 'Sub View'
 *               }
 *           ],
 *           elPath  : '.myContainer'     // elPath must be set for main views, for sub views it should be 'auto'
 *       },
 *
 *       onBeforeRender: function () {
 *           this.callParent(arguments);
 *           this.setConfig({data: {header: 'Yahoo!', footer: 'Yes!'}});
 *       }
 *   });
 *
 *
 * Events:
 *     beforeinit    - fires before instance is created.
 *     init          - fires after instance is created.
 *     beforerender  - fires before view is rendered.
 *     render        - fires after view is rendered.
 *     beforedestroy - fires before view is destroyed.
 *     destroy       - fires after view is destroyed.
 *     beforeclear   - fires before view is cleared (DOM remove).
 *     clear         - fires after view is cleared (DOM remove).
 *     beforeshow    - fires before view is show.
 *     show          - fires after view is show.
 *     beforehide    - fires before view is hide.
 *     hide          - fires after view is hide.
 *     beforedisable - fires before view is disable.
 *     disable       - fires after view is disable.
 *     error         - fires id error is occurs.
 *
 *
 * @author DeadbraiN
 */
N13.define('App.view.base.View', {
    extend  : 'Backbone.View',
    mixins  : {
        iface  : 'App.mixin.Interface',
        observe: 'App.mixin.Observer'
    },
    configs : {
        /**
         * @required
         * {String} CSS path for root DOM element, where this widget will be rendered. 'auto' means that id for child
         * views will be generated by this view and will pass to render() method. In case of 'auto' value template of
         * current view should contain the same amount of nested container tags for child views as items configuration.
         * Also, these tags must contain class='innerContainer'. So, the real value (not 'auto') should be set only in
         * viewport views. All other views should contain 'auto' value, because they can be reused. This argument is
         * related to autoIncrementId.
         */
        elPath          : 'auto',
        /**
         * {String} Means that all nested auto views will be marked with auto generated ids. This argument is related
         * to elPath.
         */
        autoIncrementId : 'auto',
        /**
         * {String} The name of the class, which should be added into the all placeholders in parent view template. If
         * some tag contains this class, it means that this is a placeholder for view with elPath === 'auto'.
         */
        containerCls    : 'innerContainer',
        /**
         * {String|Boolean} Name of the template class for current view or false if current class doesn't use template
         */
        template        : null,
        /**
         * {String} Name of the static property of template class, which contains template string
         */
        templateDataProp: 'data',
        /**
         * {String} String prefix of the templates folder. It should be a folder where all templates are placed
         */
        templateNs      : 'App.template',
        /**
         * {String} The same as templateNs, but for views folder. Folder where all views are placed.
         */
        viewNs          : 'App.view',
        /**
         * {Array} Array of view's class names or configurations, which will be inside the current view.
         * e.g.: ['libraryNavigator.View', 'libraryNavigator.MyView'] or [{cl: 'libraryNavigator.View', title: 'Yahoo!'}].
         * You can use 'cl' property to set the class name.
         */
        items           : null,
        /**
         * {Boolean} Runs render method if true in constructor
         */
        autoRender      : false,
        /**
         * {Object} Listener object. See Observer mixin for details.
         */
        listeners       : {}
    },
    statics : {
        /**
         * {Number} Global unique start id for views. This id will be increased every time, then new view will be created.
         */
        _currentId: 0
    },


    /**
     * @interface
     * Calls before class instantiation. Can be used for pre initialization or data set. Create an array
     * of inner views instances without rendering.
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
     * Calls before render process will begin. Can be used for preparing of user data.
     * It instantiates all nested views.
     * @param {Element} el Root DOM element of the current view
     * @returns {undefined|Boolean} false means, that rendering will be stopped, all other values will approve rendering.
     */
    onBeforeRender: N13.emptyFn,
    /**
     * @interface
     * Calls after render process will begin. Can be used for applying additional elements on view.
     * Also see onBeforeRender() method.
     * @param {Element} el Root DOM element of the current view
     */
    onAfterRender: N13.emptyFn,
    /**
     * @interface
     * Calls before destroy process will begin. Can be used for destroying of nested objects or nested non standard views.
     * @returns {undefined|Boolean} false means, that destroying will be stopped, all other values will approve destroy.
     */
    onBeforeDestroy: N13.emptyFn,
    /**
     * @interface
     * Calls after view will be destroyed.
     */
    onAfterDestroy: N13.emptyFn,
    /**
     * @interface
     * Calls before clear (DOM remove) process will begin. Can be used for clearing of nested DOM nodes.
     * @returns {undefined|Boolean} false means, that clear will be stopped, all other values will approve clear.
     */
    onBeforeClear: N13.emptyFn,
    /**
     * @interface
     * Calls after view will be cleared (DOM remove).
     */
    onAfterClear: N13.emptyFn,


    /**
     * It calls before all other initializations in this class.
     */
    beforeInit: function () {
        /**
         * @config
         * {Object|null} This configuration parameter should exist in every view class. Later, you may
         * set it by setConfig({data: {...}}) method. We need set it to null, because it will not
         * be possible to set it with setConfig() method if its undefined.
         */
        if (!N13.isObject(this[this.templateDataProp])) {
            this[this.templateDataProp] = null;
        }
    },

    /**
     * Public fields initializer and creator. This is just stub. In child classes we
     * can use this method without mixin. Like this:
     *
     *     initPublics: function () {
     *         this.callParent(arguments);
     *
     *         // do something
     *     }
     */
    initPublics: function () {
        /**
         * {Boolean} true id current view has already rendered
         */
        this.rendered = false;
        /**
         * {jQuery.Element} Equivalent of the this.$el, but more abstract
         */
        this.el       = null;
    },

    /**
     * @constructor
     * Creates/initializes all private and public fields, mixins and all nested views. Please note, that this is only
     * instantiating of current and all nested classes. It's not rendering. So, after that, you can add event handlers
     * for this and all nested views.
     */
    init: function () {
        //
        // this.$el should be declared before Backbone.View will be called,
        // because Backbone.View uses it for event binding. If auto increment value is set, then
        // we should skip query. It will be done in render() method.
        //
        this._updateEl();
        this.callParent(arguments);
        this.callMixin('iface');
        this.callMixin('observe');

        this.trigger('beforeinit', this);
        this.onBeforeInit();
        this._createItems();
        this.onAfterInit();
        this.trigger('init');

        if (this.autoRender) {
            this.render();
        }
    },

    /**
     * @override
     * Renders current view and all nested views. You can prevent rendering in child class, if onBeforeRender()
     * method will return false.
     * @param {String=} containerQuery CSS Query of the DOM tag, which contains current view.
     * @returns {Boolean|Object} true if view was rendered, this - otherwise
     */
    render: function (containerQuery) {
        var Tpl      = N13.ns(this.templateNs + '.' + this.template, false) || {};
        var dataProp = this.templateDataProp;
        var tplData;

        if (!N13.isString(dataProp) || dataProp === '') {
            this.trigger('error', 'Data property is invalid. Not empty string is required. See templateDataProp config for details. Class: "' + this.className + '"');
            return false;
        }
        //
        // elPath should be 'auto' or CSS Query
        //
        if (!this.elPath) {
            this.trigger('error', 'Element css path (elPath) is not set for class "' + this.className + '"');
            return false;
        }
        //
        // template can be null or valid class shortcut
        //
        if (!(this.template === null || N13.ns(this.templateNs + '.' + this.template, false))) {
            this.trigger('error', 'Invalid template in view: "' + this.className + '"');
            return false;
        }
        this._updateEl(containerQuery);
        //
        // this.el should points into the real DOM node
        //
        if (!this.el || !this.el.length) {
            this.trigger('error', 'Root element (View::el) not found for view "' + this.className + '"');
            return false;
        }

        this.trigger('beforerender', this);
        if (this.onBeforeRender(this.el) === false) {
            return this;
        }
        this.callParent(arguments);
        this.clear();
        tplData = Tpl[dataProp];
        if (tplData === '' || !N13.isString(tplData) || !N13.isObject(this[dataProp]) && this[dataProp] !== null) {
            this.trigger('error', 'Invalid template data in view: "' + this.className + '"');
            return false;
        }
        try {
            this.el.append(_.template(tplData, this[dataProp]));
        } catch (e) {
            this.trigger('error', 'Template data is invalid in view "' + this.className + '". Message: "' + e.message + '"');
            return false;
        }
        this._renderItems();
        this.rendered = true;
        this.onAfterRender(this.el);
        this.trigger('render', this);

        return this;
    },

    /**
     * Removes all DOM nodes of this view and all nested, but the instances are still available. This method
     * is called before render() and destroy() methods.
     */
    clear: function () {
        var items = this.items;
        var children;
        var i;
        var len;

        if (!this.rendered) {
            return;
        }

        this.trigger('beforeclear');
        if (this.onBeforeClear() === false) {
            return;
        }
        if (N13.isArray(items)) {
            for (i = 0, len = items.length; i < len; i++) {
                //
                // All nested views will be removed, but instances will be available
                //
                items[i].clear();
            }
        }
        this.el.off();
        children = this.el.children();
        children.off();
        children.remove();
        this.rendered = false;
        this.onAfterClear();
        this.trigger('clear');
    },

    /**
     * Calls before view will be destroyed. Destroys all nested views
     * first and after that destroys itself.
     */
    destroy: function () {
        var items = this.items;
        var i;
        var len;

        this.trigger('beforedestroy', this);
        if (this.onBeforeDestroy() === false) {
            return;
        }
        this.callMixin('observe');
        //
        // We should clear the DOM before we clears the instances
        //
        this.clear();
        if (N13.isArray(items)) {
            for (i = 0, len = items.length; i < len; i++) {
                items[i].destroy();
                delete items[i];
            }
        }
        //
        // We should un delegate view events, which were set in events property:
        // events: {
        //     ...
        // }
        // otherwise we'll get memory leaks and multiply events callings
        //
        this.undelegateEvents();
        this.onAfterDestroy();
        this.trigger('destroy');
    },


    /**
     * Renders all nested items if them weren't rendered before and contain autoRender === true.
     * @private
     */
    _renderItems: function () {
        var autoIdName = this.autoIncrementId;
        var id         = this._id;
        var items      = this.items;
        var containers;
        var innerId;
        var item;
        var i;
        var len;

        if (!N13.isArray(items) || items.length <= 0) {
            return;
        }
        containers = this.el.find('.' + this.containerCls);
        if (containers.length < items.length) {
            throw Error('Template of view "' + this.className + '" doesn\'t contain enough containers for nested views. Expected ' + items.length + '.');
        }
        for (i = 0, len = items.length; i < len; i++) {
            item = items[i];
            //
            // If nested view has auto generated value for id, we need to take current tag with class='innerContainer'
            // and set auto generated id to it. After that, we need to pass this new id to nested view.
            //
            innerId = (item.elPath === autoIdName ? id() : undefined);
            $(containers[i]).attr('id', innerId);
            item.render(innerId ? '#' + innerId : undefined);
        }
    },

    /**
     * Updates this.el and this.$el properties. It uses this.elPath property for that. It also, call delegateEvents()
     * from Backbone.View class to bind the events.
     * @param {String=} containerQuery DOM container's CSS query for current view
     * @private
     */
    _updateEl: function (containerQuery) {
        //
        // If container DOM element for current view wasn't created before constructor was called, then we should update
        // this.$el reference and binds all events.
        //
        if (!this.el || !this.el.length) {
            try {
                if (N13.isString(containerQuery)) {
                    this.$el = this.el = $(containerQuery);
                } else {
                    this.$el = this.el = $(this.elPath === this.autoIncrementId ? null : this.elPath);
                }
            } catch (e) {
                this.trigger('error', 'Invalid elPath CSS query for view "' + this.className + '". elPath: "' + this.elPath + '"');
            }
            //
            // If current element contains two or more tags, then it buggy and we must throw an error
            //
            if (this.el && this.el.length > 1) {
                this.trigger('error', 'Found duplicate ids for view "' + this.className + '"');
            }
            //
            //
            // this._initEvents shouldn't be declared in initPrivates(), because it calls
            // before initPrivates() method call
            //
            if (!this.el || !this.el.length) {
                this._initEvents = true;
            } else if (this._initEvents) {
                this.delegateEvents();
            }
        } else if (N13.isString(containerQuery)) {
            this.$el = this.el = $(containerQuery);
        }
    },

    /**
     * Creates sub views instances and stores them in this.items property. It also registers them in ClassManager.
     * @private
     */
    _createItems: function () {
        var items      = N13.isString(this.items) ? [this.items] : this.items;
        var ns         = N13.ns;
        var isString   = N13.isString;
        var isObject   = N13.isObject;
        var isFunction = N13.isFunction;
        var instances  = [];
        var viewNs     = this.viewNs;
        var View;
        var i;
        var len;
        var item;
        var view;

        //
        // Create an array of inner views instances without rendering
        //
        if (!N13.isArray(items)) {
            return;
        }
        for (i = 0, len = items.length; i < len; i++) {
            item = items[i];

            if (isString(item)) {
                View = ns(viewNs + '.' + item, false);
                if (!isFunction(View)) {
                    this.trigger('debug', 'Invalid nested view "' + item + '" of view "' + this.className + '". This view will be skipped.');
                    continue;
                }
                instances.push(view = new View());
            } else if (isObject(item)) {
                View = ns(viewNs + '.' + item.cl, false);
                if (!isFunction(View)) {
                    this.trigger('debug', 'Invalid nested view "' + item + '" of view "' + this.className + '". This view will be skipped.');
                    continue;
                }
                instances.push(view = new View(item));
            } else {
                this.trigger('debug', 'Invalid nested view "' + item + '" of view "' + this.className + '". This view will be skipped.');
            }
        }
        this.items = instances;
    },

    /**
     * Returns views wide unique id. Every new call of this method returns new unique id.
     * @return {String} Unique id
     */
    _id: function () {
        // TODO: should be rewritten with this.self. For now self property doesn't work properly
        return 'view-' + (++App.view.base.View._currentId);
    }
});
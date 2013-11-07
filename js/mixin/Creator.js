/**
 * It creates classes instances by its configurations. This mixin depends on
 * special configuration like this:
 *
 *     N13.define('App.Class', {
 *         mixins : {create: 'App.mixin.Creator'},
 *         configs: {
 *             create: [
 *                 'App.Class1',
 *                 {
 *                     cl : 'App.Class2',
 *                     cfg: 'value'
 *                 }
 *             ]
 *         },
 *         ...
 *         init: function () {
 *             this.callMixin('create');
 *         },
 *         ...
 *         onBeforeDestroy: function () {
 *             this.callMixin('create', 'destroy');
 *         }
 *     });
 *
 *     //
 *     // Instance of App.Class will be created.App.Class1 and
 *     // App.Class2 will be also created in App.Class constructor.
 *     //
 *     var cl = new App.Class();
 *     cl.getClass(0);             // App.Class1 instance
 *     cl.getClass(10);            // null
 *     cl.getClass('App.Class2');  // App.Class2 instance
 *     cl.getClass('App.Class3');  // null
 *
 * As you can see a configuration can be in two forms: Name of the class or it's
 * configuration. cl property in this case, must contain String name of the class.
 * In example above, i have showed a configuration for two classes, which will
 * be created during class creation (in constructor). You may use onBeforeRunClasses()
 * method to prevent running. This method may return false do stop this process.
 * All instances should be
 *
 * Dependencies:
 *
 *     - create config parameter
 *     - Backbone.Events object
 *
 * Available events:
 *
 *     error  Fires in case of error
 *
 * @author DeadbraiN
 */
N13.define('App.mixin.Creator', {
    /**
     * @interface
     * This method runs before classes instances will be created. You may ovirride this method
     * and prevent this creation by returning false.
     * @param {Array} classes Array of classes configurations
     */
    onBeforeCreateClasses: N13.emptyFn,

    /**
     * @interface
     * This method will be called after all instances from create configuration are created
     * @param {Array} classes Array of classes instances and not an array of configurations
     */
    onAfterCreateClasses: N13.emptyFn,

    /**
     * @constructor
     * Creates all classes, which were added to create config section.
     */
    init: function () {
        var i;
        var len;
        var instances;
        var classes  = this.create;
        var isString = N13.isString;
        var ns       = N13.ns;

        //
        // If this class doesn't contain Backbone.Events logic, then add it
        //
        if (!N13.isFunction(this.trigger)) {
            _.extend(this, Backbone.Events);
        }
        if (!N13.isArray(classes)) {
            this.trigger('error', 'Invalid create configuration in App.mixin.Creator::init() method. Array is required.');
            return;
        }
        if (this.onBeforeCreateClasses(classes) === false) {
            return;
        }

        /**
         * {Array} Array of instances
         * @private
         */
        instances = this._classes = [];

        for (i = 0, len = classes.length; i < len; i++) {
            instances.push(isString(classes[i]) ? new (ns(classes[i], false))() : new (ns(classes[i].cl, false))(classes[i]));
        }
        this.onAfterCreateClasses(instances);
    },

    /**
     * Destroys all class instances, which were added in create configuration
     */
    destroy: function () {
        var i;
        var len;
        var classes    = this._classes;
        var isFunction = N13.isFunction;
        var cl;

        for (i = 0, len = classes.length; i < len; i++) {
            cl = classes[i];
            if (isFunction(cl.destroy)) {
                cl.destroy();
            }
            delete classes[i];
        }
    },

    /**
     * Returns class instance or null if not found
     * @param {String|Number} id Class name of index
     * @return {Object} an instance or null
     */
    getClass: function (id) {
        if (N13.isString(id)) {
            return _.find(this._classes, function (v) {return v.className === id;}) || null;
        } else if (_.isNumber(id)) {
            return this._classes[id];
        }

        return null;
    }
});
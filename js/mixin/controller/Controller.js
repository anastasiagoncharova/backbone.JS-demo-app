/**
 * This mixin is created only for App.controller.base.Controller class. It adds
 * sub controllers related logic into the controller. So, after that you may control
 * nested controllers too. It depends on some configuration:
 *
 *     controllerNs {String} Prefix namespace for all controllers. This prefix + alias will produce full namespace for specified
 *                  class. For example: controllerNs + '.' + 'module.MyController' -> 'App.controller.module.MyController'.
 *                  Default value is 'App.controller'.
 *
 *     controllers  {Array|String} Nested controllers aliases or configurations. e.g.: ['Controller'] or
 *                  [{cl: 'Controller', cfg: 123}] or 'Controller'. Default value is []
 *
 * Events:
 *
 *     error Fires in case of some error
 *
 * Usage:
 *
 *     N13.define('App.controller.MyController', {
 *         extend : 'App.controller.base.Controller',
 *         mixins : {ctrl: 'App.mixin.controller.Controller'},
 *         configs: {
 *             controllerNS: 'App.controller',
 *             controllers : ['NestedController1', 'NestedController2']
 *         }
 *     });
 *
 *     var ctrl    = new App.controller.MyController(...);
 *     var subView = ctrl.findController('NestedController1');
 *
 * @author DeadbraiN
 */
N13.define('App.mixin.controller.Controller', {
    configs : {
        /**
         * {String} Prefix namespace for all controllers. This prefix + alias will produce
         * full namespace for specified class. For example:
         * controllerNs + '.' + 'module.MyController' -> 'App.controller.module.MyController'.
         */
        controllerNs: 'App.controller'
    },


    /**
     * @constructor
     * Creates sub controllers instances from it's configurations or class names. This method
     * uses controllers configuration parameter to do this.
     */
    init: function () {
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
                this.trigger('error', 'Invalid nested controller "' + ctrl + '" of controller "' + this.className + '". This controller will be skipped.');
            }
        }
        this.controllers = instances;
    },

    /**
     * Returns controller instance or null if not found by index or class name
     * @param {String|Number} id Class alias or index
     * @return {Object} an instance or null
     */
    findController: function (id) {
        var nsLen = this.controllerNs.length + 1;

        if (N13.isString(id)) {
            return _.find(this.controllers, function (v) {return v.className.substr(nsLen) === id;}) || null;
        } else if (_.isNumber(id)) {
            return this.controllers[id];
        }

        return null;
    },

    /**
     * Runs all sub controllers if exist.
     * @private
     */
    runControllers: function () {
        var i;
        var len;
        var controllers = this.controllers;

        for (i = 0, len = controllers.length; i < len; i++) {
            controllers[i].run();
        }
    },

    /**
     * Destroys sub controllers related logic in controller. Can be used as a destructor.
     */
    destroy: function () {
        var i;
        var controllers = this.controllers;
        var len         = controllers.length;

        for (i = 0; i < len; i++) {
            controllers[i].destroy();
        }
        this.controllers = null;
    }
});
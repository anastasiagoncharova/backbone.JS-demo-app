/**
 * This mixin is created only for App.controller.base.Controller class. It adds
 * sub controllers related logic into the controller. So, after that, you may control
 * nested controllers. To setup nested controllers you should use controllers config.
 *
 * Events:
 *     error Fires in case of some error
 *         {String} Error description
 *
 * Usage:
 *     N13.define('App.controller.MyController', {
 *         extend  : 'App.controller.base.Controller',
 *         requires: ['App.view.MainView', 'App.controller.MyController'],
 *         mixins  : {ctrl: 'App.mixin.controller.Controller', view: 'App.mixin.controller.View'},
 *         configs : {
 *             controllers: ['NestedController'],
 *             view       : 'MainView'
 *         }
 *     });
 *
 *     var ctrl    = new App.controller.MyController(...);
 *     var subCtrl = ctrl.findController('NestedController');
 *
 *     subCtrl.setConfig({view: this.findView('')});
 *     ctrl.run();
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
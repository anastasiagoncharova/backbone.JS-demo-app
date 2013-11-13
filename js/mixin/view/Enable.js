/**
 * Appends enable and disable logic for views (App.view.base.View). This mixin was created only for views classes. It
 * doesn't work with other classes, because it uses view's public interface and internal logic. Enable and disable
 * means adding special disable styles and properties for html tag of current view starting from root node. Enabling
 * and disabling works only for rendered views. Before enabling and disabling it fires specified events (beforeenable,
 * beforedisable) and calls onBeforeEnable() and onBeforeDisable() methods. You may override these
 * methods and if they returns false, the it prevents enabling or disabling. After enable/disable it fires enable and
 * disable events and calls onAfterEnable() and onAfterDisable() methods.
 * This mixin should be used in case if your view is inherited from App.view.base.View and it need to be enabled
 * and disabled. For this, you need to add it in your class (not in base view) in mixins section.
 *
 * Available events:
 *
 *     beforeenable  Fires before enable view
 *     enable        Fires after view enable
 *     beforedisable Fires before disable view
 *     disable       Fires after view disable
 *
 * Usage:
 *
 *     N13.define('App.view.MyView', {
 *         extend: 'App.view.base.View',
 *         mixins: {enable: 'App.mixin.view.Enable'},
 *         ...
 *     });
 *
 *     var view = new App.view.MyView();
 *     view.render('.container');
 *     view.disable();
 *     view.enable();
 *
 * @author DeadbraiN
 */
N13.define('App.mixin.view.Enable', {
    /**
     * @interface
     * Calls before disable() method will be called.
     * @returns {undefined|Boolean} false means, that disabling will be stopped, all other values will approve disable.
     */
    onBeforeDisable: N13.emptyFn,
    /**
     * @interface
     * Calls after disable() method will be called.
     */
    onAfterDisable : N13.emptyFn,
    /**
     * @interface
     * Calls before enable() method will be called.
     * @returns {undefined|Boolean} false means, that enabling will be stopped, all other values will approve disable.
     */
    onBeforeEnable : N13.emptyFn,
    /**
     * @interface
     * Calls after enable() method will be called.
     */
    onAfterEnable  : N13.emptyFn,


    /**
     * Enables current and all nested views.
     */
    enable: function () {
        var items = this.items;
        var i;
        var len;

        if (!this.rendered) {
            return;
        }

        this.trigger('beforeenable');
        if (this.onBeforeEnable() === false) {
            return;
        }
        if (N13.isArray(items)) {
            for (i = 0, len = items.length; i < len; i++) {
                items[i].enable();
            }
        }
        this.onAfterEnable();
        this.trigger('enable');
    },

    /**
     * Disables current and all nested views. It also adds 'disabled' class for all nested views.
     */
    disable: function () {
        var items = this.items;
        var i;
        var len;

        if (!this.rendered) {
            return;
        }

        this.trigger('beforedisable');
        if (this.onBeforeDisable() === false) {
            return;
        }
        if (N13.isArray(items)) {
            for (i = 0, len = items.length; i < len; i++) {
                items[i].disable();
            }
        }
        this.onAfterDisable();
        this.trigger('disable');
    }
});
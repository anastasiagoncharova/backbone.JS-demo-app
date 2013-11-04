/**
 * Observer, based on Backbone.Events object. Adds an ability of listening events in class. This class requires a
 * default 'listen' config. See example for details. It should be used in case, then you need to catch an events
 * during class instantiating. Using simple view.on() method you can't track events, which triggers during
 * instantiating.
 *
 * Dependencies:
 *     Backbone.Events
 *
 * Example:
 *
 *     N13.define('App.Class', {
 *         mixins : {observe: 'App.mixin.Observer'},
 *         configs: {
 *             listen: {}
 *         }
 *     });
 *
 *     var cl = new App.Class({
 *         listen:  {
 *             event1: N13.emptyFn,                      // This function will be called if event1 will be fired
 *             event2: {fn: N13.emptyFn, scope: Window}  // This function will be called if event2 will be fired
 *         }
 *     });
 *
 * @author DeadbraiN
 * @email tmptrash@mail.ru
 */
N13.define('App.mixin.Observer', {
    /**
     * Mixin constructor
     */
    init: function () {
        var listen = this.listen || {};
        var listener;
        var i;

        for (i in listen) {
            if (listen.hasOwnProperty(i)) {
                listener = listen[i];
                this.on(i, N13.isFunction(listener) ? listener : listener.fn, listener.scope);
            }
        }
    }
});
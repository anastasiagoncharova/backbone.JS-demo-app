/**
 * Observer, based on Backbone.Events object. Adds an ability of listening events in class. This class requires a
 * default 'listeners' config. See example for details. It should be used in case, then you need to catch an events
 * during class instantiating. Using simple view.on() method you can't track events, which triggers during
 * instantiating. It also provides a listen() method, which can add event handlers for any Backbone.Events based
 * object. It's used for auto detach from all events. For this, you should call destroy() method.
 *
 * Dependencies:
 *     Backbone.Events
 *
 * Example:
 *
 *     N13.define('App.Class', {
 *         mixins : {observe: 'App.mixin.Observer'},
 *         configs: {
 *             listeners: {}
 *         }
 *     });
 *
 *     var cl = new App.Class({
 *         listeners:  {
 *             event1: N13.emptyFn,                      // This function will be called if event1 will be fired
 *             event2: {fn: N13.emptyFn, scope: Window}  // This function will be called if event2 will be fired
 *         }
 *     });
 *     ...
 *     cl.destroy();                                     // Unbinds from all event handlers
 *
 * @author DeadbraiN
 */
N13.define('App.mixin.Observer', {
    /**
     * Mixin constructor
     */
    init: function () {
        var listeners = this.listeners || {};
        var listener;
        var i;

        /**
         * {Array} List of the objects, which has an event handlers
         * @private
         */
        this._listeners = [];

        for (i in listeners) {
            if (listeners.hasOwnProperty(i)) {
                listener = listeners[i];
                this.listen(this, i, N13.isFunction(listener) ? listener : listener.fn, listener.scope);
            }
        }
    },

    /**
     * Add event listener for specified object. All these listeners will be
     * automatically removed on instance destroy
     * @param {Object} obj Object to listen
     * @param {String} event Name of the event
     * @param {Function} fn Callback function
     * @param {Object|null=} scope Scope of the callback
     */
    listen: function (obj, event, fn, scope) {
        if (!N13.isFunction(obj.on)) {
            console.error('Invalid object for listening with listen() method. Event name: ' + event);
            return;
        }

        if (this._listeners.indexOf(obj) === -1) {
            this._listeners.push(obj);
        }
        obj.on(event, fn, scope);
    },

    /**
     * Clears all listeners, which were added by listen() method. This method may
     * be called in destructor or in some object reset logic.
     */
    destroy: function () {
        var i;
        var len;
        var listeners = this._listeners;

        for (i = 0, len = listeners; i < len; i++) {
            listeners[i].stopListening();
            listeners[i].off();
        }

        //
        // If this class has used listenTo() calls, then stopListening() will remove
        // all handlers. off() will remove all handlers binded by on() method.
        //
        this.stopListening();
        this.off();
    }
});
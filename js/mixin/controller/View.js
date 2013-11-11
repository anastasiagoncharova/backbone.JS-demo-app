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
 *
 * Usage:
 *
 *
 * @author DeadbraiN
 */
N13.define('App.mixin.controller.View', {

});
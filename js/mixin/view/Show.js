/**
 * Appends show and hide logic for views (App.view.base.View). This mixin was created only for views classes. It
 * doesn't work with other classes, because it uses view's public interface and internal logic. Show and hide
 * means showing and hiding all html tags for current view starting from root node. It uses CSS display property
 * for that. Showing and hiding works only for rendered views. Before showing and hiding it fires specified
 * events (beforeshow, beforehide) and calls onBeforeShow() and onBeforeHide() methods. You may override these
 * methods and if they returns false, the it prevents showing or hiding. After show/hide it fires show and hide
 * events and calls onAfterShow() and onAfterHide() methods.
 * This mixin should be used in case if your view is inherited from App.view.base.View and it need to be showed
 * and hided. For this, you need to add it in your class (not in base view) in mixins section.
 *
 * Available events:
 *
 *     beforeshow    Fires before showing view
 *     show          Fires after view shows
 *     beforehide    Fires before hiding view
 *     hide          Fires after view hide
 *
 * Usage:
 *
 *     N13.define('App.view.MyView', {
 *         extend: 'App.view.base.View',
 *         mixins: {show: 'App.mixin.view.Show'},
 *         ...
 *     });
 *
 *     var view = new App.view.MyView();
 *     view.render('.container');
 *     view.hide();
 *     view.show();
 *
 * @author DeadbraiN
 */
N13.define('App.mixin.view.Show', {
    /**
     * @interface
     * Calls before show method will be called. Can be used for special preparation before view will be shown.
     * @returns {undefined|Boolean} false means, that showing will be stopped, all other values will approve show.
     */
    onBeforeShow: N13.emptyFn,
    /**
     * @interface
     * Calls after show() method will be called.
     */
    onAfterShow : N13.emptyFn,
    /**
     * @interface
     * Calls before hide() method will be called. Can be used for special preparation before view will be hidden.
     * @returns {undefined|Boolean} false means, that hiding will be stopped, all other values will approve hide.
     */
    onBeforeHide: N13.emptyFn,
    /**
     * @interface
     * Calls after hide() method will be called.
     */
    onAfterHide : N13.emptyFn,


    /**
     * Shows current and all nested views. It uses display: xxx css property for that.
     * show() method will be called for all nested views also.
     * @return {Boolean} true If current view was showed, false - otherwice
     */
    show: function () {
        var items = this.items;
        var i;
        var len;

        if (!this.rendered) {
            this.trigger('debug', 'show() method was called, but view "' + this.className + '" has not rendered yet.');
            return false;
        }

        this.trigger('beforeshow');
        if (this.onBeforeShow() === false) {
            this.trigger('debug', 'Showing of view "' + this.className + '" was stopped, because onBeforeShow() method has returned false');
            return false;
        }
        if (N13.isArray(items)) {
            for (i = 0, len = items.length; i < len; i++) {
                items[i].show();
            }
        }
        this.el.css('display', 'block');
        this.onAfterShow();
        this.trigger('show');

        return true;
    },

    /**
     * Hides current and all nested views. It uses display: none; css property for that.
     * @return {Boolean} true If current view was showed, false - otherwice
     */
    hide: function () {
        var items = this.items;
        var i;
        var len;

        if (!this.rendered) {
            this.trigger('debug', 'hide() method was called, but view "' + this.className + '" has not rendered yet.');
            return false;
        }

        this.trigger('beforehide');
        if (this.onBeforeHide() === false) {
            this.trigger('debug', 'Hiding of view "' + this.className + '" was stopped, because onBeforeHide() method has returned false');
            return false;
        }
        if (N13.isArray(items)) {
            for (i = 0, len = items.length; i < len; i++) {
                items[i].hide();
            }
        }
        this.el.css('display', 'none');
        this.onAfterHide();
        this.trigger('hide');

        return true;
    }
});
/**
 * This mixin provides standard interface for all classes which have private and public fields. Main
 * idea is in assembling all properties in one place - special functions: initPrivates() and initPublics()
 *
 * @author DeadbraiN
 */
N13.define('App.mixin.Interface', {
    /**
     * Call all initialization methods
     */
    init: function () {
        this.beforeInit();
        this.initPrivates();
        this.initPublics();
        this.afterInit();
    },

    /**
     * @interface
     * Override this method if you want add some pre logic. This method will be called before initPrivates()
     */
    beforeInit: N13.emptyFn,
    /**
     * @interface
     * Override this method if you have private fields in your child class. You should create and init private fields
     * in this method.
     */
    initPrivates: N13.emptyFn,
    /**
     * @interface
     * Override this method if you have public fields in your child class. You should create and init public fields
     * in this method. E.g.: this.items.
     */
    initPublics: N13.emptyFn,
    /**
     * @interface
     * Override this method if you want add event handlers or make some post initialization. It calls initPrivates()
     * and initPublics() methods
     */
    afterInit: N13.emptyFn
});
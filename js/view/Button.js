/**
 * Button abstraction
 *
 * Available events:
 *
 *     click   Fires then user clicks on button
 *
 * @author DeadbraiN
 */
N13.define('App.view.Button', {
    extend  : 'App.view.base.View',
    requires: ['App.template.Button'],
    configs : {
        /**
         * @config
         * {String|Boolean} Name of the template class for current view or false if current class doesn't use template
         */
        template: 'Button',
        /**
         * @config
         * {String} Title of button
         */
        title   : ''
    },

    /**
     * Calls before render() call. Sets title of the button
     */
    onBeforeRender: function () {
        this.callParent();
        this.setConfig({data: {title: this.title}});
    },

    /**
     * Calls after render() method. Here all DOM model have already
     * rendered and we may bind event handlers to them.
     */
    onAfterRender: function () {
        var me = this;

        me.el.on('click', function () {
            me.trigger('click', me);
        });
        me.callParent();
    }
});
/**
 * One audio track data container. Keeps track URL only.
 *
 * @author DeadbraiN
 */
N13.define('App.model.player.Track', {
    extend  : 'Backbone.Model',
    defaults: {
        url: null
    }
});
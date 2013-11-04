/**
 * Audio tracks collection. Keeps available for listening tracks.
 * Used in audio playlists.
 *
 * @author DeadbraiN
 */
N13.define('App.collection.player.Track', {
    extend  : 'Backbone.Collection',
    requires: ['App.model.player.Track'],

    /**
     * @constructor
     * Initializes model of current collection. We should do it
     * here because of model dependency issue.
     */
    init: function () {
        this.model = App.model.player.Track;
        this.callParent(arguments);
    }
});
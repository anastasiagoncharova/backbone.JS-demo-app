/**
 * Controls playlist and add track button components. It's possible to use this controller outside,
 * of audio player. For example: for video player. So we should have separate controller for these
 * views.
 *
 * @author DeadbraiN
 */
N13.define('App.controller.player.Playlist', {
    extend : 'App.controller.base.Controller',
    mixins : {view: 'App.mixin.controller.View'},
    configs: {
        /**
         * {App.collection.player.Track|null} Collection of tracks for playlist
         */
        tracks: null
    },


    /**
     * Adds event handlers for playlist and add button components.
     */
    onAfterRun: function () {
        this.listen(this.findView('Button'), 'click', this._onAddTrackClick, this);
    },

    /**
     * Add track button click handler. Shows input window, gets user url and
     * adds new track to the collection. So, the playlist will be updated automatically..
     * @private
     */
    _onAddTrackClick: function () {
        var url = prompt('Please input a track URL:');
        if (N13.isString(url) && url !== '' && this.tracks) {
            this.tracks.add({url: url});
        }
    }
});
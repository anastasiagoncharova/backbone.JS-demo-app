/**
 * Controls playlist and add track button components. It's possible to use this controller outside,
 * of audio player. For example: for video player. So we should have separate controller for these
 * views.
 *
 * @author DeadbraiN
 */
N13.define('App.controller.player.Playlist', {
    extend : 'App.controller.base.Controller',
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
        this.findView('player.PlaylistContainer > Button').on('click', this._onAddTrackClick, this);

        //
        // We need to set tracks collection to the playlist grid and render
        // main container after that. So, tracks collection will be used in rendering.
        //
        this.findView('player.PlaylistContainer > player.PlaylistGrid').setTracks(this.tracks);
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
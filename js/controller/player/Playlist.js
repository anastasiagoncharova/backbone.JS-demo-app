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
         * {String} Prefix namespace of the view, according to the view folder. For
         * example: 'App.view'. Should be set without dot at the end. Should be
         * 'App.view' by default.
         */
        viewNs: 'App.view',
        /**
         * {String|Object|Backbone.View} The name of the view or configuration
         * object, which will be controlled by this controller. e.g.:
         * 'libraryNavigator.View' or {cl: 'libraryNavigator.View', title: 'Yahoo!'}.
         * Should be null by default
         */
        view  : null,
        /**
         * {Boolean} true means that, this controller may control specified view,
         * but it can't create or destroy it. false - means that current controller
         * should create view and destroy it later.
         */
        noView: true,
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
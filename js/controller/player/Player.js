/**
 * Controls audio player module generally. It tracks playing and selecting tracks.
 * Main idea here, is to track all nested views also. It should create and render main view
 * and all nested views. It also should bind all handlers to appropriate views, models
 * and collections events. It uses one nested controller - player.Playlist.
 *
 * @author DeadbraiN
 */
N13.define('App.controller.player.Player', {
    extend  : 'App.controller.base.Controller',
    mixins  : {
        ctrl: 'App.mixin.controller.Controller',
        view: 'App.mixin.controller.View'
    },
    requires: [
        'App.collection.player.Track',
        'App.Config',
        'App.controller.player.Playlist'
    ],
    configs : {
        /**
         * {Array} Array of nested controllers
         */
        controllers : ['player.Playlist']
    },

    /**
     * Here we should create all private fields of this class.
     * Undefined fields should be set to null (not undefined).
     */
    initPrivates: function () {
        this.callParent();

        /**
         * {App.collection.player.Track} Collection of tracks, which player can play.
         * The collection should be created here, in controller, because it will be shared
         * between different modules.
         * @private
         */
        this._tracks       = new App.collection.player.Track([{url: App.Config.player.defaultTrack}]);
        /**
         * {null|App.view.player.ControlPanel} Reference to the ControlPanel view. We need it
         * for running of selected tracks and tracking when the track is ended.
         * @private
         */
        this._controlPanel = null;
        /**
         * {App.view.player.PlaylistGrid} Reference to the playlist grid
         * @private
         */
        this._playlistGrid = null;
    },

    /**
     * This is how we can set a lazy configuration for nested controller. It should
     * know about tracks collection nd it's main view. So tracks collection shares
     * between these two controllers, but the owner is Player (parent controller).
     */
    onAfterInit: function () {
        this.findController('player.Playlist').setConfig({
            tracks: this._tracks,
            view  : this.findView('player.PlaylistContainer')
        });
    },

    /**
     * After binding all event handlers and after creation of all nested
     * controllers we should render main view
     */
    onAfterRun: function () {
        (this._playlistGrid = this.findView('player.PlaylistGrid')).on('selected', this._onTrackSelect, this);
        (this._controlPanel = this.findView('player.ControlPanel')).on('played', this._onTrackPlayed, this);

        //
        // We need to set tracks collection to the playlist grid and render
        // main container after that. So, tracks collection will be used in rendering.
        //
        this._playlistGrid.setConfig({tracks: this._tracks});
        this.findView('player.Container').render();
        this.runControllers();
    },

    /**
     * 'selected' event handler. Get active Track model and run this track by ControlPanel view.
     * @param {App.model.player.Track} sel Selected Track model
     * @private
     */
    _onTrackSelect: function (sel) {
        this._controlPanel.play(sel.get('url'));
    },

    /**
     * 'played' event handler. Play next track in the playlist
     * @private
     */
    _onTrackPlayed: function () {
        this._playlistGrid.select(true);
    }
});
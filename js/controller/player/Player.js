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
         * {String} Prefix namespace for all controllers. This prefix + alias will produce
         * full namespace for specified class. For example:
         * controllerNs + '.' + 'module.MyController' -> 'App.controller.module.MyController'.
         */
        controllerNs: 'App.controller',
        /**
         * {Array} Array of nested controllers
         */
        controllers : ['player.Playlist'],
        /**
         * {String} Prefix namespace of the view, according to the view folder. For
         * example: 'App.view'. Should be set without dot at the end. Should be
         * 'App.view' by default.
         */
        viewNs      : 'App.view',
        /**
         * {String|Object|Backbone.View} The name of the view or configuration
         * object, which will be controlled by this controller. e.g.:
         * 'libraryNavigator.View' or {cl: 'libraryNavigator.View', title: 'Yahoo!'}.
         * Should be null by default
         */
        view        : null
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
        /**
         * {null|Number} Last selected row index or null if no selection
         * @private
         */
        this._curRow       = null;
    },

    /**
     * This is how we can set a lazy configuration for nested controller. It should
     * know about tracks collection nd it's main view. So tracks collection shares
     * between these two controllers, but the owner is Player (parent controller).
     */
    onAfterInit: function () {
        this.findController('player.Playlist').setConfig({
            tracks: this._tracks,
            view  : this.findView('player.Container > player.PlaylistContainer')
        });
    },

    /**
     * After binding all event handlers and after creation of all nested
     * controllers we should render main view
     */
    onAfterRun: function () {
        (this._playlistGrid = this.findView('player.Container > player.PlaylistContainer > player.PlaylistGrid')).on('selected', this._onTrackSelect, this);
        (this._controlPanel = this.findView('player.Container > player.ControlPanel')).on('played', this._onTrackPlayed, this);

        this.runControllers();
        this.findView('player.Container').render();
    },

    /**
     * 'selected' event handler. Get active Track model and run this track by ControlPanel view.
     * @param {App.model.player.Track} sel Selected Track model
     * @param {Number} row Clicked row index
     * @private
     */
    _onTrackSelect: function (sel, row) {
        this._curRow = row;
        this._controlPanel.play(sel.get('url'));
    },

    /**
     * 'played' event handler. Play next track in the playlist
     * @private
     */
    _onTrackPlayed: function () {
        this._playlistGrid.select(++this._curRow);
    }
});
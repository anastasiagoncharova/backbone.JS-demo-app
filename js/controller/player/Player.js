/**
 * Controls audio player module generally. It tracks adding, removing and selecting tracks.
 * Main idea here, is to track all nested views also. It should create and render main view
 * and all nested views also. It also should bind all handlers to appropriate views, models
 * and collections events.
 *
 * @author DeadbraiN
 */
N13.define('App.controller.player.Player', {
    extend  : 'App.controller.base.Controller',
    requires: [
        'App.collection.player.Track',
        'App.Config'
    ],

    /**
     * Here we should create all private fields of this class.
     * Undefined fields should be set to null.
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
         * {null|Number} Last selected row index
         * @private
         */
        this._curRow       = null;
    },

    /**
     * Entry point of the controller. It runs the controller and renders the main and all nested views.
     * It also binds all handlers to the events.
     */
    run: function () {
        var view      = this.findView('player.Container');
        var addButton = this.findView('player.Container > player.PlaylistContainer > Button');

        this._playlistGrid = this.findView('player.Container > player.PlaylistContainer > player.PlaylistGrid');
        this._controlPanel = this.findView('player.Container > player.ControlPanel');

        addButton.on('click', this._onAddTrackClick, this);
        this._controlPanel.on('played', this._onTrackPlayed, this);
        this._playlistGrid.on('selected', this._onTrackSelect, this);

        //
        // We need to set tracks collection to the playlist grid and render
        // main container after that. So, tracks collection will be used in rendering.
        //
        this._playlistGrid.setTracks(this._tracks);
        view.render();
    },

    /**
     * Add track button click handler. Shows input window, gets user url and
     * adds new track to the collection. So, the playlist will be updated automatically..
     * @private
     */
    _onAddTrackClick: function () {
        var url = prompt('Please input a track URL:');
        if (N13.isString(url) && url !== '') {
            this._tracks.add({url: url});
        }
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
/**
 * Playlist grid. contains a list of URLs of tracks to play
 *
 * Available events:
 *     selected   Fires then one row in grid is selected
 *
 * @author DeadbraiN
 */
N13.define('App.view.player.PlaylistGrid', {
    extend  : 'App.view.base.View',
    requires: ['App.template.player.PlaylistGrid'],
    configs : {
        /**
         * {String|Boolean} Name of the template class for current view or false if current class doesn't use template
         */
        template: 'player.PlaylistGrid',
        /**
         * {String} Name of the collection, which contains tracks for playlist
         */
        tracks  : null
    },


    /**
     * Private fields creator and initializer
     */
    initPrivates: function () {
        this.callParent();

        /**
         * {Element|null} Current(selected) row
         * @private
         */
        this._curRowEl = null;
        /**
         * {Number} Current(selected) row index
         * @private
         */
        this._curRow   = null;
    },

    /**
     * Calls before render() method for pre render actions. It sets
     * a tracks collection to the template.
     */
    onBeforeRender: function () {
        this.callParent();

        if (!this.tracks) {
            console.log('Tracks collection wasn\'t set for playlist');
            return;
        }

        this.setConfig({data: {tracks: this.tracks.toJSON()}});
    },

    /**
     * Calls after render() method for post render actions. It binds click event
     * handlers to the table rows.
     */
    onAfterRender: function () {
        var me = this;

        this.listen(this.el.find('tr'), 'click', function () {me._onRowClick.apply(me, arguments);});
        if (this.tracks) {
            this.listen(this.tracks, 'add',    function () {me.render();});
            this.listen(this.tracks, 'remove', function () {me.render();});
        }
        if ($.isNumeric(this._curRow)) {
            this.select(this._curRow);
        }

        this.callParent();
    },

    /**
     * Selects specified track by it's row index
     * @param {Number|Boolean} row Row index
     */
    select: function (row) {
        $('.playlist-grid tr[row="' + ($.isNumeric(row) ? row : this._curRow + 1) + '"] td[col="0"]').click();
    },


    /**
     * Table row click event handler. Adds selection css style to the clicked row
     * @param {Event} e Event object
     * @private
     */
    _onRowClick: function (e) {
        var col;

        if (this._curRowEl) {
            this._curRowEl.removeClass('selected');
        }
        this._curRowEl = $(e.currentTarget);
        if (e.target.nodeName.toUpperCase() === 'TD') {
            col = +$(e.target).attr('col');
            this._curRow = +this._curRowEl.attr('row');

            if (col === 0) {
                this._curRowEl.addClass('selected');
                this.trigger('selected', this.tracks.at(this._curRow));
            } else if (col === 1) {
                this._curRowEl = null;
                this.tracks.remove(this.tracks.at(this._curRow));
            }
        }
    }
});
/**
 * Audio player control panel view. It represents a clickable player area, that can set an audio track and play it.
 * It contains play/pause button, rewind area and voice control. It's based on HTML5 <audio> tag. Autoplay option
 * is always turned on.
 *
 *
 * Available events:
 *
 *     played - fires if current track finishes playing.
 *
 * @author DeadbraiN
 */
N13.define('App.view.player.ControlPanel', {
    extend  : 'App.view.base.View',
    requires: ['App.template.player.ControlPanel'],
    configs : {
        template: 'player.ControlPanel'
    },


    /**
     * Private fields creator and initializer
     */
    initPrivates: function () {
        this.callParent();

        /**
         * {Element|null} Reference to the <audio> tag in DOM
         * @private
         */
        this._audioEl  = null;
    },

    /**
     * Calls after render() method for post render actions
     */
    onAfterRender: function () {
        var me = this;

        //
        // We should update audio element every time after rendering
        //
        this._audioEl = this.el.find('audio');
        //
        // We should update event handler every time after rendering. Unbinding will be called in destroy() method.
        //
        this._audioEl.on('ended', function () {me._onPlayEnd();});
    },

    /**
     * Plays current track
     * @param {String} trackUrl URL of the track
     */
    play: function (trackUrl) {
        if (!N13.isString(trackUrl) || trackUrl === '') {
            console.error('Invalid track URL: ' + trackUrl + '. Audio file URL is expected.');
            return;
        }
        if (!this._audioEl) {
            console.error('You should call setTrack() before call play()');
        }

        if (this._audioEl.attr('src') !== trackUrl) {
            this._audioEl.attr('src', trackUrl);
        }
    },


    /**
     * <audio> tag 'ended' event handler. Fires an played event.
     * @private
     */
    _onPlayEnd: function () {
        this.trigger('played');
    }
});
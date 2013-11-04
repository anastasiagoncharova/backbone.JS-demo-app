/**
 * Template for main audio player container. Contains two placeholders for
 * inner views. Upper is used for control panel, downer is used for playlist.
 *
 * @author DeadbraiN
 */
N13.define('App.template.player.Container', {
    statics: {
        data: '' +
            '<div class="player-container">' +
                '<div class="innerContainer"></div>' +
                '<div class="innerContainer"></div>' +
            '</div>'
    }
});
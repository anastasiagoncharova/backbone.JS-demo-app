/**
 * Main audio player container. Simply container for control
 * panel and playlist container. Has no logic...
 *
 * @author DeadbraiN
 */
N13.define('App.view.player.Container', {
    extend  : 'App.view.base.View',
    requires: [
        'App.template.player.Container',
        'App.view.player.ControlPanel',
        'App.view.player.PlaylistContainer'
    ],
    configs : {
        template  : 'player.Container',
        items     : [
            'player.ControlPanel',
            'player.PlaylistContainer'
        ]
    }
});
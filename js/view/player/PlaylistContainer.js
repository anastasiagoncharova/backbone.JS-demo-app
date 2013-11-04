/**
 * Container for playlist and "add track" button.
 *
 * @author DeadbraiN
 */
N13.define('App.view.player.PlaylistContainer', {
    extend  : 'App.view.base.View',
    requires: [
        'App.template.player.PlaylistContainer',
        'App.view.player.PlaylistGrid',
        'App.view.Button'
    ],
    configs : {
        template: 'player.PlaylistContainer',
        items   : [
            'player.PlaylistGrid', {
            cl              : 'Button',
            title           : 'Add'
        }]
    }
});
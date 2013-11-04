/**
 * @singleton
 * Application class. Creates global objects and runs an application. run() method
 * is calling then html document will be ready to proceed. It Creates main controller
 * and run it. It's all that this class does. So, after that, all responsibility will
 * be on this controller.
 *
 * @author DeadbraiN
 */
N13.define('App.Application', {
    extend  : 'App.base.App',
    requires: ['App.view.player.Container', 'App.controller.player.Player'],

    /**
     * This is where an application starts and our html document is loaded and ready.
     * Here, we create main controller and run it. All other logic will be managed
     * inside this controller. This method will be called then all html document
     * will be ready to proceed.
     */
    run: function () {
        var playerCtrl = new App.controller.player.Player({
            view: {cl: 'player.Container', elPath: '.main-container'}
        });

        playerCtrl.run();
    }
});
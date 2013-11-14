/*global App */

AsyncTestCase("view.base.View", {
    /**
     * This function calls every time before test starts and creates empty container for current view
     */
    setUp: function () {
        //
        // {jQuery} We should create temporary placeholder for views on current document
        //
        $('body').append('<div id="viewContainer"></div>');
        this.ct = $('#viewContainer');
    },

    /**
     * This function calls after test will complete and removes containers children
     */
    tearDown: function () {
        $('body').children().remove();
    },

    /*
     * Tests base view creation
     */
    testViewCreation: function () {
        var view = new App.view.base.View();

        assertObject('base.View has created', view);
        view.destroy();
    },

    /*
     * Tests base view template related logic
     */
    testEmptyTemplateConfig: function () {
        var view = new App.view.base.View();

        view.render();
        assertTrue('View\'s DOM shouldn\'t be created', this.ct.children().length === 0);
        view.destroy();
    },

    /*
     * Tests normal existing template in configuration, but without elPath config
     */
    testNormalTemplateConfigWithoutElPath: function () {
        var view = new App.view.base.View({template: 'player.Container'});

        view.render();
        assertTrue('View\'s DOM shouldn\'t be created', this.ct.children().length === 0);
        view.destroy();
    },

    /*
     * Tests normal existing template in configuration, but no data
     */
    testNormalTemplateConfigWithElPath1: function () {
        var view = new App.view.base.View({template: 'player.Container', elPath: '#viewContainer'});

        view.render();
        assertTrue('View\'s DOM shouldn\'t be created', this.ct.children().length > 0);
        view.destroy();
    },

    /*
     * Tests normal existing template in configuration, but correct data
     */
    testNormalTemplateConfigWithElPath2: function () {
        var view = new App.view.base.View({template: 'Button', elPath: '#viewContainer'});

        view.setConfig({data: {title: 'Test'}});
        view.render();
        assertTrue('View\'s DOM should be created', this.ct.children().length > 0);
        view.destroy();
    },

    /*
     * Tests invalid template config values
     */
    testInvalidTemplateConfig: function () {
        App.test.util.Common.mapValues(function (val) {
            assertNoException('View shouldn\'t throw an exception', function () {
                var view = new App.view.base.View({template: val, elPath: '#viewContainer'});
                view.destroy();
            });
        });
    },

    /*
     * Tests elPath configuration
     */
    testElPathConfigOnly: function () {
        var view = new App.view.base.View({elPath: '#viewContainer'});

        view.render();
        assertTrue('View\'s DOM should\'n be created', this.ct.children().length === 0);
        view.destroy();
    },

    /*
     * Tests elPath configuration
     */
    testAutoElPathConfig: function () {
        var view = new App.view.base.View({template: 'Button'});

        view.setConfig({data: {title: 'Test'}});
        view.render('#viewContainer');
        assertTrue('View\'s DOM should be created', this.ct.children().length > 0);
        view.destroy();
    },

    /*
     * Tests invalid template config
     */
    testInvalidElPathConfig: function () {
        var view;

        App.test.util.Common.mapValues(function (val) {
            assertException('View should fail rendering if elPath is invalid', function () {
                view = new App.view.base.View({template: 'libraryNavigator.Container', elPath: val, listeners: {
                    error: function () {
                        throw new Error('View failed');
                    }
                }});
                view.render();
                view.destroy();
            });
        });
    },

    /*
     * Tests items configuration parameter
     */
    testEmptyItemsConfig1: function () {
        var view = new App.view.base.View({template: 'Button', elPath: '#viewContainer', items: []});

        view.setConfig({data: {title: 'Test'}});
        assertObject('View without sub items should be rendered', view.render());
        view.destroy();
    },

    /*
     * Tests items configuration parameter
     */
    testEmptyItemsConfig2: function () {
        var view = new App.view.base.View({template: 'Button', elPath: '#viewContainer', items: null});

        view.setConfig({data: {title: 'Test'}});
        assertObject('View without sub items should be rendered', view.render());
        view.destroy();
    },

    /*
     * Tests invalid values for items configuration
     */
    testInvalidItemsConfig: function () {
        var view;

        App.test.util.Common.mapValues(function (val) {
            assertException('View should fail if items configuration is invalid', function () {
                view = new App.view.base.View({template: 'libraryNavigator.Container', elPath: '#viewContainer', items: val, listeners: {
                    error: function () {
                        throw new Error('Creation failed');
                    }
                }});
                if (!view.render()) {
                    throw new Error('Render method failed');
                }
                view.destroy();
            });
        }, ['nil', 'emptyArray']);
    }

    // TODO: add test where templateData will be null
});
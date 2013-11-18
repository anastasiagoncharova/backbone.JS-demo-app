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
        $('body').append('<div id="viewContainer1"></div>');
        this.ct  = $('#viewContainer');
        this.ct1 = $('#viewContainer1');
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
        var view1;
        var view2;

        assertNoException('base.View class should be created without configuration', function () {
            view1 = new App.view.base.View();
            view2 = new App.view.base.View();
        });

        assertObject('First base.View has created', view1);
        assertObject('Second base.View has created', view2);

        view1.destroy();
        view2.destroy();
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
     * Tests templateDataProp config. It points to data property, which
     * will be applied to the html template by underscore template engine
     */
    testTemplateDataProp: function () {
        N13.define('App.template.temp.Button', {
            statics: {
                dat: '<button type="button"><%= title %></button>'
            }
        });
        var view = new App.view.base.View({templateDataProp: 'dat', template: 'temp.Button', elPath: '#viewContainer'});

        view.setConfig({dat: {title: 'Test'}});
        view.render();
        assertTrue('Button should contain "Test" title', this.ct.find('button')[0].innerText === 'Test');
        view.destroy();
    },
    /*
     * Checks invalid data property values
     */
    testInvalidTemplateDataPropValues: function () {
        App.test.util.Common.mapValues(function (val) {
            var view = new App.view.base.View({templateDataProp: val, template: 'Button', elPath: '#viewContainer'});
            assertFalse('View shouldn\'t render without data config', view.render());
            view.destroy();
        }, ['string', 'capitalString', 'longString', 'specialString']);
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
                view = new App.view.base.View({template: 'player.Container', elPath: val, listeners: {
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
     * Checks if autoIncrementId config works
     */
    testAutoIncrementId: function () {
        var ct;
        var ct1;

        N13.define('App.view.temp.Container', {
            extend : 'App.view.base.View',
            configs: {
                template: 'player.Container'
            }
        });
        N13.define('App.view.temp.Button', {
            extend : 'App.view.base.View',
            configs: {
                elPath  : 'autoInsert',
                template: 'Button',
                data    : {title: 'test'}
            }
        });

        ct  = new App.view.temp.Container({items: ['temp.Button', 'temp.Button'], elPath: '#viewContainer',  autoIncrementId: 'autoInsert'});
        ct1 = new App.view.temp.Container({items: ['temp.Button', 'temp.Button'], elPath: '#viewContainer1', autoIncrementId: 'undef'});
        ct.render();
        ct1.render();

        assertTrue('View\'s DOM should be created', this.ct.children().find('button').length === 2 && ct.el.find('button').length === 2);
        assertTrue('View\'s DOM should be created', this.ct1.children().find('button').length === 0 && ct1.el.find('button').length === 0);

        ct.destroy();
        ct1.destroy();
    },

    /*
     * Checks if containerCls config works
     */
    testContainerCls: function () {
        var ct;

        N13.define('App.template.temp.Container', {
            statics: {
                data: '' +
                    '<div class="temp-container">' +
                        '<div class="ct"></div>' +
                    '</div>'
            }
        });
        N13.define('App.view.temp.Container', {
            extend : 'App.view.base.View',
            configs: {
                template    : 'temp.Container',
                items       : 'temp.Button',
                elPath      : '#viewContainer',
                containerCls: 'ct'
            }
        });
        N13.define('App.view.temp.Button', {
            extend : 'App.view.base.View',
            configs: {
                template: 'Button',
                data    : {title: 'test'}
            }
        });

        ct = new App.view.temp.Container();
        ct.render();

        assertTrue('View\'s DOM should be created', ct.el.find('.ct').length === 1);

        ct.destroy();
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
                view = new App.view.base.View({template: 'player.Container', elPath: '#viewContainer', items: val, listeners: {
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
});
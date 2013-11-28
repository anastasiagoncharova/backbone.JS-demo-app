/*global App */

// TODO: add tests for onBeforeXXX() and onAfterXXX() methods

AsyncTestCase("App.view.base.View", {
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


    //
    // This is configuration section. All tests below will test config parameters.
    //

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
    testTemplateDataPropConfig: function () {
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
    testInvalidTemplateDataPropConfig: function () {
        App.test.util.Common.mapValues(function (val) {
            var view = new App.view.base.View({templateDataProp: val, template: 'player.Container', elPath: '#viewContainer'});
            assertFalse('View shouldn\'t render without data config', view.render());
            view.destroy();
        }, ['string', 'capitalString', 'longString', 'specialString']);
    },
    /*
     * Checks invalid templateNs config property
     */
    testInvalidTemplateNsConfig: function () {
        App.test.util.Common.mapValues(function (val) {
            var view = new App.view.base.View({templateNs: val, template: 'player.Container', elPath: '#viewContainer'});
            assertFalse('View shouldn\'t render without data config', view.render());
            view.destroy();
        });
    },
    /*
     * Checks correct templateNs config property
     */
    testTemplateNsConfig: function () {
        var view;

        N13.define('App.template.temp.Button', {
            statics: {
                data: '<button type="button">Test</button>'
            }
        });
        view = new App.view.base.View({templateNs: 'App.template.temp', template: 'Button', elPath: '#viewContainer'});

        assertTrue('View should render the button', view.render() === view);
        view.destroy();
    },

    /*
     * Checks invalid viewNs config property
     */
    testInvalidViewNsConfig: function () {
        N13.define('App.view.temp.Button', {
            extend  : 'App.view.base.View',
            requires: 'App.view.player.Container',
            configs : {
                template: 'player.Container'
            }
        });
        App.test.util.Common.mapValues(function (val) {
            var view = new App.view.base.View({viewNs: val, template: 'player.Container', items: ['temp.Button', 'temp.Button']});
            view.render('#viewContainer');
            assertTrue('View shouldn\'t render without correct viewNs config',  view.el.find('.innerContainer').length === 2);
            view.destroy();
        });
    },
    /*
     * Checks correct viewNs config property
     */
    testViewNsConfig: function () {
        var view;

        N13.define('App.template.temp.Button', {
            statics: {
                data: '<button type="button">Test</button>'
            }
        });
        view = new App.view.base.View({templateNs: 'App.template.temp', template: 'Button', elPath: '#viewContainer'});

        assertTrue('View should render the button', view.render() === view);
        view.destroy();
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
    },


    /*
     * Tests listeners configuration
     */
    testListenersConfig: function () {
        var res  = false;
        var cb   = function () {res = true;};
        var view;

        assertNoException('View with listeners config should be created', function () {
            view = new App.view.base.View({listeners: {beforeinit: cb}});
            assertTrue('listeners config should work', res);
            view.destroy();
        });
    },
    /*
     * Tests invalid listeners configuration values
     */
    testInvalidListenersConfig: function () {
        var res  = false;
        var cb   = function () {res = true;};
        var view;

        App.test.util.Common.mapValues(function (val) {
            res  = false;
            view = new App.view.base.View({listeners: val});
            assertFalse('listeners config shouldn\'t work with invalid values', res);
            view.destroy();
        });
    },


    /*
     * Checks if autoIncrementId config works
     */
    testAutoIncrementIdConfig: function () {
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
    testContainerClsConfig: function () {
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
     * Checks if autoRender config works
     */
    testAutoRenderConfig: function () {
        var ct;

        N13.define('App.view.temp.Button', {
            extend : 'App.view.base.View',
            configs: {
                template  : 'Button',
                elPath    : '#viewContainer',
                autoRender: true,
                data      : {title: 'Test'}
            }
        });

        ct = new App.view.temp.Button();
        assertTrue('Button DOM should be created', ct.el.find('button').length === 1);

        ct.destroy();
    },
    /*
     * Checks if autoRender config works with invalid values
     */
    testInvalidAutoRenderConfig: function () {
        var view;
        var res;

        N13.define('App.view.temp.Button', {
            extend : 'App.view.base.View',
            configs: {
                template  : 'Button',
                elPath    : '#viewContainer',
                data      : {title: 'Test'}
            }
        });

        App.test.util.Common.mapValues(function (val) {
            assertNoException('View should fail if items configuration is invalid', function () {
                res = false;
                view = new App.view.temp.Button({autoRender: val, listeners: {render: function () {res = true;}}});
                assertTrue('View shouldn\'t render with invalid autoRender config', res === false);
                view.destroy();
            });
        }, ['boolTrue']);
    },


    //
    // This public methods section. All tests below will test public methods.
    //

    /*
     * Tests base view creation and init() method call
     */
    testInitMethod1: function () {
        var view1;
        var view2;
        var res = 0;
        var bi  = function () {res++;};

        assertNoException('base.View class should be created without configuration', function () {
            view1 = new App.view.base.View({listeners: {beforeinit: bi, init: bi}});
            view2 = new App.view.base.View();

            assertObject('First base.View has created', view1);
            assertObject('Second base.View has created', view2);
            assertTrue('init() method should be called', res === 2);


            // Nothing should happen
            view1.init();
            view1.destroy();
            view2.destroy();
        });
    },
    /*
     * Tests base view creation and init() method call twice or more
     */
    testInitMethod2: function () {
        var view;
        var res = 0;
        var bi  = function () {res++;};

        assertNoException('base.View class should be created without configuration', function () {
            view = new App.view.base.View({listeners: {beforeinit: bi, init: bi}});

            assertObject('First base.View has created', view);
            assertTrue('init() method should be called', res === 2);
            view.init();
            assertTrue('init() method should be called', res === 2);
            view.destroy();
            // Nothing should happen
            view.init();
            assertTrue('init() method shouldn\'t be called', res === 2);
            view.destroy();
            view.init();
            assertTrue('init() method shouldn\'t be called', res === 2);
        });
    },

    /*
     * Tests render() method
     */
    testRenderMethod: function () {
        var view1;
        var view2;

        view1 = new App.view.base.View({template: 'player.Container', elPath: '#viewContainer'});
        view2 = new App.view.base.View({template: 'player.Container'});
        assertTrue('render() method should work', view1.render() === view1 && view1.el.children().length > 0);
        assertTrue('render() method should work', view2.render('#viewContainer1') === view2 && view2.el.children().length > 0);
        view2.destroy();
        view1.destroy();
    },
    /*
     * Tests render() method with invalid values
     */
    testInvalidRenderMethod: function () {
        var view;

        App.test.util.Common.mapValues(function (val) {
            view = new App.view.base.View({template: 'player.Container'});
            assertFalse('View shouldn\'t be rendered if root tag query is invalid', view.render(val));
            view.destroy();
        });
    },


    /*
     * Tests clear() method. It should clear created DOM
     */
    testClearMethod: function () {
        var view;

        view = new App.view.base.View({template: 'player.Container', elPath: '#viewContainer'});
        view.render();
        view.clear();
        assertTrue('clear() method should clear created DOM', view.el.children().length === 0);
        view.destroy();
    },


    /*
     * Tests destroy() method
     */
    testDestroyMethod: function () {
        var view;

        view = new App.view.base.View({template: 'player.Container', elPath: '#viewContainer'});
        view.render();
        assertTrue('render() method should add new DOM', view.el.children().length > 0);
        view.destroy();
        assertTrue('destroy() method should remove created DOM', view.el.children().length === 0);
    },


    //
    // View mixins section. This sections contains unit tests for App.mixin.view.* mixins, which
    // were created for extending of App.view.base.View class.
    //

    testShowMixin: function () {
        var view;
        var res = 0;
        var cb  = function () {res++;};

        N13.define('App.view.temp.Button', {
            extend : 'App.view.base.View',
            mixins : {show: 'App.mixin.view.Show'},
            configs: {
                template    : 'Button',
                data        : {title: 'Test'},
                onBeforeShow: cb,
                onAfterShow : cb,
                onBeforeHide: cb,
                onAfterHide : cb,
                listeners   : {
                    beforeshow: cb,
                    show      : cb,
                    beforehide: cb,
                    hide      : cb
                }
            }
        });

        view = new App.view.temp.Button();
        view.render('#viewContainer');
        assertTrue('View should be hidden after hide() method call', view.el.css('display') !== 'none' && view.hide() === true && view.el.css('display') === 'none');
        assertTrue('View should be shown after show() method call',  view.el.css('display') === 'none' && view.show() === true && view.el.css('display') !== 'none');
        assertTrue('Before and after methods and events should work', res === 8);
        view.destroy();
    },
    testEnableMixin: function () {
        var view;
        var res = 0;
        var cb  = function () {res++;};

        N13.define('App.view.temp.Button', {
            extend : 'App.view.base.View',
            mixins : {show: 'App.mixin.view.Enable'},
            configs: {
                template    : 'Button',
                data        : {title: 'Test'},
                onBeforeEnable : cb,
                onAfterEnable  : cb,
                onBeforeDisable: cb,
                onAfterDisable : cb,
                listeners   : {
                    beforeenable : cb,
                    enable       : cb,
                    beforedisable: cb,
                    disable      : cb
                }
            }
        });

        view = new App.view.temp.Button();
        view.render('#viewContainer');
        assertTrue('View should be enabled after enable() method call',   view.el.hasClass(view.disableCls) === false && view.disable() === true && view.el.hasClass(view.disableCls) === true);
        assertTrue('View should be disabled after disable() method call', view.el.hasClass(view.disableCls) === true  && view.enable()  === true && view.el.hasClass(view.disableCls) === false);
        assertTrue('Before and after methods and events should work', res === 8);
        view.destroy();
    }
});
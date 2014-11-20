Ext.define('App.controller.Main', {
    extend: 'Ext.app.Controller',
    stores: ['user.Users'],
    models: ['user.User'],
    views: [
        'user.Grid'
    ],
    
    refs: [
        { ref: 'tabs', selector: 'viewport > #tabs' }
    ],
    init: function () {
        this.control({
            'viewport > #nav': {
                itemclick: this.onMenuItemClick
            }
        });
    },
    
    onMenuItemClick: function (view, rec) {
        if (!rec.raw || !rec.raw.panel) return;
 
        var id = rec.raw.panel;
        var cls = "App.view." + id;
        var tabs = this.getTabs();
        var tab = tabs.child('#' + id);
 
        if (!tab) {
            tab = tabs.add(Ext.create(cls, {
                itemId: id,
                title: rec.get('text')
            }));
        }
        tabs.setActiveTab(tab);
    }
});
Ext.Loader.setConfig({ enabled: true });
Ext.Loader.setPath('Ext.ux', 'scripts/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.ux.grid.FiltersFeature',    
    'Ext.toolbar.Paging'
]);
Ext.application({
    name: 'App',
    appFolder: 'scripts/main/app',
    autoCreateViewport: true,
    controllers: ['Main'],
    launch: function () {
 
    }
});
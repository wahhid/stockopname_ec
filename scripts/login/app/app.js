Ext.Loader.setConfig({ enabled: true });
Ext.application({
    name: 'App',
    appFolder: 'scripts/login/app',
    autoCreateViewport: true,
    controllers: ['Login'],    
    launch: function () {
        
    }
});
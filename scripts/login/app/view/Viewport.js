Ext.define('App.view.Viewport', {
     extend: 'Ext.container.Viewport',
     layout: 'fit',
     requires:['App.view.Login'],
     items:[{
          xtype:'login'          
     }]
});
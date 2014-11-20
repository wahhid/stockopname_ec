Ext.define('App.view.BinList' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.transtockreport',
    title: 'Transaction Report',  
    layout: 'fit',
    icon: 'images/icon01/list_extensions.gif',
    closable: true,       
    
    initComponent: function() {    
        var itemsPerPage = 25;                
        var obj;                
         
        var reportForm = Ext.Widget({
            
        });
        
        this.items = [
            
        ];
        this.callParent(arguments);            
    }                
});
Ext.define('App.view.StockList' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.stocklist',
    title: 'List Stocks',  
    layout: 'border',
    closable: true,      
    initComponent: function() {    
        var itemsPerPage = 25;                
        var obj;        
        
        var store = Ext.create('Ext.data.Store', {    
            fields: ['id', 'periodedate', 'description', 'periodesession' , 'status'], 
            autoLoad: true,     
            autoSync: true,
            pageSize: itemsPerPage,
            proxy: {
                type: 'ajax',
                url: 'json/periode/findpaging.php',
                reader: {
                    type: 'json',
                    root: 'items',                   
                    totalProperty: 'totalItem'
                }                                
            },
            remoteSort: true,
            sorters: [{
                property: 'periodedate',
                direction: 'DESC'
            }]            
        });               
        
        var createform = Ext.create('Ext.window.Window',{
            title: 'New Periode',            
            modal: true,
            closable: false,
            width: 600,
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 5,
                    items: [
                        {
                            xtype: 'datefield',
                            name: 'periodedate',
                            fieldLabel: 'Periode Date',
                            format: 'Y-m-d',
                            allowBlank: false
                        },{
                            xtype: 'textfield',
                            name: 'description',
                            fieldLabel: 'Description',
                            anchor: '100%',
                            allowBlank: false
                        }
                    ]                   
                }
            ],
            buttons: [
                {
                    text: 'Save',
                    handler: function(button) {
                        var win = button.up('window');                       
                        var form = win.down('form')                        
                        form.getForm().submit({
                            url: 'json/periode/createmin.php',
                            waitMsg: 'Creating...',
                            success: function(form, action) {
                                form.reset();
                                store.load();                                                                   
                                win.hide();                                   
                            },
                            failure: function(form, action){
                                Ext.Msg.alert('Failure', action.result.errorMessage);                                    
                            }
                        });                        
                    }
                },{
                    text: 'Close',
                    handler: function(button){
                        var win = button.up('window');                   
                        win.hide();
                    }
                }
            ]            
        });
        
        var grid = Ext.create('Ext.grid.Panel',{            
            layout: 'fit',
            border: false,
            scrolable : true,
            store: store,     
            columns: [
                {header: 'ID',  dataIndex: 'id',  width: 100},
                {header: 'Periode Date', dataIndex: 'periodedate', width: 100},
                {header: 'Decription', dataIndex: 'description', flex: 1},               
                {header: 'Session', dataIndex: 'periodesession', width: 100},
                {header: 'Status',xtype: 'checkcolumn', dataIndex: 'status', width: 100}
            ],            
            dockedItems: [{
                    xtype: 'toolbar',
                    items: [
                        {
                            xtype: 'button',
                            text: 'New Periode',                        
                            icon: 'images/new_list.png',
                            handler: function(){
                                var create = createform;
                                create.show();
                            }                        
                        },{
                            xtype: 'button',
                            text: 'Close Session',
                            icon: 'images/mark_complete.png'
                        }
                    ]                    
                },
                {
                    xtype: 'pagingtoolbar',
                    store: store,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true
            }],                    
            listeners : {
                itemclick: function(dv, record, item, index, e) {                                        
                    selectedRow = record.data;
                    console.log("Selected Row : " + selectedRow.id); 
                }
            },
            viewConfig: {
                stripeRows: true
            }            
        });     
        
        var tree = Ext.create('Ext.tree.Panel',{
            id: 'periodetree'
        });
        
        this.items = [
            {
                title: 'Navigation',
                width: 150,
                region: 'west',
                collapsible: true,
                expanded: false
            },
            {
                title: 'Periode',
                layout: 'fit',
                region: 'center',                
                items: [
                    grid
                ]
            }
        ]        
        this.callParent(arguments);            

    }
    
        
    
});
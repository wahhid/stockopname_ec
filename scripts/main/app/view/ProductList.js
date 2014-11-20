Ext.define('App.view.ProductList' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.productlist',
    title: 'List Products',  
    layout: 'fit',
    icon: 'images/icon01/list_packages.gif',
    closable: true,    
    initComponent: function() {    
        var itemsPerPage = 25;                
        var store = Ext.create('Ext.data.Store', {    
            fields: ['ean', 'article', 'category', 'productname' , 'uom'],             
            autoLoad: true,     
            autoSync: true,
            pageSize: itemsPerPage,
            proxy: {
                type: 'ajax',
                url: 'json/product/findpaging.php',
                reader: {
                    type: 'json',
                    root: 'items',                   
                    totalProperty: 'totalItem'
                }                                
            },
            remoteSort: true,
            sorters: [{
                property: 'productname',
                direction: 'ASC'
            }]            
        });               
        
        var uploadform = Ext.create('Ext.window.Window',{
            title: 'Upload Product',            
            modal: true,
            closable: false,
            icon: 'images/icon01/page_up.gif',
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 5,
                    items: [
                        {
                            xtype: 'filefield',
                            name: 'productfile',
                            fieldLabel: 'File',
                            buttonText: 'Select File'                           
                        }
                    ]                   
                }
            ],
            buttons: [
                {
                    text: 'Upload',                        
                    handler: function(button) {
                        var win = button.up('window');                       
                        var form = win.down('form').getForm();
                        if(form.isValid()){
                            form.submit({
                                url: 'json/util/productupload.php',
                                waitMsg: 'Uploading Product...',
                                success: function(form, action) {                                                                       
                                    store.load();                                    
                                    Ext.Msg.alert('Upload Product', action.result.data);
                                    win.hide();
                                }
                            });
                        }
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
            autoScroll: true,
            border: false,
            layout : 'fit',
            scrolable : true,
            store: store,     
            columns: [
                {header: 'EAN',  dataIndex: 'ean',  width: 100},
                {header: 'Article', dataIndex: 'article', width: 100},
                {header: 'Category', dataIndex: 'category', width: 100},
                {header: 'Product Name', dataIndex: 'productname', flex: 1},
                {header: 'UOM', dataIndex: 'uom', width: 100}
            ],            
            dockedItems: [{
                    xtype: 'toolbar',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Upload Product',      
                            icon: 'images/icon01/page_up.gif',
                            handler: function(){
                                var upload = uploadform;
                                upload.show();
                            }                        
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
                itemdblclick: function(dv, record, item, index, e) {                    
                    console.log("ID : " + record.data.id);        
                }
            },
            viewConfig: {
                stripeRows: true
            }            
        });
        
        
        
        this.items = [grid];
        this.callParent(arguments);            

    }
    
        
    
});
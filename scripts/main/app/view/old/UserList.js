Ext.define('App.view.UserList' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.userlist',
    title: 'List Users',  
    layout: 'fit',
    closable: true,    
    initComponent: function() {    
        var itemsPerPage = 1;
        var usermodel = Ext.create('Ext.data.Model',{
            fields: ['username', 'fullname', 'password'] 
        });
        
        var userstore = Ext.create('Ext.data.Store', {    
            fields: ['username', 'fullname', 'password'],             
            autoLoad: true,     
            autoSync: true,
            pageSize: itemsPerPage,
            proxy: {
                type: 'ajax',   
                url: 'Userjson/findpaging',
                reader: {                    
                    type: 'json',
                    root: 'items',
                    totalProperty: 'totalItem'
                },
                simpleSortMode: true                
            },
            sorters: [{
                property: 'fullname',
                direction: 'DESC'
            }]            
        });               
        
        var treegrid = Ext.create('Ext.grid.Panel',{            
            border: false,
            layout : 'fit',
            scrolable : true,
            store: userstore,     
            columns: [
                {header: 'User Name',  dataIndex: 'username',  width: 100},
                {header: 'Full Name', dataIndex: 'fullname', flex: 1}
            ],            
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: userstore,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true
            }],            
        
            listeners : {
                itemdblclick: function(dv, record, item, index, e) {
                    console.log(record.data.username); 
                    var edituser = editform;
                    edituser.down('form').loadRecord(record);
                    edituser.show();
                }
            },
            viewConfig: {
                stripeRows: true
            }            
        });
        
        var editform = Ext.create('Ext.window.Window',{
            title: 'Edit User',
            items: [
                {
                    xtype: 'form',
                    borderPadding: 5,
                    items: [
                        {
                            xtype: 'textfield',
                            name : 'username',                        
                            fieldLabel: 'Username'
                        },
                        {
                            xtype: 'textfield',
                            name : 'fullname',
                            fieldLabel: 'Fullname'
                        },
                        {
                            xtype: 'textfield',
                            name : 'password',
                            fieldLabel: 'Password',
                            inputType: 'password'
                        }

                    ]
                }
            ],
            buttons: [
                {
                    text: 'Save',
                    handler: function(button){                             
                        var win = button.up('window');
                        var form = win.down('form');                       
                        form.submit({                            
                            url: 'Userjson/update'
                        });                        
                    }
                },
                {
                    text: 'Cancel',                    
                    handler: function(button){
                        button.up('window').hide();
                    }
                }
            ]              
        });
        

        
        this.items = [treegrid];
        this.callParent(arguments);            

    }
    
        
    
});
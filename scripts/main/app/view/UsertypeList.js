Ext.define('App.view.UsertypeList' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.usertypelist',
    title: 'List User Types',  
    layout: 'fit',
    closable: true,    
    initComponent: function() {    
        var itemsPerPage = 25;                
        var userstore = Ext.create('Ext.data.Store', {    
            fields: ['username', 'fullname', 'password'], 
            autoLoad: true,     
            autoSync: true,
            pageSize: itemsPerPage,
            proxy: {
                type: 'ajax',
                url: 'json/usertype/findpaging.php',
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
                    xtype: 'toolbar',
                    items: [{
                        xtype: 'button',
                        text: 'New User',                        
                        handler: function(){
                            var createuser = createform;
                            createform.show();
                        }                        
                    },{
                        xtype: 'button',
                        text: 'Delete User',
                        handler: function(record){
                            console.log(record.data.username);
                        }
                    }]                    
                },
                {
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
                        form.getForm().submit({
                            url: 'json/user/update',
                            waitMsg: 'Updating...',
                            success: function(form, action){                                
                                userstore.load();
                                win.hide();
                            },
                            failure: function(form, action){
                                Ext.Msg.alert('Failure', action.result.Message);
                            }                            
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
        
        var createform = Ext.create('Ext.window.Window',{
            title: 'Create User',            
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
                        form.getForm().submit({
                            url: 'json/user/create',
                            waitMsg: 'Updating...',
                            success: function(form, action){                                
                                userstore.load();
                                win.hide();
                            },
                            failure: function(form, action){
                                Ext.Msg.alert('Failure', action.result.Message);
                            }                            
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
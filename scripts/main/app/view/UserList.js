Ext.define('App.view.UserList' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.userlist',
    title: 'List Users',  
    layout: 'border',
    closable: true,       
    icon: 'images/icon01/list_users.gif',
    initComponent: function() {    
        
        var itemsPerPage = 25;                
        var obj;
        
        var userstore = Ext.create('Ext.data.Store', {    
            fields: ['username', 'fullname', 'password', 'usertype'], 
            autoLoad: true,     
            autoSync: true,
            pageSize: itemsPerPage,
            proxy: {
                type: 'ajax',
                url: 'json/user/findpaging.php',
                reader: {
                    type: 'json',
                    root: 'items',                   
                    totalProperty: 'totalItem'
                }
            },
            remoteSort: true,
            remoteFilter: true,
            sorters: [{
                property: 'fullname',
                direction: 'ASC'
            }]            
        });               
       
        
        //Filter Form
        var filterForm = Ext.create('Ext.form.Panel',{
            bodyPadding: 5,
            items: [
                {
                    xtype: 'textfield',
                    name: 'username',
                    fieldLabel: 'User Name'
                },{
                    xtype: 'textfield',
                    name: 'fullname',
                    fieldLabel : 'Full Name'
                }
            ],
            buttons: [
                {
                    text: 'Find',
                    handler: function(){
                        var form = this.up('form').getForm();
                        userstore.clearFilter(true);
                        if(form.findField('username').getValue().length > 0){
                            userstore.filter('username',form.findField('username').getValue());
                        }
                        if(form.findField('fullname').getValue().length > 0){
                            userstore.filter('fullname',form.findField('fullname').getValue());                        
                        }                        
                        userstore.load();
                    }
                },{
                    text: 'Clear Filter',
                    handler: function(){                       
                        var form = this.up('form').getForm();
                        form.findField('username').setValue('');
                        form.findField('fullname').setValue('');                        
                        userstore.clearFilter(true);
                        userstore.load();
                    }
                }
            ]
        });
        //End Filter Form
             
        //Report Window
        var userReportWindow = Ext.create('Ext.window.Window', {
                height: 480,
                width: 640,
                layout: 'fit',
                items: [{
                    xtype: 'box',
                    autoEl: {
                        tag: 'iframe',
                        src: 'report/user/userlist.php'
                    }
                }]
        });
        
        var grid = Ext.create('Ext.grid.Panel',{            
            border: false,
            layout : 'fit',
            scrolable : true,        
            store: userstore,                      
            columns: [
                {
                    header: 'User Name',  
                    dataIndex: 'username',  
                    width: 100,
                    filter: {
                        type: 'string'
                    }
                },{
                    header: 'Full Name', 
                    dataIndex: 'fullname', 
                    flex: 1,
                    filter: {
                        type: 'string'
                    }
                },{
                    header: 'Type', 
                    dataIndex: 'usertype', 
                    width: 100
                },
            ],            
            dockedItems: [{
                    xtype: 'toolbar',
                    items: [{
                        xtype: 'button',
                        text: 'New User',                       
                        icon: 'images/icon01/icon_user.gif',                        
                        handler: function(){
                            var createuser = createform;
                            createform.show();
                        }                        
                    },{
                        xtype: 'button',
                        text: 'Delete User',
                        icon: 'images/icon01/action_stop.gif',
                        handler: function(record){
                            Ext.Msg.confirm('Confirmation','Are you sure to delete this user ?',function(btn){
                               if(btn==='yes'){
                                   Ext.Ajax.request({
                                       url: 'json/user/delete.php',                                
                                        method: 'POST',
                                        params:{
                                            username: obj.username
                                        },                                                     
                                        success: function(response, opts){
                                            var objjson = Ext.decode(response.responseText);
                                            if(objjson.success == false){
                                               Ext.MessageBox.alert('Delete User', objjson.errorMessage, '');   
                                            }else{                                                       
                                               Ext.MessageBox.alert('Delete User', objjson.Message, ''); 
                                               userstore.load();
                                            }
                                        },
                                        failure: function(response, opts){
                                            var objjson = Ext.decode(response.responseText);                                    
                                            Ext.MessageBox.alert('Delete User', objjson.errorMessage, '');                                  
                                        }
                                  });
                               }
                            });                                                                                                                                                                  
                        }
                    },{
                        xtype: 'button',
                        text: 'Print Report',
                        handler: function(){
                            window.open('report/user/userlist.php', '_blank', 'toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1');
                        }                        
                    }
                    ]                    
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
                    var edit = editform;
                    var form = edit.down('form');
                    form.getForm().load({
                        url: 'json/user/find.php',
                        params: {
                            username: record.data.username
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert("Load failed", action.result.errorMessage);
                        }
                    });
                    edit.show();
                },
                itemclick : function(dv, record, item, index, e){
                    obj = record.data;
                    console.log('Selected Row : ' + obj.username);
                    
                }
                
            },
            viewConfig: {
                stripeRows: true
            }            
        });
        
            
        var usertypestore = Ext.create('Ext.data.Store',{
            autoLoad: true,
            fields:[
                {
                    name:'id'
                },{
                    name:'name'
                }
            ],
            proxy: {
                type: 'ajax',
                url: 'json/usertype/findall.php',
                reader: {
                    type: 'json',
                    root: 'items'
                }
                
            }
        });
        
        var createusertypecombo = Ext.create('Ext.form.field.ComboBox',{
            fieldLabel: 'User Type',
            name: 'usertype',
            valueField: 'id',
            displayField: 'name',
            store: usertypestore            
        })
        
        var editusertypecombo = Ext.create('Ext.form.field.ComboBox',{
            fieldLabel: 'User Type',
            name: 'usertype',
            valueField: 'id',
            displayField: 'name',
            store: usertypestore            
        })
        
        
        var editform = Ext.create('Ext.window.Window',{
            title: 'Edit User',
            modal: true,
            width: 600,
            icon: 'images/icon01/icon_user.gif',
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 5,
                    items: [
                        {
                            xtype: 'textfield',
                            name : 'username',                        
                            fieldLabel: 'Username'
                        },
                        {
                            xtype: 'textfield',
                            name : 'fullname',
                            fieldLabel: 'Fullname',
                            anchor: '90%'
                        },
                        {
                            xtype: 'textfield',
                            name : 'password',
                            fieldLabel: 'Password',
                            inputType: 'password'
                        },{
                            xtype: editusertypecombo
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
                            url: 'json/user/update.php',
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
            closeAction: 'hide',
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
                        },{
                            xtype: createusertypecombo
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
                            url: 'json/user/create.php',
                            waitMsg: 'Creating...',
                            success: function(form, action){                
                                form.reset();
                                userstore.load();
                                win.hide();
                            },
                            failure: function(form, action){
                                Ext.Msg.alert('Failure', action.result.errorMessage);
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
        
        this.items = [
            {  
                title: 'Filter',
                region: 'west',
                width: 300,
                collapsed: true,
                collapsible: true,
                items: [
                    filterForm
                ]
            },{                
                xtype: 'container',
                region: 'center',
                layout: 'fit',
                items: [
                    grid
                ]
            }
            
        ];
        this.callParent(arguments);            

    }
    
        
    
});
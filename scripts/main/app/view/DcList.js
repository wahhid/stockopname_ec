Ext.define('App.view.DcList' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.dclist',
    title: 'List DCs',  
    layout: 'fit',
    icon: 'images/icon01/list_components.gif',
    closable: true,    
    initComponent: function() {
                        
        var obj;
        var type;

        var treestore = Ext.create('Ext.data.TreeStore',{              
            fields: [
                {name: 'name',        type: 'string'},
                {name: 'id',        type: 'string'},
                {name: 'type',        type: 'string'},
                {name: 'userdc',        type: 'string'}
            ],
            autoLoad: true, 
            autoSync: true,
            proxy: {
                type: 'ajax',               
                url: 'json/dc/tree.php'                
            },            
            folderSort: true            
        });      
        
        var userstore = Ext.create('Ext.data.Store',{
            autoLoad: true,
            fields:[
                {name: 'username'},
                {name: 'fullname'}
            ],
            proxy: {
                type: 'ajax',
                url: 'json/user/findall.php',                
                reader:{
                    type: 'json',
                    root: 'items'
                }
            }            
        });

        var usercombo = Ext.create('Ext.form.field.ComboBox',{                        
            name: 'username',
            fieldLabel: 'User',
            valueField: 'username',
            displayField: 'fullname',
            store: userstore
        })        
        
        var addUsersiteAction = Ext.create('Ext.Action', {        
            text: 'Add User',
            icon: 'images/new_folder.png',
            handler: function(widget, event) {
                var win = addUserSiteWindow;
                var form = win.down('form');
                form.getForm().findField('dc').setValue(obj.data.id);                
                win.show();    
            }
        });

        var removeUsersiteAction = Ext.create('Ext.Action', {        
            text: 'Remove User',
            icon: 'images/delete_task.png',
            handler: function(widget, event) {
                Ext.Msg.confirm('Confirmation','Are you sure to delete this user ?',function(btn){
                    if(btn==='yes'){
                        Ext.Ajax.request({
                           url: 'json/userdc/removeuser.php',                                
                           method: 'POST',
                           params:{
                                id:obj.userdc
                           },                                                              
                           success: function(response, opts){
                               var objjson = Ext.decode(response.responseText);
                               if(objjson.success){
                                    Ext.MessageBox.alert('Delete User', objjson.Message, ''); 
                                    treestore.load();
                               }else{                                    
                                    Ext.MessageBox.alert('Delete User', objjson.errorMessage, '');   
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
        });

        var editSiteAction = Ext.create('Ext.Action', {        
            text: 'Edit DC',        
            icon: 'images/edit_task.png',
            handler: function(widget, event) {                
                var win = editSiteWindow;
                var form = win.down('form');
                form.getForm().load({
                    url: 'json/dc/find.php',
                    method: 'POST',
                    params: {
                        id: obj.data.id
                    },
                    success: function(){
                        
                    },
                    failure: function(){
                        
                    }                    
                })
                win.show();    
            }
        });
    
        var editSiteContextMenu = Ext.create('Ext.menu.Menu',{
            items: [            
               addUsersiteAction,
               editSiteAction               
            ]
        });
        
        var editUsersiteContextMenu = Ext.create('Ext.menu.Menu',{
            items: [            
               removeUsersiteAction               
            ]            
        })
    
        var addSiteWindow = Ext.create('Ext.window.Window',{
            title: 'Add DC',
            closable: false,
            modal: true,
            items:[{
                    xtype: 'form',
                    bodyPadding: 5,
                    items:[
                        {
                            xtype: 'textfield',
                            name: 'id',
                            fieldLabel: 'ID',                        
                            allowBlank: false
                        },{
                            xtype: 'textfield',
                            name: 'name',
                            fieldLabel: 'Name',                        
                            allowBlank: false
                        }
                    ]

            }],
            buttons:[{                
                    text: 'Save',
                    icon: 'images/icon01/action_save.gif',
                    handler: function(button){                             
                        var win = button.up('window');
                        var form = win.down('form').getForm();          
                        if(form.isValid()){
                            form.submit({
                                url: 'json/dc/create.php',
                                waitMsg: 'Creating...',
                                success: function(form, action){      
                                    form.reset();
                                    treestore.load();
                                    win.hide();
                                },
                                failure: function(form, action){
                                    Ext.Msg.alert('Failure', action.result.errorMessage);
                                }                            
                            });                            
                        }
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
        
        var editSiteWindow = Ext.create('Ext.window.Window',{
            title: 'Edit Site',
            closable: false,
            modal: true,
            items:[{
                    xtype: 'form',
                    bodyPadding: 5,
                    items:[
                        {
                            xtype: 'textfield',
                            name: 'id',
                            fieldLabel: 'ID',                        
                            readOnly: true
                        },{
                            xtype: 'textfield',
                            name: 'name',
                            fieldLabel: 'Name',
                            allowBlank: false
                        }
                    ]

            }],
            buttons:[{                
                    text: 'Save',
                    icon: 'images/icon01/action_save.gif',
                    handler: function(button){                             
                        var win = button.up('window');
                        var form = win.down('form').getForm();          
                        if(form.isValid()){
                            form.submit({
                                url: 'json/dc/update.php',
                                waitMsg: 'Updating...',
                                success: function(form, action){      
                                    form.reset();
                                    treestore.load();
                                    win.hide();
                                },
                                failure: function(form, action){
                                    Ext.Msg.alert('Failure', action.result.errorMessage);
                                }                            
                            });                            
                        }
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
        
        var addUserSiteWindow = Ext.create('Ext.window.Window',{
            title: 'Add User',
            closable: false,
            modal: true,
            items:[{
                    xtype: 'form',
                    bodyPadding: 5,
                    items:[
                        {
                            xtype: usercombo
                        },{
                            xtype: 'hidden',
                            name: 'dc'
                        }
                    ]

            }],
            buttons:[{                
                    text: 'Save',
                    handler: function(button){                             
                        var win = button.up('window');
                        var form = win.down('form').getForm();          
                        if(form.isValid()){
                            form.submit({
                                url: 'json/userdc/add.php',
                                waitMsg: 'Add...',
                                success: function(form, action){      
                                    form.reset();
                                    treestore.load();
                                    win.hide();
                                },
                                failure: function(form, action){
                                    Ext.Msg.alert('Failure', action.result.errorMessage);
                                }                            
                            });                            
                        }
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

        var sitetree = Ext.create('Ext.tree.Panel', {            
            id: 'sitetree',
            collapsible: false,
            useArrows: true,
            rootVisible: false,
            store: treestore,
            multiSelect: false,
            singleExpand: true,        
            columns: [
                {                    
                    text: 'ID',
                    width: 75,
                    sortable: true,
                    dataIndex: 'id'                    
                },
                {
                    xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'Name',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'name'
                }    
            ],             
            dockedItems:[
                {
                    xtype: 'toolbar',
                    items:[
                        {
                            xtype: 'button',
                            text: 'New DC',
                            icon: 'images/icon01/folder_new.gif',
                            handler: function(){
                                var win = addSiteWindow;
                                var form = win.down('form');
                                form.getForm().reset();
                                win.show();
                            }
                        }
                    ]
                }
            ],                               
            viewConfig:{        
                stripRows: true,
                listeners:{                    
                    itemcontextmenu: function(view, record, node, index, e) {
                        e.stopEvent();                        
                        obj = record.data                        
                        if(obj.type == 's'){
                            Ext.Ajax.request({
                                url: 'json/dc/find.php',                                
                                method: 'POST',
                                params:{
                                    id:record.data.id
                                },                                                              
                                success: function(response, opts){
                                    obj = Ext.decode(response.responseText);
                                    console.log(obj.data.type);                                                                                                                                                                                    
                                    editSiteContextMenu.showAt(e.getXY());                                            
                                },
                                failure: function(response, opts){
                                    console.log('server-side failure with status code ' + response.status);                                    
                                }
                            });                            
                        }else{                                                                                    
                            console.log('User DC : ' + obj.userdc);
                            editUsersiteContextMenu.showAt(e.getXY());                                            
                        }

                    }                                        
                }                
            }                                    
        });     
        
        this.items = [sitetree];
        this.callParent(arguments);            

    }
    
        
    
});
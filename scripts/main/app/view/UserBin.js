Ext.define('App.view.UserBin' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.userbin',
    title: 'List User Bins',  
    layout: 'border',
    closable: true,       
    icon: 'images/icon01/list_users.gif',
    initComponent: function() {    
        
        var itemsPerPage = 25;                
        var periodeobj;
        var userobj;
        var userbinobj;
        
        
        var periodestore = Ext.create('Ext.data.Store', {
            fields: ['id','description'],
            autoLoad: true,           
            pageSize: itemsPerPage,
            proxy: {
                type: 'ajax',
                url: 'json/periode/findactive.php',
                reader: {
                    type: 'json',
                    root: 'items',
                    totalProperty: 'totalItem'
                }
            }
            
        });  
        
        var userstore = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'username', type: 'string'},
                {name: 'fullname', type: 'string'},
            ],
            autoLoad: true,
            pageSize: itemsPerPage,
            proxy: {
                type: 'ajax',
                url: 'json/userbin/finduserbyperiode.php',
                reader: {
                    type: 'json',
                    root: 'items',
                    totalProperty: 'totalItem'
                }                
            },       
            remoteSort: true,
            remoteFilter: true,
            sorters: [{
                property: 'username',
                direction: 'ASC'
            }]               
        });
        
        var userbinstore = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'id', type: 'string'},
                {name: 'bin', type: 'string'},
            ],
            autoLoad: true,
            pageSize: itemsPerPage,
            proxy: {
                type: 'ajax',
                url: 'json/userbin/findbinbyuser.php',
                reader: {
                    type: 'json',
                    root: 'items',
                    totalProperty: 'totalItem'
                }                
            },
            remoteSort: true,
            remoteFilter: true,
            sorters: [{
                property: 'bin',
                direction: 'ASC'
            }]               
            
        });
                      
                      
                      
        var usercombostore = Ext.create('Ext.data.Store',{
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
            store: usercombostore
        })
        
        var bincombostore = Ext.create('Ext.data.Store',{
            autoLoad: true,
            fields:[
                {name: 'id'},
                {name: 'name'}
            ],
            proxy: {
                type: 'ajax',
                url: 'json/bin/findall.php',                
                reader:{
                    type: 'json',
                    root: 'items'
                }
            }            
        });

        var bincombo = Ext.create('Ext.form.field.ComboBox',{                        
            name: 'bin',
            fieldLabel: 'Bin',
            valueField: 'id',
            displayField: 'name',
            store: bincombostore
        })        
        
        var adduserbinform = Ext.create('Ext.window.Window',{
            title: 'Add User Bin',
            closeAction: 'hide',
            modal: true,
            width: 400,
            icon: 'images/icon01/icon_extension.gif',
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 5,
                    items: [                        
                        {
                            xtype: usercombo
                        },
                        {
                            xtype: bincombo
                        },{
                            xtype: 'hidden',
                            name: 'periode'
                        }                       
                    ]
                }
            ],
            buttons: [
                {
                    text: 'Save',
                    icon: 'images/icon01/action_save.gif',
                    handler: function(button){                             
                        var win = button.up('window');
                        var form = win.down('form');          
                        form.getForm().submit({
                            url: 'json/userbin/create.php',
                            waitMsg: 'Updating...',
                            success: function(form, action){                                
                                periodestore.load();
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

        var UserBinAction = Ext.create('Ext.Action',{
            text: 'Add User Bin',
            icon: 'images/new_folder.png',
            handler: function(){                
                var win = adduserbinform;
                var form = win.down('form');
                form.getForm().findField('periode').setValue(periodeobj.id);
                win.show();                
            }
        });
                  
        var periodeContextMenu = Ext.create('Ext.menu.Menu', {        
            items: [
                UserBinAction
            ]
        });                  
                                        
        //Start Periode Grid
        var periodegrid = Ext.create('Ext.grid.Panel',{            
            border: false,
            layout : 'fit',
            scrolable : true,        
            store: periodestore,                 
            columns: [
                {
                    header: 'ID',  
                    dataIndex: 'id',  
                    width: 30
                },{
                    header: 'Description', 
                    dataIndex: 'description', 
                    flex: 1
                }
            ],         
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: periodestore,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true
                }
            ],               
            listeners : {
                itemclick: function(dv, record, item, index, e) {
                    console.log("Row 1: " + record.data.id); 
                    periodeobj = record.data;                               
                    userstore.clearFilter(true);                    
                    userstore.filter('periode',periodeobj.id);
                    userstore.load();
                    userbinstore.clearFilter(true);
                    userbinstore.filter('periode',periodeobj.id);
                    userbinstore.filter('username',userobj.username);
                    userbinstore.load();   
                }
            },
            viewConfig: {
                stripeRows: true,
                listeners:{
                    itemcontextmenu: function(view, record, node, index, e) {
                        e.stopEvent();                        
                        periodeContextMenu.showAt(e.getXY());
                    }
                }
            }            

        });
        //End Periode Grid
        
        
        //Start User Grid
        var usergrid = Ext.create('Ext.grid.Panel',{            
            border: false,
            title: 'User',
            layout : 'fit',
            scrolable : true,        
            store: userstore,                 
            columns: [
                {
                    header: 'User Name',  
                    dataIndex: 'username',  
                    width: 100
                },{
                    header: 'Full Name', 
                    dataIndex: 'fullname', 
                    flex: 1
                }
            ],   
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: userstore,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true
            }],                
            listeners : {
                itemclick: function(dv, record, item, index, e) {
                    console.log("Row 1: " + record.data.username);
                    userobj = record.data;
                    userbinstore.clearFilter(true);
                    userbinstore.filter('periode',periodeobj.id);
                    userbinstore.filter('username',userobj.username);
                    userbinstore.load();                    
                }
            },
            viewConfig: {
                stripeRows: true
            }            
        });
        //End user Grid      
        
        //Start User Bin Grid
        var userbingrid = Ext.create('Ext.grid.Panel',{            
            border: false,
            title: 'User Bin',            
            scrolable : true,     
            layout: 'fit',
            store: userbinstore,                 
            columns: [
                {
                    header: 'ID',  
                    dataIndex: 'id',  
                    width: 100
                },{
                    header: 'Bin', 
                    dataIndex: 'bin', 
                    flex: 1
                }
            ],   
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: userbinstore,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true
            }],             
            listeners : {
                itemclick: function(dv, record, item, index, e) {
                    console.log("Row 1: " + record.data.id); 
                }
            },
            viewConfig: {
                stripeRows: true
            }            
        });
        //End user Grid            
                                               
        this.items = [
            {  
                title: 'Periode',
                region: 'west',
                layout: 'fit',
                width: 300,
                collapsed: true,
                collapsible: true,
                items: [
                    periodegrid
                ]
            },{                               
                region: 'center',
                layout: {
                    type: 'vbox',
                    align : 'stretch'                    
                },
                items: [
                    {
                        xtype: usergrid,  
                        layout: 'fit',
                        flex: 1
                    },
                    {
                        xtype: userbingrid,
                        layout: 'fit',
                        flex: 1
                    }                    
                    
                ]
            }
            
        ];
        userstore.clearFilter(true);
        userstore.filter('periode',0);
        userbinstore.clearFilter(true);
        userbinstore.filter('username',' ');
        this.callParent(arguments);            

    }                
});
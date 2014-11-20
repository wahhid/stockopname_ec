Ext.define('App.view.BinList' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.binlist',
    title: 'List Bins',  
    layout: 'border',
    icon: 'images/icon01/list_extensions.gif',
    closable: true,       
    
    initComponent: function() {    
        var itemsPerPage = 25;                
        var obj;
        
        var store = Ext.create('Ext.data.Store', {    
            fields: ['id', 'name', 'description', 'dc', 'status'], 
            autoLoad: true,                 
            pageSize: itemsPerPage,
            proxy: {
                type: 'ajax',
                url: 'json/bin/findpaging.php',
                reader: {
                    type: 'json',
                    root: 'items',                   
                    totalProperty: 'totalItem'
                }
            },
            remoteSort: true,
            remoteFilter: true,
            sorters: [{
                property: 'name',
                direction: 'ASC'
            }]            
        });               
                
        
        var uploadbinform = Ext.create('Ext.window.Window',{
            title: 'Import Bin',            
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
                            name: 'binfile',
                            fieldLabel: 'Bin File',
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
                        var form = win.down('form');
                        if(form.isValid()){
                            form.getForm().submit({
                                url: 'json/util/binupload.php',
                                waitMsg: 'Uploading Bin...',
                                success: function(form, action) {
                                    store.load();
                                    Ext.Msg.alert('Finished', action.result.Message);
                                },
                                failure: function(form, action) {
                                    Ext.Msg.alert('Finished', action.result.errorMessage)
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
        
        var treegrid = Ext.create('Ext.grid.Panel',{            
            border: false,
            title: 'Bin List',                        
            scrolable : true,
            store: store,     
            layout: 'fit',
            columns: [
                {header: 'ID',  dataIndex: 'id',  width: 50},
                {header: 'Name',  dataIndex: 'name',  width: 100},
                {header: 'Description', dataIndex: 'description', flex: 1},
                {header: 'DC', dataIndex: 'dc', width: 100},                
                {   header: 'Status', 
                    dataIndex: 'status', 
                    width: 100,
                    renderer: function(value, metaData, record, row, col, store, gridView){
                        if(record.get('status') == 0){                            
                            return '<center><img src="images/icon01/icon_accept.gif"/></center>';
                        }else{
                            return '<center><img src="images/icon01/action_stop.gif"/></center>';
                            
                        }
                    }
                },
            ],            
            dockedItems: [{
                    xtype: 'toolbar',
                    items: [
                        {
                            xtype: 'button',
                            text: 'New Bin',  
                            icon: 'images/icon01/icon_extension.gif',
                            handler: function(){
                                var createuser = createform;
                                createform.show();
                            }                        
                        },{
                            xtype: 'button',
                            text: 'Unlock Bin',
                            icon: 'images/icon01/icon_extension.gif',
                            handler: function(){
                                if(obj != null){
                                    Ext.Msg.confirm('Confirmation','Are you sure to process stock for  ' + obj.description + ' ?',function(btn){
                                       if(btn==='yes'){
                                           Ext.Ajax.request({
                                              url: 'json/bin/unlockbin.php',                                
                                              method: 'POST',
                                              params:{
                                                  id:obj.id
                                              },                                                              
                                              success: function(response, opts){
                                                  var objjson = Ext.decode(response.responseText);
                                                  if(objjson.success == false){
                                                       Ext.MessageBox.alert('Unlock Bin', objjson.errorMessage, '');   
                                                  }else{                                                       
                                                       Ext.MessageBox.alert('Unlock Bin', objjson.Message, ''); 
                                                       store.load();
                                                  }
                                              },
                                              failure: function(response, opts){
                                                  var objjson = Ext.decode(response.responseText);                                    
                                                  Ext.MessageBox.alert('Unlock Bin', objjson.errorMessage, '');                                  
                                              }
                                          });
                                       }
                                    });                                   
                                }else{
                                    Ext.MessageBox.alert('Unlock Bin', 'Please select one bin', '');                                  
                                }
                                
                            }
                        },{
                            xtype: 'button',
                            text: 'Import Bin',
                            icon: 'images/icon01/page_up.gif',
                            handler: function(){
                                var win = uploadbinform;
                                win.show();
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
                itemclick: function(dv, record, item, index, e){
                    obj =  record.data;
                    console.log("Row ID : " + obj.id);
                },
                itemdblclick: function(dv, record, item, index, e) {
                    console.log(record.data.username); 
                    var edit = editform;
                    var form = edit.down('form');
                    form.getForm().load({
                        url: 'json/bin/find.php',
                        params: {
                            id: record.data.id
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert("Load failed", action.result.errorMessage);
                        }
                    });
                    edit.show();
                }
            },
            viewConfig: {
                stripeRows: true
            }            
        });
        
        
        var editform = Ext.create('Ext.window.Window',{
            title: 'Edit Bin',
            closeAction: 'hide',
            modal: true,
            icon: 'images/icon01/icon_extension.gif',
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 5,
                    items: [
                        {   
                            xtype: 'hidden',
                            name: 'id'
                        },
                        {
                            xtype: 'textfield',
                            name : 'name',                        
                            fieldLabel: 'Name',
                            readOnly: true
                        },
                        {
                            xtype: 'textfield',
                            name : 'description',
                            fieldLabel: 'Description'
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
                            url: 'json/bin/update.php',
                            waitMsg: 'Updating...',
                            success: function(form, action){                                
                                store.load();
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
            title: 'Create Bin',                    
            modal: true,
            icon: 'images/icon01/icon_extension.gif',
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 5,
                    items: [
                        {
                            xtype: 'textfield',
                            name : 'name',                        
                            fieldLabel: 'Name'
                        },
                        {
                            xtype: 'textfield',
                            name : 'description',
                            fieldLabel: 'Description'
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
                            url: 'json/bin/create.php',
                            waitMsg: 'Creating...',
                            success: function(form, action){                
                                form.reset();
                                store.load();
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
        
        var filterForm = Ext.create('Ext.form.Panel',{
            bodyPadding: 5,
            items: [
                {
                    xtype: 'textfield',
                    name: 'id',
                    fieldLabel: 'ID'
                },{
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel : 'Name'
                },{
                    xtype: 'textfield',
                    name: 'description',
                    fieldLabel : 'Description'                   
                }
            ],
            buttons: [
                {
                    text: 'Find',
                    handler: function(){
                        var form = this.up('form').getForm();
                        store.clearFilter(true);
                        if(form.findField('id').getValue().length > 0){
                            store.filter('id',form.findField('id').getValue());
                        }
                        if(form.findField('name').getValue().length > 0){
                            store.filter('name',form.findField('name').getValue());                        
                        }                        
                        if(form.findField('description').getValue().length > 0){
                            store.filter('description',form.findField('description').getValue());                        
                        }                                                
                        store.load();
                    }
                },{
                    text: 'Clear Filter',
                    handler: function(){                       
                        var form = this.up('form').getForm();
                        form.findField('id').setValue('');
                        form.findField('name').setValue('');
                        form.findField('description').setValue('');
                        store.clearFilter(true);
                        store.load();
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
                    treegrid
                ]
            }
        ];
        this.callParent(arguments);            
    }                
});
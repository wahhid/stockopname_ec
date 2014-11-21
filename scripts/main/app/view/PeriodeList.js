Ext.define('App.view.PeriodeList' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.periodelist',
    title: 'List Periodes',  
    layout: 'border',    
    icon: 'images/icon01/calendar.gif',
    closable: true,      
    initComponent: function() {    
        var itemsPerPage = 25;                
        var obj;
        
        //Start Action
        //New Province
        var ProcessStockAction = Ext.create('Ext.Action', {        
            text: 'Process Stock',
            icon: 'images/new_folder.png',
            handler: function(widget, event) {
                 if(obj.status==0){
                    Ext.Msg.alert('Warning', 'Periode already closed.'); 
                 }else{
                    Ext.Msg.confirm('Confirmation','Are you sure to process stock for  ' + obj.description + ' ?',function(btn){
                        if(btn==='yes'){
                            Ext.Ajax.request({
                               url: 'json/periode/process.php',                                
                               method: 'POST',
                               params:{
                                   id:obj.id
                               },                                                              
                               success: function(response, opts){
                                   var objjson = Ext.decode(response.responseText);
                                   if(objjson.success == false){
                                        Ext.MessageBox.alert('Process', objjson.errorMessage, '');   
                                   }else{
                                        Ext.MessageBox.alert('Process', objjson.Message, ''); 
                                   }
                               },
                               failure: function(response, opts){
                                   var objjson = Ext.decode(response.responseText);                                    
                                   Ext.MessageBox.alert('Process', objjson.errorMessage, '');                                  
                               }
                           });
                        }
                     });                     
                 }
                 
            }
        });
        
        var StockListAction = Ext.create('Ext.Action',{
            text: 'View Stock List',
            icon: 'images/new_folder.png',
            handler: function(){
                stockbinstore.clearFilter(true);
                stockbinstore.filter('periode',obj.id);
                stockbinstore.load();
                var win = stockgridwindow;
                win.show();                
            }
        });
        
        var DownloadStockAction = Ext.create('Ext.Action', {
            text: 'Download Stock',
            icon: 'images/new_folder.png',
            handler: function() {
                Ext.Msg.confirm('Confirmation','Are you sure to download stock for  ' + obj.description + ' ?',function(btn){
                    if(btn==='yes'){      
                        Ext.core.DomHelper.append(document.body, {
                                    tag : 'iframe',
                                    id : 'downloadIframe',
                                    frameBorder : 0,
                                    width : 0,
                                    height : 0,
                                    css : 'display:none;visibility:hidden;height:0px;',
                                    src : 'report/periode/stockbyperiodecsv.php?periodeid=' + obj.id
                        });                        
                    } 
                });                   
            }        
        });
        //End Action
        
        //Start Context Menu
        var periodeContextMenu = Ext.create('Ext.menu.Menu', {        
            items: [
                ProcessStockAction,
                StockListAction,
                DownloadStockAction
            ]
        });
        
        var store = Ext.create('Ext.data.Store', {    
            fields: ['id', 'periodedate', 'description', 'periodesession' , 'status'], 
            autoLoad: true,                 
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
            remoteFilter: true,
            sorters: [{
                property: 'periodedate',
                direction: 'DESC'
            }]            
        });               
        //End ContextMenu
        //
        //Start Store
        var stockbinstore = Ext.create('Ext.data.Store', {    
            fields: ['warehouse','pid','storagetype','itemno','storagebin','quantno','dc','storageloc','articleno','description','batchno','stkcat','specialstock','countedqty','counteduom','stocksap','diff'],             
            autoSync: true,
            remoteFilter: true,
            pageSize: 10,
            proxy: {
                type: 'ajax',
                url: 'json/stockbin/findpaging.php',
                reader: {
                    type: 'json',
                    root: 'items',                   
                    totalProperty: 'totalItem'
                }                                
            },
            remoteSort: true,
            sorters: [{
                property: 'articleno',
                direction: 'ASC'
            }]            
        });           
        //End Store
        
        //Start Window
        var createform = Ext.create('Ext.window.Window',{
            title: 'New Periode',            
            modal: true,
            closable: false,
            width: 600,
            icon: 'images/new_list.png',
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 5,
                    items: [
                        {
                            xtype: 'datefield',
                            name: 'periodedate',
                            fieldLabel: 'Periode Date',
                             format: 'd-m-Y',
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
                    icon: 'images/icon01/action_save.gif',
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
        
        var editform = Ext.create('Ext.window.Window',{
            title: 'Edit Periode',            
            modal: true,
            closable: false,
            width: 600,
            icon: 'images/new_list.png',
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
                            xtype: 'datefield',
                            name: 'periodedate',
                            fieldLabel: 'Periode Date',
                            format: 'd-m-Y',
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
                    icon: 'images/icon01/action_save.gif',
                    handler: function(button) {
                        var win = button.up('window');                       
                        var form = win.down('form')                        
                        form.getForm().submit({
                            url: 'json/periode/update.php',
                            waitMsg: 'Updating...',
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
        
        var uploadstockform = Ext.create('Ext.window.Window',{
            title: 'Upload Stock',            
            modal: true,
            closable: false,
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 5,
                    items: [
                        {
                            xtype: 'hidden',
                            name: 'periode'
                        },
                        {
                            xtype: 'filefield',
                            name: 'stockfile',
                            fieldLabel: 'Stock File',
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
                                url: 'json/util/stockupload.php',
                                waitMsg: 'Uploading Stock...',
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
        
        //End Window
        
        //Start Grid
        var stockgrid = Ext.create('Ext.grid.Panel',{
            layout : 'fit',            
            border: false,
            scrolable : true,
            store: stockbinstore,     
            columns: [                   
                {header: 'Warehouse',  dataIndex: 'warehouse',  flex: 1},                
                {header: 'Inventory Rec No', dataIndex: 'pid', flex: 1},
                {header: 'Storage Type',  dataIndex: 'storagetype',  flex: 1},                
                {header: 'Item No', dataIndex: 'itemno', flex: 1},
                {header: 'Storage Bin',  dataIndex: 'storagebin',  flex: 1},                
                {header: 'Quant. No', dataIndex: 'quantno', flex: 1},
                {header: 'Site', dataIndex: 'dc', flex: 1},
                {header: 'Storage Loc', dataIndex: 'storageloc', flex: 1},
                {header: 'Article No', dataIndex: 'articleno', flex: 1},
                {header: 'Description', dataIndex: 'description', flex: 1},
                {header: 'Batch No', dataIndex: 'batchno', flex: 1},
                {header: 'Stk Cat', dataIndex: 'stkcat', flex: 1},
                {header: 'Special Stock', dataIndex: 'specialstock', flex: 1},
                {header: 'Counted Qty', dataIndex: 'countedqty', flex: 1},
                {header: 'Counted UoM', dataIndex: 'counteduom', flex: 1},
                {header: 'Stock SAP', dataIndex: 'stocksap', flex: 1},
                {header: 'Diff', dataIndex: 'diff', flex: 1},
            ],
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: stockbinstore,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true                
                }
            ]
        });
        
        var stockgridwindow = Ext.create('Ext.window.Window',{
            title: 'Stock List',           
            layout: 'fit',
            modal: true,    
            closable: true,
            closeAction: 'hide',
            width: 600,            
            items: [
                {
                    xtype: stockgrid
                }
            ]            
        });
        
        //End Grid

        //Filter Form
        var filterForm = Ext.create('Ext.form.Panel',{
            bodyPadding: 5,
            items: [
                {
                    xtype: 'textfield',
                    name: 'id',
                    fieldLabel: 'ID'
                },{
                    xtype: 'datefield',
                    name: 'periodedate',
                    fieldLabel : 'Periode Date'
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
                        if(form.findField('periodedate').getValue().length > 0){
                            store.filter('periodedate',form.findField('periodedate').getValue());                        
                        }                        
                        store.load();
                    }
                },{
                    text: 'Clear Filter',
                    handler: function(){                       
                        store.clearFilter(true);
                        var form = this.up('form').getForm();
                        form.findField('id').setValue('');
                        form.findField('periodedate').setValue('');
                        store.load();
                    }
                }
            ]
        });
        //End Filter Form
        
        //Start Menu
        
        var reportMenu = Ext.create('Ext.menu.Menu', {
               id: 'mainMenu',
               style: {
                   overflow: 'visible'     // For the Combo popup
               },
               items: [
                   {
                       text: 'Stock Take Transaction Per or All Bin',
                       icon: 'images/show_complete.png',
                       handler: function(){
                           if(obj != null){
                               var win = transactionform;
                               win.show();
                           }else{
                               Ext.MessageBox.alert('Warning', 'Please select one periode!', '');
                           }                            
                       }                                            
                   },{
                        text: 'Stock Take Summary Per or All Bin',
                        icon: 'images/show_complete.png',
                        handler: function(){
                           if(obj != null){
                               var win = summaryform;
                               win.show();
                           }else{
                               Ext.MessageBox.alert('Warning', 'Please select one periode!', '');
                           }                            
                       }                                                                   
                   },{
                       text: 'Stock Take Transaction w/o PID Per or All Bin',
                       icon: 'images/show_complete.png',
                       handler: function(){
                          if(obj != null){
                              var win = summaryform;
                              win.show();
                          }else{
                              Ext.MessageBox.alert('Warning', 'Please select one periode!', '');
                          }                            
                      }                                                                   
                  }
                   
               ]
           });        
        //End Menu
        
        var transactionform = Ext.create('Ext.window.Window',{
            title: 'Transaction Report',            
            layout: 'fit',
            modal: true,    
            closable: true,
            closeAction: 'hide',
            width: 600,   
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 5,
                    items: [                        
                        {
                            xtype: 'textfield',
                            name: 'bin',
                            fieldLabel: 'Bin',
                            text: '*'                            
                        },{
                        	xtype: 'fieldcontainer',
                        	fieldLabel: 'PID',                        	
                        	defaultType: 'radiofield',                        	
                        	layout: 'hbox',                        	
                        	items: [
                        	    {
                        	    	boxLabel: 'All',
                        	    	name: 'pid',
                        	    	inputValue: 'all',
                        	    	id: 'radioall',
                        	    	padding: '10 10 10 10',
                        	    },{
                        	    	boxLabel: 'With PID',
                        	    	name: 'pid',
                        	    	inputValue: 'wpid',
                        	    	id: 'radiowpid',
                        	    	padding: '10 10 10 10',
                        	    },{
                        	    	boxLabel: 'Without PID',
                        	    	name: 'pid',
                        	    	inputValue: 'wopid',
                        	    	id: 'radiowopid',
                        	    	padding: '10 10 10 10',
                        	    }
                        	]                        
                        }
                    ]                   
                }
            ],
            buttons: [
                {
                    text: 'Generate',
                    handler: function(button) {
                        Ext.Msg.confirm('Confirmation','Are you sure to download detail transaction ?',function(btn){
                            if(btn==='yes'){      
                                var win = button.up('window');                       
                                var form = win.down('form');
                                var pid;
                                if (form.getForm().findField('radioall').getValue() == true){
                                	pid = 'all';  
                                }
                                if (form.getForm().findField('radiowpid').getValue() == true){
                                	pid = 'wpid';
                                }
                                if (form.getForm().findField('radiowopid').getValue() == true){
                                	pid = 'wopid';
                                }                                
                                Ext.core.DomHelper.append(document.body, {
                                            tag : 'iframe',
                                            id : 'downloadIframe',
                                            frameBorder : 0,
                                            width : 0,
                                            height : 0,
                                            css : 'display:none;visibility:hidden;height:0px;',
                                            src : 'report/periode/transactionbyperiodecsv.php?periodeid=' + obj.id + '&binname=' + form.getForm().findField('bin').getValue() + '&pid=' + pid
                                });                        
                            } 
                        });                         
                    }
                },{
                    text: 'Cancel',
                    handler: function(button){
                        var win = button.up('window');                   
                        win.hide();
                    }
                }
            ]            
        });        
            
        var summaryform = Ext.create('Ext.window.Window',{
            title: 'Summary Report',            
            layout: 'fit',
            modal: true,    
            closable: true,
            closeAction: 'hide',
            width: 600,   
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 5,
                    items: [                        
                        {
                            xtype: 'textfield',
                            name: 'bin',
                            fieldLabel: 'Bin',
                            text: '*'
                        }
                    ]                   
                }
            ],
            buttons: [
                {
                    text: 'Generate',
                    handler: function(button) {
                        Ext.Msg.confirm('Confirmation','Are you sure to download detail summary ?',function(btn){
                            if(btn==='yes'){      
                                var win = button.up('window');                       
                                var form = win.down('form');
                                Ext.core.DomHelper.append(document.body, {
                                            tag : 'iframe',
                                            id : 'downloadIframe',
                                            frameBorder : 0,
                                            width : 0,
                                            height : 0,
                                            css : 'display:none;visibility:hidden;height:0px;',
                                            src : 'report/periode/summarybyperiodecsv.php?periodeid=' + obj.id + '&binname=' + form.getForm().findField('bin').getValue()
                                });                        
                            } 
                        });                         
                    }
                },{
                    text: 'Cancel',
                    handler: function(button){
                        var win = button.up('window');                   
                        win.hide();
                    }
                }
            ]            
        });        
        
        var grid = Ext.create('Ext.grid.Panel',{            
            layout : 'fit',            
            border: false,
            scrolable : true,
            store: store,     
            columns: [
                {header: 'ID',  dataIndex: 'id',  width: 50},
                {header: 'Periode Date', dataIndex: 'periodedate', width: 100},
                {header: 'Decription', dataIndex: 'description', flex: 1},               
                {header: 'Session', dataIndex: 'periodesession', width: 100},
                {
                    header: 'Status',                    
                    dataIndex: 'status', 
                    width: 100,
                    renderer: function(value, metaData, record, row, col, store, gridView){
                        if(record.get('status') == 0){
                            return '<center><img src="images/icon01/action_stop.gif"/></center>';
                        }else{
                            return '<center><img src="images/icon01/icon_accept.gif"/></center>';
                        }
                    }
                }
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
                            text: 'Delete Periode',
                            icon: 'images/delete.png',
                            handler: function(){
                                Ext.Msg.confirm('Confirmation','Are you sure to delete  ' + obj.description + ' ?',function(btn){
                                   if(btn==='yes'){
                                       Ext.Ajax.request({
                                          url: 'json/periode/delete.php',                                
                                          method: 'POST',
                                          params:{
                                              id:obj.id
                                          },                                                              
                                          success: function(response, opts){
                                              var objjson = Ext.decode(response.responseText);
                                              if(objjson.success == false){
                                                   Ext.MessageBox.alert('Delete', 'Deleted Successfully', '');   
                                              }else{
                                                  store.load();
                                              }
                                          },
                                          failure: function(response, opts){
                                              var objjson = Ext.decode(response.responseText);                                    
                                              Ext.MessageBox.alert('Delete', objjson.errorMessage, '');                                  
                                          }
                                      });
                                   }
                                });                                
                            }
                        },{
                            xtype: 'button',
                            text: 'Upload Stock',
                            icon: 'images/icon01/page_attachment.gif',
                            handler: function(){
                                if(obj != null){
                                    var uploadstock = uploadstockform;
                                    var form = uploadstock.down('form');
                                    uploadstock.setTitle('Upload Stock for ' + obj.description);
                                    form.getForm().findField('periode').setValue(obj.id);
                                    uploadstock.show();                                     
                                }else{
                                     Ext.MessageBox.alert('Warning', 'Please select one periode!', '');
                                }

                            }
                        },{
                            xtype: 'button',
                            text: 'Close Session',
                            icon: 'images/mark_complete.png',
                            handler: function(){
                                Ext.Msg.confirm('Confirmation','Are you sure to close session for  ' + obj.description + ' ?',function(btn){
                                   if(btn==='yes'){
                                       Ext.Ajax.request({
                                          url: 'json/periode/closesession.php',                                
                                          method: 'POST',
                                          params:{
                                              id:obj.id
                                          },                                                              
                                          success: function(response, opts){
                                              var objjson = Ext.decode(response.responseText);
                                              if(objjson.success == false){
                                                   Ext.MessageBox.alert('Process', objjson.data, '');   
                                              }else{
                                                  store.load();
                                              }
                                          },
                                          failure: function(response, opts){
                                              var objjson = Ext.decode(response.responseText);                                    
                                              Ext.MessageBox.alert('Process', objjson.errorMessage, '');                                  
                                          }
                                      });
                                   }
                                });
                                
                            }                            
                        },{
                            xtype: 'button',
                            text: 'Close Periode',
                            icon: 'images/mark_complete.png',
                            handler: function(){
                                Ext.Msg.confirm('Confirmation','Are you sure to close  ' + obj.description + ' ?',function(btn){
                                   if(btn==='yes'){
                                       Ext.Ajax.request({
                                          url: 'json/periode/closeperiode.php',                                
                                          method: 'POST',
                                          params:{
                                              id:obj.id
                                          },                                                              
                                          success: function(response, opts){
                                              var objjson = Ext.decode(response.responseText);
                                              if(objjson.success == false){
                                                   Ext.MessageBox.alert('Process', objjson.data, '');   
                                              }else{
                                                  store.load();
                                              }
                                          },
                                          failure: function(response, opts){
                                              var objjson = Ext.decode(response.responseText);                                    
                                              Ext.MessageBox.alert('Process', objjson.errorMessage, '');                                  
                                          }
                                      });
                                   }
                                });
                                
                            }
                        },{
                            text: 'Report',
                            menu: reportMenu
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
                    obj = record.data;
                    console.log("Selected Row : " + obj.id); 
                },
                itemdblclick: function(dv, record, item, index, e) {                                        
                    var win = editform;
                    var form = win.down('form');
                    form.getForm().load({
                        url: 'json/periode/find.php',                        
                        params: {
                            'id' : record.data.id
                        },                              
                        failure: function(form, action) {
                            Ext.Msg.alert("Load failed", action.result.errorMessage);
                        }                        
                    });
                    win.show();                    
                }
            },
            viewConfig: {
                stripeRows: true,
                listeners:{
                    itemcontextmenu: function(view, record, node, index, e) {     
                        obj = record.data;
                        console.log(obj.status);
                        e.stopEvent();
                        periodeContextMenu.showAt(e.getXY());
                    }
                }
            }            
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
            
        ]        
        this.callParent(arguments);            

    }
    
        
    
});
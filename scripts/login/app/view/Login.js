Ext.define('App.view.Login', {
    extend: 'Ext.window.Window',
    alias: 'widget.login',
    title: 'Login',
    layout: 'fit',            
    autoShow: true,        
    closable: false,
    initComponent: function() {        
        var sitestore = Ext.create('Ext.data.Store',{
            autoLoad: true,
            fields:[
                {name: 'id'},
                {name: 'name'}
            ],
            proxy: {
                type: 'ajax',
                url: 'json/dc/findall.php',                
                reader:{
                    type: 'json',
                    root: 'items'
                }
            }            
        });

        var sitecombo = Ext.create('Ext.form.field.ComboBox',{                        
            name: 'dc',
            fieldLabel: 'DC',
            valueField: 'id',
            displayField: 'name',
            store: sitestore
        })
        
        this.items = [
            {
                xtype: 'form',                
                bodyPadding: 10,                                
                items: [
                    {
                        xtype: 'textfield',
                        name: 'username',
                        id: 'username',
                        itemId: 'username',
                        fieldLabel: 'Username',
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        name: 'password',
                        id: 'password',
                        itemId: 'password',
                        fieldLabel: 'Password',
                        inputType: 'password',
                        allowBlank: false
                    },{
                        xtype: sitecombo
                    }
                ]
            }
        ];
        
        this.buttons = [
            {
                text: 'Login',
                handler: function(button){
                    var win = button.up('window');
                    var formlogin = win.down('form');
                    formlogin.getForm().submit({
                        url: 'login.php',
                        waitMsg: 'Processing...',
                        success: function(form, action){                           
                            window.location = 'mainpage.php';                            
                        },
                        failure: function(form, action){
                            Ext.Msg.alert('Failure', action.result.errorMessage);
                        }
                    });
                }
            },
            {
                text: 'Cancel',
                scope: this,
                handler: this.close
            }
        ];
        
        this.callParent(arguments);
    }
});
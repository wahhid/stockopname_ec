Ext.define('App.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'border',
    items: [
        {
            itemId: 'header',            
            title: 'Stock Opnam Application',
            region: 'north'
        },
        {
            itemId: 'nav',
            xtype: 'treepanel',
            title: 'Navigation',
            margins: '5 0 5 5',
            collapsible: true,
            region: 'west',
            width: 200,
            rootVisible: false,
            root: {
                text: '.',
                children: [
                    {
                        text: 'Menu',                
                        children: [                    
                            { text: "Dc List", panel: 'DcList', icon: 'images/icon01/list_components.gif' , leaf: true },
                            { text: "Bin List", panel: 'BinList', icon: 'images/icon01/list_extensions.gif' , leaf: true },
                            { text: "Product List", panel: 'ProductList', icon: 'images/icon01/list_packages.gif' , leaf: true },
                            { text: "Periode List", panel: 'PeriodeList', icon: 'images/icon01/calendar.gif', leaf: true },                                                
                            { text: "User List", panel: 'UserList', icon: 'images/icon01/list_users.gif', leaf: true }
                        ]                        
                    }
                ]                
            },
            dockedItems:[
                {
                    xtype: 'toolbar',
                    items:{
                        text: 'Logout',
                        handler: function(){
                            Ext.Msg.confirm('Confirmation','Are you sure to logout ?',function(btn){                                    
                                if(btn==='yes'){
                                        Ext.Ajax.request({
                                            url: 'logout.php',                                
                                            method: 'POST',
                                            success: function(response, opts){
                                                window.location = 'index.php';    
                                            }
                                        });                                         
                                }
                            });                                
                            
                        }
                    }
                }
            ]            
        },
        {
            itemId: 'tabs',
            xtype: 'tabpanel',
            region: 'center',
            margins: '5 5 5 5'
        }
    ]
});
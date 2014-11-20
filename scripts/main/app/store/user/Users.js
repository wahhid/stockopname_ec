Ext.define('App.store.user.Users',{
    extend: 'Ext.data.Store',
    model: 'App.model.user.User',
    autoLoad: true,
    pageSize: 25,
    proxy: {
        type: 'ajax',
        url: 'json/user/findpaging.php',
        reader: {
            type: 'json',
            root: 'items',
            totalProperty: 'totalItem'
        },
        remoteSort: true,
        sorters:[
            {
                property: 'fullname',
                direction: 'ASC'
            }
        ]            
    }
    
})


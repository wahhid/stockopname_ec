Ext.define('App.view.user.Grid',{    
    extend: 'Ext.grid.Panel',
    alias: 'widget.usergrid',
    border: false,
    layout : 'fit',
    scrolable : true,
    store: 'Users',
    columns: [
        {header: 'User Name',  dataIndex: 'username',  width: 100},
        {header: 'Full Name', dataIndex: 'fullname', flex: 1},
        {header: 'Type', dataIndex: 'usertype', width: 100},
    ]           
    
});

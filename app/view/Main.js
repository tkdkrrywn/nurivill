Ext.define('NuriVill.view.Main', {
    extend: 'Ext.Container',
    alias: 'widget.mainview',

    requires :['NuriVill.view.ProductMap'],
    
    id: 'mainview',

    config: {
        layout:'card',
        title: '최신매물',
        iconCls: 'home',
        items: [
            { xtype: 'productmap' }
        ]
        
    },
    initialize: function(){
        //console.log("Viewport gestartet");
        //var me = this;
        //me.callParent(); // this is important 
    }
});
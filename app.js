Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Ext.plugin': 'lib/plugin'
});

Ext.application({
   
    name: 'NuriVill',



     requires: ['Ext.Map'],


    models: [],
    stores: ['ProductMaps'],
    views: ['Home', 'Main'],

    controllers: ['Main','ProductMap'],

    launch: function() {
        //window[this.getName()].app = this;
        Ext.create('NuriVill.view.Home');
    }
});

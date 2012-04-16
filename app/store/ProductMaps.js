Ext.define('NuriVill.store.ProductMaps', {
    extend: 'Ext.data.Store',

    config: {
        model: 'NuriVill.model.ProductMap',

        proxy:{
        	type:'jsonp',
        	url :'http://127.0.0.1/nurivill/data/product.json',
        	reader:{
        		type:'json',
        		rootProperty:'data'
        	}
        }
    }
});
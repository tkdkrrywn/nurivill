/**
 * @class NuriVill.controller.Home
 * @extends Ext.app.Controller
 * @author Nuri Villa <nurivill@gmail.com>
 *
 * The home controller
 */
Ext.define('NuriVill.controller.Home', {
    extend: 'Ext.app.Controller',

    config: {
        apiUrl: 'http://api.npr.org/query',
        apiKey: 'MDA4ODE2OTE5MDEzMjYwODI4NDdiOGU5Yw001',
        numResults: 10,

        refs: {
            home: {
                xtype: 'home',
                selector: 'home',
                autoCreate: true
            },
            drawer : {
                xtype: 'drawer',
                selector: 'drawer',
                autoCreate: true
            },
            favorites : {
                xtype   : 'favorites',
                selector: 'favorites',
                autoCreate:true
            },
            search : {
                xtype: 'search',
                selector: 'search',
                autoCreate: true
            },
            about   : {
                xtype: 'aboutpanel',
                selector: 'aboutpanel',
                autoCreate: true
            },
            mainFlow : {
                xtype: 'mainflow',
                selector: 'home mainflow'
            }
        },
        control: {
            'home toolbar button[action=globaltoc]': {
                tap     : 'onShowGlobalToc'
            },
            'home toolbar button[action=favorites]': {
                tap     : 'onFavoritesTap'
            },
            'home toolbar button[action=search]': {
                tap     : 'onSearchTap'
            },
            'genretoc'  : {
                featuredtap : 'onShowArticle',
                storytap    : 'onShowArticle'
            },
            'articlepreview': {
                readarticle : 'onShowArticle'
            },
            'drawer'  : {
                itemtap       : 'showGenre',
                favoritestap  : 'onFavoritesTap',
                searchtap     : 'onSearchTap'
            },
            'globaltoc'  : {
                storytap    : 'onShowArticle'
            }
        }
    },

    loadMask: undefined,
    

    init: function () {
        console.log('000000');

        var me = this,
            drawer = me.getDrawer();

        me.db = Ext.create('Ext.util.MixedCollection');

        me.loadMask = Ext.create('Ext.LoadMask', {
            message: 'Curating content...'
        });
        Ext.Viewport.add(me.loadMask);
        me.loadMask.show();

        drawer.getStore().load(me.onGenresLoaded,me);
    },

    startApp: function () {
        var me = this,
            home = me.getHome(),
            drawer = me.getDrawer(),
            mainFlow = me.getMainFlow();

        //adding all the articles to the main flow
        drawer.getStore().each(function (genre) {
            var articles = me.db.get(genre.getId());

            //console.log(articles);



            genre.set('image',articles.getAt(0).get('image'));
            mainFlow.addArticles(genre,articles);
        });
        mainFlow.setFeatured();

        mainFlow.add(me.getFavorites());
        mainFlow.add(me.getSearch());

        Ext.Viewport.add(home);
        Ext.Viewport.add(me.getDrawer());

        drawer.addArticles();

        me.loadMask.hide();
    },

    onGenresLoaded    : function(){
        var me = this,
        drawer = me.getDrawer();
        drawer.getStore().each(function(record) {
            if(record.get('key') !== 'featured'){
                me.loadData(record.getId());
            }
        },me);
    },

    loadData: function (genreId) {
        var me = this,
            ts = localStorage.getItem('timestamp-' + genreId);
            needRefresh = !ts || (parseInt(Ext.Date.format(new Date(), 'ymd'),10) > parseInt(ts,10));


        if (needRefresh) {
            Ext.util.JSONP.request({
                url: me.getApiUrl(),
                callback: Ext.Function.pass(me.saveData, [genreId]),
                scope: me,
                callbackKey: 'callback',
                params: {
                    apiKey: me.getApiKey(),
                    id: genreId,
                    requiredAssets: 'audio,image',
                    numResults: me.getNumResults(),
                    transform: 'source',
                    output: 'JSON'
                }
            });
        } else {
            me.importDataToStore(genreId);
        }
    },

    saveData: function (genreId, success ,data) {
        var list = data.list.story,
            drawer = this.getDrawer(),
            genre = drawer.getStore().getById(genreId);

        for (var i = 0, len = list.length; i < len; i++) {
            list[i].genre = genre.get('name');
            list[i].genreKey = genre.get('key');
        }

        localStorage.setItem('timestamp-' + genreId, Ext.Date.format(new Date(), 'ymd'));
        localStorage.setItem('articles-' + genreId, Ext.encode(data.list.story));

        this.importDataToStore(genreId, data.list.story);
    },

    importDataToStore: function (genreId, data) {
        var me = this,
            store, records,
            drawer = me.getDrawer();

        if (!data) {
            data = Ext.decode(localStorage.getItem('articles-' + genreId));
        }

        if (!me.db.containsKey(genreId)) {
            store = Ext.create('NuriVill.store.Articles');
            me.db.add(genreId, store);
        } else {
            store = me.db.get(genreId);
        }

        store.setData(data);

        //remove articles without primary image
        var toRemove = [];
        store.each(function(article){
            if(!article.get('image')){
                toRemove.push(article);
            }
        });
        store.remove(toRemove);

        //Start the app when the last genre is loaded
        if (me.db.getCount() === drawer.getStore().getCount()) {
            me.startApp();
        }
    },

    // when user taps on any genre from the drawer
    showGenre: function(id, genre) {
        var me = this,
            home = me.getHome(),
            mainFlow = me.getMainFlow(),
            genreKey = genre.get('key') || genre.get('genreKey'),
            view = mainFlow.down('#' + genreKey);
        
        home.setActiveItem(mainFlow);
        mainFlow.setActiveItem(view);
    },

    // when a user taps on the "Read & Listen"
    onShowArticle: function(record) {
        var me = this,
            mainFlow = me.getMainFlow(),
            article = mainFlow.down('#article-'+(Ext.isNumber(record)?record:record.getId()));

        mainFlow.setActiveItem(article);
    },

    onFavoritesTap: function(){
        var me = this,
            mainFlow = me.getMainFlow(),
            fav = mainFlow.down('favorites');

        mainFlow.setActiveItem(fav);
    },

    onSearchTap: function(){
        var me = this,
            mainFlow = me.getMainFlow(),
            search = mainFlow.down('search');

        mainFlow.setActiveItem(search);
    },

    onShowGlobalToc : function(){
        var me = this,
            mainFlow = me.getMainFlow(),
            view = mainFlow.down('globaltoc');
        
        mainFlow.setActiveItem(view);
    }
});

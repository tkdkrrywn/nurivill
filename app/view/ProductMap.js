Ext.define('NuriVill.view.ProductMap', {
    extend: 'Ext.Panel',
    alias: 'widget.productmap',
    
    id: 'productmap',

    requires:['NuriVill.store.ProductMaps'],

    config: {
      layout: 'fit',
        flex: 2,
        items: [
                { 
                xtype: 'map',
                useCurrentLocation: true, // gps 좌표 로 이동 하는 것
               
                mapOptions : {
                center : new google.maps.LatLng(37.57603, 126.97691),  //nearby San Fran
                zoom : 18,
                mapTypeId : google.maps.MapTypeId.ROADMAP,
                navigationControl: false
                /*navigationControl: false,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.DEFAULT
                }*/
            },
/*
             plugins : [
                new Ext.plugin.google.Tracker({
                    trackSuspended: true,   //suspend tracking initially
                    allowHighAccuracy: false,
                    marker: new google.maps.Marker({
                        position: new google.maps.LatLng(37.57603, 126.97691),
                        title: 'My Current Location'//,
                        //shadow: shadow,
                        //icon: image
                    })
                }),
                new Ext.plugin.google.Traffic()
            ],
*/
            listeners: {
                   /* painted: function(map) {
                        record = map.getData();
                    }*/

                    maprender: function(comp, map) {

                        console.log(map);

                    var pos = new google.maps.LatLng(37.57603, 126.97691);

                    var latlngbounds = new google.maps.LatLngBounds();

                    var p = latlngbounds.getSouthWest().lng();

                    var infoBubble = new InfoBubble({
                      map: map,
                      content: '',
                      //position: new google.maps.LatLng(-35, 151),
                      shadowStyle: 3,
                      padding: 0,
                      backgroundColor: 'rgb(57,57,57)',
                      borderRadius: 4,
                      arrowSize: 10,
                      borderWidth: 1,
                      borderColor: '#2c2c2c',
                      disableAutoPan: true,
                      hideCloseButton: true,
                      arrowPosition: 50,
                      backgroundClassName: 'phoney',
                      arrowStyle: 0
                    });

                    function HideShadowPane() {};

                    HideShadowPane.prototype = new google.maps.OverlayView();

                    HideShadowPane.prototype.onAdd = function() {
                        this.realZIndex_ =  this.getPanes().floatShadow.style.zIndex;
                        this.getPanes().floatShadow.style.zIndex = 0;
                    }

                    HideShadowPane.prototype.draw = function() {};

                    HideShadowPane.prototype.onRemove = function() {
                        this.getPanes().floatShadow.style.zIndex = this.realZIndex_;
                    }



                   // map.prototype.ARROW_STYLE_ = 0;

                    /*    
                    var p = pos.getBounds().getSouthWest().lng();
                        var o = pos.getBounds().getSouthWest().lat();
                        var m = pos.getBounds().getNorthEast().lng();
                        var k = pos.getBounds().getNorthEast().lat();
                    */
                    var infowindow = new google.maps.InfoWindow({content: "",maxWidth: 300});
                    var C = new google.maps.MarkerImage("data/images/ico_location02.png", new google.maps.Size(32, 31), new google.maps.Point(0, 0), new google.maps.Point(16, 31)),
                    W = new google.maps.MarkerImage("http://mobile.ctfishfinder.com/images/markers/marker-shadow.png", new google.maps.Size(38, 25), new google.maps.Point(0, 0), new google.maps.Point(8, 22));
                    
                    navigator.geolocation.getCurrentPosition(function(position) {
                        _position = position;


                    });    

                                            var geoLocationResult = '<div class="phoneytext"><table class="positionTable">' +
'<tr><th>Latitude</th><td>' + this._geo.getLatitude() + '</td></tr>' +
'<tr><th>Longitude</th><td>' + this._geo.getLongitude() + '</td></tr>' +
'<tr><th>Accuracy</th><td>' + this._geo.getAccuracy() + '</td></tr>' +
//'<tr><th>Altitude Accuracy</th><td>' + position.coords.altitudeAccuracy + '</td></tr>' +
//'<tr><th>Heading</th><td>' + position.coords.heading + '</td></tr>' +
//'<tr><th>Speed</th><td>' + position.coords.speed + '</td></tr>' +
//'<tr><th>Timestamp</th><td>' + new Date(position.timestamp) + '</td></tr>' +
'</table></div>';

                    var marker = new google.maps.Marker({
                        //position: pos,
                        position : new google.maps.LatLng(this._geo.getLatitude(), this._geo.getLongitude()),
                        title : 'latlngbounds',
                        icon : C,
                        map: map
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        //infowindow.content = geoLocationResult;
                        //infowindow.open(map, marker);

                        infoBubble.content = geoLocationResult;
                        infoBubble.open(map, marker);

                        var bnds = pos.getBounds().getSouthWest().lng();

                        console.log(bnds);
                        
                        //O.open(map, marker);
                    });

                    google.maps.event.addListener(map, 'click', function() {
                    infowindow.close();
                    infoBubble.close();
                    });

                   // hiddenShadow = new HideShadowPane();
                   // hiddenShadow.setMap(map);


                }
             
                },

                centerchange: function (comp, map) {

                }
            }]
    },
    
    initialize: function(){
        var me = this;
        me.on('painted', 'updateLocation', me);
        me.callParent(); // this is important 

        var store = Ext.getStore('Nurivill.store.ProductMaps');

        console.log(store);

        store.each(function(record) {
            console.log('dafadfdfadsf')
        });
        
    },

    updateLocation : function() {
        console.log(store);
        //this.getCurrentLocation().updateLocation();
       // console.log('Latitude: ' + geo.getLatitude() + ' & Longitude: ' + geo.getLongitude());
    }
});


 /*
        _locationCallbackStack: [];

        getDeviceLocation: function (a) {
        if (!navigator.device) {
            console.log("Couldn't fetch current location, PhoneGap not enabled");
            return
        }
        if (a) {
            this._locationCallbackStack.push(a)
        }
        navigator.geolocation.getCurrentPosition(function (b) {
            if (Getographer.loggedIn()) {
                var e = Ext.ModelMgr.create({
                    deviceId: Getographer.getDeviceToken(),
                    location: b,
                    platform: navigator.device.platform,
                    scenario: "application"
                }, "DeviceLocation");
                e.save({
                    success: function (c) {
                        console.log("getDeviceLocation: new instance saved successfully");
                        Getographer.fireEvent("locationLoaded", c)
                    },
                    failure: function (c) {
                        console.log("failure" + c.message)
                    }
                })
            }
            var d = Getographer._locationCallbackStack.length;
            if (d > 0) {
                console.log("getDeviceLocation: running " + d + " callbacks");
                for (var f = 0; f < d; f++) {
                    Getographer._locationCallbackStack[f](b)
                }
                Getographer._locationCallbackStack = []
            }
        }, function (b) {
            console.log("navigator.geolocation.getCurrentPosition Error:" + b);
            Getographer._locationCallbackStack = []
        }, {
            enableHighAccuracy: true,
            maximumAge: 60000,
            timeout: 10000
        })
    }*/

/*
       var infowindow = new google.maps.InfoWindow({
    content: '<img style="float:left; width:100px; height:60px; margin-right: 5px; margin-bottom: 15px;" src="http://photos.cityvox.com/photos_crop/134/204/445574_190x125_.jpg" >'+
             '<div style="font-size: 12px;"><p style="color: red";>' +
             'Le Sofa<br/>Bar-Restaurant</p><br/>21, rue Saint-Sabin,'+
             '<br/>Paris 75011<br/> <a href="tel:01 43 14 07 46">Tél: 01 43 14 07 46</a>'
});*/
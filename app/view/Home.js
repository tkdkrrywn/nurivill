/**
 * @class NuriVill.view.Home
 * @extends Ext.Panel
 * @author Nuri Villa <nurivill@gmail.com>
 *
 * Description
 */
Ext.define('NuriVill.view.Home',{
    extend: 'Ext.tab.Panel',
    xtype	: 'home',
    requires: ['NuriVill.view.Main'],

    config : {
	 fullscreen: true,
	tabBarPosition: 'bottom',
	items: [
	    {xtype: 'mainview'}
	]
    }
});
Ext.define('Ext.ux.Date', {
    extend: 'Ext.picker.Picker',
    xtype: 'datepicker',
    alternateClassName: 'Ext.DatePicker',
    requires: ['Ext.DateExtras'],

    config: {
        yearFrom: 0,
        yearTo: 20,
        monthText: 'Month',
        dayText: 'Day',
        yearText: 'Year',
        slotOrder: ['year', 'month', 'day']
    },

    initialize: function() {
        this.callParent();

        this.on({
            scope: this,
            delegate: '> slot',
            slotpick: this.onSlotPick
        });
    },

    setValue: function(value, animated) {
        if (Ext.isObject(value)) {
            value = {
                day  : value,
                month: value,
                year : value
            };
        }

        this.callParent([value, animated]);
    },

    getValue: function() {
        var values = {},
            daysInMonth, day, month, year,
            items = this.getItems().items,
            ln = items.length,
            item, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item instanceof Ext.picker.Slot) {
                values[item.getName()] = item.getValue();
            }
        }

        if (values.year === null && values.month === null && values.day === null) {
            return null;
        }

        year = Ext.isNumber(values.year) ? values.year : 1;
        month = Ext.isNumber(values.month) ? values.month : 1;
        day = Ext.isNumber(values.day) ? values.day : 1;

		return year+'억'+Number(month+day) + '만원';
    },

    /**
     * Updates the yearFrom configuration
     */
    updateYearFrom: function() {
        if (this.initialized) {
            this.createSlots();
        }
    },

    /**
     * Updates the yearTo configuration
     */
    updateYearTo: function() {
        if (this.initialized) {
            this.createSlots();
        }
    },

    /**
     * Updates the monthText configuration
     */
    updateMonthText: function(newMonthText, oldMonthText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if ((typeof item.title == "string" && item.title == oldMonthText) || (item.title.html == oldMonthText)) {
                    item.setTitle(newMonthText);
                }
            }
        }
    },

    /**
     * Updates the dayText configuraton
     */
    updateDayText: function(newDayText, oldDayText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if ((typeof item.title == "string" && item.title == oldDayText) || (item.title.html == oldDayText)) {
                    item.setTitle(newDayText);
                }
            }
        }
    },

    /**
     * Updates the yearText configuration
     */
    updateYearText: function(yearText) {
        
		//console.log('updateYearText'+yearText);

		var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if (item.title == this.yearText) {
                    item.setTitle(yearText);
					console.log('updateYearText'+yearText);
                }
            }
        }
    },

    // @private
    constructor: function() {
        this.callParent(arguments);
        this.createSlots();
    },

    /**
     * Generates all slots for all years specified by this component, and then sets them on the component
     * @private
     */
    createSlots: function() {
        var me        = this,
            slotOrder = this.getSlotOrder(),
            yearsFrom = me.getYearFrom(),
            yearsTo   = me.getYearTo(),
            years     = [],
            days      = [],
            months    = [],
            ln, tmp, i,
            daysInMonth;

        // swap values if user mixes them up.
        if (yearsFrom > yearsTo) {
            tmp = yearsFrom;
            yearsFrom = yearsTo;
            yearsTo = tmp;
        }

        for (i = yearsFrom; i <= yearsTo; i++) {
            years.push({
//                text: i,
//                value: i
				    text: i+'억',
                    value: i
            });
        }

//        daysInMonth = this.getDaysInMonth(1, new Date().getFullYear());

        //for (i = 0; i < daysInMonth; i++) {
		 for (i = 0; i <= 9; i++) {
            days.push({
//                text: i + 1,
//                value: i + 1
				    text: i*100+'만원',
                    value: i*100
            });
        }

        //for (i = 0, ln = Ext.Date.monthNames.length; i < ln; i++) {
		for (i = 0; i <= 9; i++) {
            months.push({
//                text: Ext.Date.monthNames[i],
//                value: i + 1
					 text: i*1000+'만원',
					 value: i*1000
            });
        }

        var slots = [];

        slotOrder.forEach(function(item) {
            slots.push(this.createSlot(item, years, months, days));
        }, this);

        me.setSlots(slots);
    },

    /**
     * Returns a slot config for a specified date.
     * @private
     */
    createSlot: function(name, years, months, days) {
        switch (name) {
            case 'year':
                return {
                    name: 'year',
                    align: 'center',
                    data: years,
                    title: this.getYearText(),
                    flex: 1
                };
            case 'month':
                return {
                    name: name,
                    align: 'right',
                    data: months,
                    title: this.getMonthText(),
                    flex: 2
                };
            case 'day':
                return {
                    name: 'day',
                    align: 'center',
                    data: days,
                    title: this.getDayText(),
                    flex: 2
                };
        }
    },

    onSlotPick: function() {
        var value = this.getValue(),
            slot = this.getDaySlot(),
//            year = value.getFullYear(),
//            month = value.getMonth(),
//            days = [],
			year, month, days=[],
            selected = slot,
            daysInMonth, i;

			console.log('onSlotPick');

        if (!value || !Ext.isObject(value) || !slot) {
            return;
        }

        //get the new days of the month for this new date
//        daysInMonth = this.getDaysInMonth(month + 1, year);
//        for (i = 0; i < daysInMonth; i++) {
//            days.push({
//                text: i + 1,
//                value: i + 1
//            });
//        }

        // We dont need to update the slot days unless it has changed
        if (slot.getData().length == days.length) {
            return;
        }

        // Now we have the correct amounnt of days for the day slot, lets update it
        var store = slot.getStore(),
            viewItems = slot.getViewItems(),
            valueField = slot.getValueField(),
            index, item;

        //slot.setData(days);

        index = store.find(valueField, value.getDate());
        if (index == -1) {
            return;
        }

        item = Ext.get(viewItems[index]);

        slot.selectedIndex = index;
        slot.scrollToItem(item);

        slot._value = value;
    },

    getDaySlot: function() {
        var innerItems = this.getInnerItems(),
            ln = innerItems.length,
            i, slot;

        if (this.daySlot) {
            return this.daySlot;
        }

        for (i = 0; i < ln; i++) {
            slot = innerItems[i];
            if (slot.isSlot && slot.getName() == "day") {
                this.daySlot = slot;
                return slot;
            }
        }

        return null;
    },

    // @private
    getDaysInMonth: function(month, year) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return month == 2 && this.isLeapYear(year) ? 29 : daysInMonth[month-1];
    },

    // @private
    isLeapYear: function(year) {
        return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
    }
});

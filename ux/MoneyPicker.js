/**
This is a specialized field which shows a {@link Ext.ux.Date} when tapped. If it has a predefined value,
or a value is selected in the {@link Ext.ux.Date}, it will be displayed like a normal {@link Ext.field.Text}
(but not selectable/changable).

    Ext.create('Ext.field.DatePicker', {
        label: 'Birthday',
        value: new Date()
    });

{@link Ext.field.DatePicker} fields are very simple to implement, and have no required configurations.

## Examples

It can be very useful to set a default {@link #value} configuration on {@link Ext.field.DatePicker} fields. In
this example, we set the {@link #value} to be the current date. You can also use the {@link #setValue} method to
update the value at any time.

    @example miniphone preview
    Ext.create('Ext.form.Panel', {
        fullscreen: true,
        items: [
            {
                xtype: 'fieldset',
                items: [
                    {
                        xtype: 'datepickerfield',
                        label: 'Birthday',
                        name: 'birthday',
                        value: new Date()
                    }
                ]
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [
                    { xtype: 'spacer' },
                    {
                        text: 'setValue',
                        handler: function() {
                            var datePickerField = Ext.ComponentQuery.query('datepickerfield')[0];

                            var randomNumber = function(from, to) {
                                return Math.floor(Math.random() * (to - from + 1) + from);
                            };

                            datePickerField.setValue({
                                month: randomNumber(0, 11),
                                day  : randomNumber(0, 28),
                                year : randomNumber(1980, 2011)
                            });
                        }
                    },
                    { xtype: 'spacer' }
                ]
            }
        ]
    });

When you need to retrieve the date from the {@link Ext.field.DatePicker}, you can either use the {@link #getValue} or
{@link #getFormattedValue} methods:

    @example preview
    Ext.create('Ext.form.Panel', {
        fullscreen: true,
        items: [
            {
                xtype: 'fieldset',
                items: [
                    {
                        xtype: 'datepickerfield',
                        label: 'Birthday',
                        name: 'birthday',
                        value: new Date()
                    }
                ]
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [
                    {
                        text: 'getValue',
                        handler: function() {
                            var datePickerField = Ext.ComponentQuery.query('datepickerfield')[0];
                            Ext.Msg.alert(null, datePickerField.getValue());
                        }
                    },
                    { xtype: 'spacer' },
                    {
                        text: 'getFormattedValue',
                        handler: function() {
                            var datePickerField = Ext.ComponentQuery.query('datepickerfield')[0];
                            Ext.Msg.alert(null, datePickerField.getFormattedValue());
                        }
                    }
                ]
            }
        ]
    });


 */
Ext.define('Ext.ux.MoneyPicker', {
    extend: 'Ext.field.Text',
    alternateClassName: 'Ext.ux.MoneyPicker',
    xtype: 'moneypickerfield',
    requires: [
        'Ext.ux.Date',
        'Ext.DateExtras'
    ],

    /**
     * @event change
     * Fires when a date is selected
     * @param {Ext.field.DatePicker} this
     * @param {Date} date The new date
     */

    config: {
        ui: 'select',

        /**
         * @cfg {Object/Ext.ux.Date} picker
         * An object that is used when creating the internal {@link Ext.ux.Date} component or a direct instance of {@link Ext.ux.Date}
         * Defaults to true
         * @accessor
         */
        picker: true,

        /**
         * @cfg {Boolean}
         * @hide
         * @accessor
         */
        clearIcon: false,

        /**
         * @cfg {Object/Date} value
         * Default value for the field and the internal {@link Ext.ux.Date} component. Accepts an object of 'year',
         * 'month' and 'day' values, all of which should be numbers, or a {@link Date}.
         *
         * Example: {year: 1989, day: 1, month: 5} = 1st May 1989 or new Date()
         * @accessor
         */

        /**
         * @cfg {Boolean} destroyPickerOnHide
         * Whether or not to destroy the picker widget on hide. This save memory if it's not used frequently,
         * but increase delay time on the next show due to re-instantiation. Defaults to false
         * @accessor
         */
        destroyPickerOnHide: false,

        /**
         * @cfg {String} dateFormat The format to be used when displaying the date in this field.
         * Accepts any valid date format. You can view formats over in the {@link Ext.Date} documentation.
         * Defaults to `Ext.util.Format.defaultDateFormat`.
         */
        dateFormat: null,

        /**
         * @cfg {Object}
         * @hide
         */
        component: {
            useMask: true
        }
    },

    initialize: function() {
        this.callParent();

        this.getComponent().on({
            scope: this,

            masktap: 'onMaskTap'
        });

        this.getComponent().input.dom.disabled = true;
    },

    syncEmptyCls: Ext.emptyFn,

    applyValue: function(value) {
		console.log("applyValue :"+value);
//        if (!Ext.isObject(value)) {
//            value = null;
//        }

        if (Ext.isObject(value)) {
           value = '11111';
		   // value = new Date(value.year, value.month - 1, value.day);
        }
		//console.log("applyValue :"+value);
        
		
		return value;
    },

    // @inherit
    updateValue: function(newValue) {
		var picker = this._picker;
        if (picker && picker.isPicker) {
            picker.setValue(newValue);
        }

        // Ext.Date.format expects a Date
        if (newValue !== null) {
            //this.getComponent().setValue(Ext.Date.format(newValue, this.getDateFormat() || Ext.util.Format.defaultDateFormat));
			this.getComponent().setValue(newValue);
        } else {
            this.getComponent().setValue('0');
        }

        if (this._picker && this._picker instanceof Ext.ux.Date) {
            this._picker.setValue(newValue);
        }
    },

    /**
     * Updates the date format in the field.
     * @private
     */
    updateDateFormat: function(newDateFormat, oldDateFormat) {
        var value = this.getValue();
        if (newDateFormat != oldDateFormat && Ext.isDate(value) && this._picker && this._picker instanceof Ext.ux.Date) {
            this.getComponent().setValue(Ext.Date.format(value, newDateFormat || Ext.util.Format.defaultDateFormat));
        }
    },

    /**
     * Returns the {@link Date} value of this field.
     * If you wanted a formated date
     * @return {Date} The date selected
     */
    getValue: function() {
        if (this._picker && this._picker instanceof Ext.ux.Date) {
			console.log("getValue :"+this._picker.getValue());
			return this._picker.getValue();
        }
		
        return this._value;
    },

    /**
     * Returns the value of the field formatted using the specified format. If it is not specified, it will default to
     * {@link #dateFormat} and then {@link Ext.util.Format#defaultDateFormat}.
     * @param {String} format The format to be returned
     * @return {String} The formatted date
     */
    getFormattedValue: function(format) {
        var value = this.getValue();
       // return (Ext.isDate(value)) ? Ext.Date.format(value, format || this.getDateFormat() || Ext.util.Format.defaultDateFormat) : value;
	   return (Ext.isObject(value)) ? value: value;
    },

    applyPicker: function(picker, pickerInstance) {
        if (pickerInstance && pickerInstance.isPicker) {
            picker = pickerInstance.setConfig(picker);
        }

        return picker;
    },

    getPicker: function() {
        var picker = this._picker;

        if (picker && !picker.isPicker) {
            picker = Ext.factory(picker, Ext.ux.Date);
            picker.on({
                scope: this,

                change: 'onPickerChange',
                hide  : 'onPickerHide'
            });
            picker.hide();
            picker.setValue(this.getValue());
            Ext.Viewport.add(picker);
            this._picker = picker;
        }

        return picker;
    },

    /**
     * @private
     * Listener to the tap event of the mask element. Shows the internal DatePicker component when the button has been tapped.
     */
    onMaskTap: function() {
        if (this.getDisabled()) {
            return false;
        }

        if (this.getReadOnly()) {
            return false;
        }

        this.getPicker().show();

        return false;
    },

    /**
     * Called when the picker changes its value
     * @param {Ext.ux.Date} picker The date picker
     * @param {Object} value The new value from the date picker
     * @private
     */
    onPickerChange: function(picker, value) {
        var me = this;

        me.setValue(value);
        me.fireEvent('change', me, me.getValue());
		console.log("onPickerChange :"+value);

    },

    /**
     * Destroys the picker when it is hidden, if
     * {@link Ext.field.DatePicker#destroyPickerOnHide destroyPickerOnHide} is set to true
     * @private
     */
    onPickerHide: function() {
        var picker = this.getPicker();

        if (this.getDestroyPickerOnHide() && picker) {
            picker.destroy();
            this.setPicker(null);
        }
    },

    reset: function() {
        this.setValue(this.originalValue);
    },

    // @private
    destroy: function() {
        var picker = this.getPicker();

        if (picker) {
            picker.destroy();
        }

        this.callParent(arguments);
    }
    //<deprecated product=touch since=2.0>
}, function() {
    this.override({
        getValue: function(format) {
            if (format) {
                //<debug warn>
                Ext.Logger.deprecate("format argument of the getValue method is deprecated, please use getFormattedValue instead", this);
                //</debug>
                return this.getFormattedValue(format);
            }
            return this.callOverridden();
        }
    });

    /**
     * @member Ext.field.DatePicker
     * @method getDatePicker
     * @deprecated 2.0.0 Please use #getPicker instead
     */
    Ext.deprecateMethod(this, 'getDatePicker', 'getPicker');
    //</deprecated>
});

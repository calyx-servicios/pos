odoo.define('pos_customer_required.custom_credit_alert', function (require) {
    "use strict";

    var core = require('web.core');
    var screens = require('point_of_sale.screens');

    screens.PaymentScreenWidget.include({
        validate_order: function(options) {
            if (
                this.pos.config.is_required_customer &&
                !this.pos.get_order().get_client()
            ) {
                alert("Please, select a customer for this order.");
                return;
            }
            return this._super(options);
        },
    });

});

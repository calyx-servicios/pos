odoo.define("pos_customer_required.screens", function(require) {
    "use strict";

    const screens = require("point_of_sale.screens");
    const core = require("web.core");
    const _t = core._t;

    screens.PaymentScreenWidget.include({
        validate_order: function(options) {
            if (
                this.pos.config.is_required_customer &&
                !this.pos.get_order().get_client()
            ) {
                this.gui.show_popup("error", {
                    title: _t("An anonymous order cannot be confirmed"),
                    body: _t("Please select a customer for this order."),
                });
                return;
            }
            return this._super(options);
        },
    });

    return screens;
});

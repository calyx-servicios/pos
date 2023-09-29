odoo.define("pos_customer_required.gui", function (require) {
    "use strict";

    const gui = require("point_of_sale.gui");
    const fields = require("web.field_registry");


    const _show_screen_ = gui.Gui.prototype.show_screen;

    gui.Gui.prototype.show_screen = function (screen_name, params, refresh) {

        if (
            screen_name !== "clientlist" && 
            !this.pos.get_order().get_client() && 
            !this.pos.config.is_required_customer 
        ) {
            _show_screen_.call(this, screen_name, params, refresh);
            
            screen_name = "clientlist";
        }

        _show_screen_.call(this, screen_name, params, refresh);
    };

    return gui;
});

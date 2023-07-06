odoo.define('pos_fields_partner.PosModel', function (require) {
"use strict";

    var pos_model = require('point_of_sale.models');
    var PosModelSuper = pos_model.PosModel;
    var screens = require('point_of_sale.screens');

    pos_model.load_fields('res.partner', ['mag_dob',]);

    pos_model.PosModel = pos_model.PosModel.extend({
        initialize: function(session, attributes) {
            PosModelSuper.prototype.initialize.call(this, session, attributes)
            this.mag_dob = "";
        },
    });

    screens.ClientListScreenWidget.include({
        save_client_details: function (partner) {
            var self = this;
            var fields = {};
            this.$('.client-details-contents .detail').each(function(idx,el){
                if (self.integer_client_details.includes(el.name)){
                    var parsed_value = parseInt(el.value, 10);
                    if (isNaN(parsed_value)){
                        fields[el.name] = false;
                    }
                    else{
                        fields[el.name] = parsed_value
                    }
                }
                else{
                    fields[el.name] = el.value || false;
                }
            });
            this._super(partner);
        },
    });
});


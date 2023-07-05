odoo.define('pos_customer_info', function (require) {
    var models = require('point_of_sale.models');
    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var rpc = require('web.rpc');
    var qweb = core.qweb;


    var _super_Order = models.Order.prototype;
    models.Order = models.Order.extend({
        initialize: function () {
            _super_Order.initialize.apply(this, arguments);
        },
        init_from_JSON: function (json) {
            var res = _super_Order.init_from_JSON.apply(this, arguments);
        }
    });

    screens.ReceiptScreenWidget.include({
        print_xml: function () {
            var self = this;
            var order = this.pos.get_order();

            if (this.pos.config.receipt_customer_information && order) {
                var partner = order.get_client();
                self.receipt_data = this.get_receipt_render_env();

                if (partner) {
                    var customerName = partner.name;
                    var identificationType = partner.l10n_latam_identification_type_id[1];
                    var vat = partner.vat;
                    var afipResponsibility = partner.l10n_ar_afip_responsibility_type_id[1];


                    self.receipt_data['order']['customer_name'] = customerName;
                    self.receipt_data['order']['l10n_latam_identification_type'] = identificationType;
                    self.receipt_data['order']['vat'] = vat;
                    self.receipt_data['order']['l10n_ar_afip_responsibility_type_id'] = afipResponsibility;

                    var receiptHtml = qweb.render('XmlReceipt', self.receipt_data );
                    self.pos.proxy.print_receipt(receiptHtml);
                }
            } else {
                return this._super();
            }
        },

        render_receipt: function () {
            var self = this;

            var res = this._super();
            var order = this.pos.get_order();

            if (this.pos.config.receipt_customer_information && order) {
                var partner = order.get_client();

                if (partner) {
                    var customerName = partner.name;
                    var identificationType = partner.l10n_latam_identification_type_id[1];
                    var vat = partner.vat;
                    var afipResponsibility = partner.l10n_ar_afip_responsibility_type_id[1];


                    self.pos.get_order()['customer_name'] = customerName;
                    self.pos.get_order()['l10n_latam_identification_type'] = identificationType;
                    self.pos.get_order()['vat'] = vat;
                    self.pos.get_order()['l10n_ar_afip_responsibility_type_id'] = afipResponsibility;


                    self.$('.pos-receipt-container').html(qweb.render('OrderReceipt', self.get_receipt_render_env()));
                }
            }

            return res;
        },
    });
});

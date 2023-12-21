odoo.define('pos_customer_required.actionpad', function(require){
    "use strict";

    const screens = require('point_of_sale.screens');
    
    screens.ActionpadWidget.include({
        template: 'ActionpadWidget',
        renderElement: function() {
            var self = this;
            this._super();

            this.$('.pay').off('click').on('click', function(){
                
                var order = self.pos.get_order();

                if (self.pos.config.is_required_customer && !order.get_client()) {
                    
                    self.gui.show_popup('error', {
                        'title': 'Cliente requerido',
                        'body': 'Por favor, seleccione un cliente antes de proceder al pago.',
                    });
                } else {
                    self.gui.show_screen('payment');
                }
            });
        },
    });
});

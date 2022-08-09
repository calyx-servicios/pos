odoo.define('pos_ticket_change.barcode_print_change', function(require) {
	"use strict";

	var screens = require('point_of_sale.screens');

	screens.ReceiptScreenWidget.include({
		show: function () {
			this._super(); 
			var order = this.pos.get_order();                     
			$("#barcode_print_change").barcode(
				order.barcode, // Value barcode (dependent on the type of barcode)
				"code128" // type (string)
			);
		},
	});

});
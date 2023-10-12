odoo.define('pos_credit_card_automatic.credit_card_automatic', function (require) {
	"use strict";

	let screens = require('point_of_sale.screens');
	var _t = require('web.core')._t;

	screens.PaymentScreenWidget.include({
	    render_payment_terminal: function() {
	    	let self = this;
	    	let order = this.pos.get_order();
			if (!order || !order.get_client()) {
				this.pos.gui.show_popup('error', {
					'title': _t('Error'),
					'body': _t('Please, select a customer before.'),
				});
				return;
			}

	    	let paymentline = order.selected_paymentline;

	    	if (paymentline) {
	    		let line = order.get_paymentline(paymentline.cid);
	    		this.$el.find('.instalment').change(function(){
	        		if (line.payment_method) {
	        		    let payment_method = line.payment_method;
	        			payment_method['selected'] = $(this).val();
	        		}
	        	});

	        	this.$el.find('#btnData').click(function(){
					var amount = line.get_amount();
					let instalments = line.payment_method.instalments;
					
					for (var obj in instalments){
						let amountCof = amount * instalments[obj]['coefficient'];
						let fee = amountCof - amount;
						$("#selectPopupInstalments").append('<option value="' + instalments[obj]['id'] + '" coef="' + fee + '" amount="' + amountCof + '">' + instalments[obj]['name'] + '</option>');
					};

					var payment_selected = self.$el.find('.instalment').val();
					if (payment_selected) {
						$('#selectPopupInstalments').val(payment_selected);
					} else {
						$('#selectPopupInstalments').val(1);
					}

	        	    let fee = $('#selectPopupInstalments option:selected').attr('coef');
	                let amountCof = $('#selectPopupInstalments option:selected').attr('amount');
	        	    let instalment_id = $('#selectPopupInstalments option:selected').val();
	        	    let product_id = parseInt(line.payment_method.instalment_product_id[0]);
	                let product = self.pos.db.get_product_by_id(product_id);

	        	    paymentline['instalment_id'] = parseInt(instalment_id);
	        	    paymentline['card_number'] = "111111";
	        	    paymentline['tiket_number'] = "1111";
	        	    paymentline['lot_number'] = "1111";
	        	    paymentline['fee'] = fee;

	                order.add_product(product, {extras:{name: 'Cargo Tarjeta'}, price:fee,quantity:1, merge: false});
	           	    paymentline.set_amount(amountCof);
	        	    paymentline.set_payment_status('done');
	        	    self.render_paymentlines();
	        	    order.finalized = true;
				});

	            if (line.payment_method.selected){
	                let payment_selected = line.payment_method.selected;
	            	self.$el.find('.instalment').val(payment_selected);
	            }
	    	}
	    },
	});
});

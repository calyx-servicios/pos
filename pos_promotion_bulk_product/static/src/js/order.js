odoo.define('pos_promotion_bulk_product.order', function (require) {
"use strict";

let models = require('point_of_sale.models');
let Order = models.Order;
let _super = Order.prototype;

models.Order = Order.extend({
    initialize: function(attributes, options){
        _super.initialize.apply(this, arguments);
    },
	apply_promotion_free_combo: function(promotion_lines){
		let self = this;
		let order_lines = self.get_orderlines();
		let product_lines = [];
		let qty_total = 0;
		_.each(order_lines, function(order_line){
            // check if this line is ok to apply
            if (!order_line.get_promotion_id()
                && !order_line.get_condition_promotion_id()) {
                // check if product is product list of promotion program
                _.each(promotion_lines, function(promotion_line){
                    if ((_.has(promotion_line, 'category_id') && order_line.product.categ.id === promotion_line.category_id[0])
                        || (_.has(promotion_line, 'category_id') && order_line.product.categ_bxgy_id[0] === promotion_line.category_id[0])
						|| (_.has(promotion_line, 'season_id') && order_line.product.product_seasons_id[0] === promotion_line.season_id[0])
						|| (_.has(promotion_line, 'brand_id') && order_line.product.brand_id[0] === promotion_line.brand_id[0])) {
						
						product_lines.push({'price': order_line.price, 'order_line':order_line, 'qty':order_line.quantity, 'promotion': promotion_line, 'done': false});
						qty_total += order_line.quantity;
                    }
                })
            }
        });
		product_lines.sort(function (a, b) {
			if (a.price > b.price) {
				return 1;
			}
			if (a.price < b.price) {
				return -1;
			}
			// a must be equal to b
			return 0;
		});
		_.each(promotion_lines, function(promotion_line){
			let promos_qty = 1;
			let qty_discount = promotion_line.bx_qty - promotion_line.fy_qty;
			let promos_qty_apply = parseInt(qty_total / promotion_line.bx_qty);
			let line_clone = 0;
			while (promos_qty <= promos_qty_apply){
				let qty_discounted = 0;
				while (qty_discounted != qty_discount){
					for (let [k, line] of product_lines.entries()){
						if (line.done == false && qty_discounted != qty_discount){
							var origin_qty = line.order_line.get_quantity();
							if (origin_qty == 1){
								line.done = true;
								line.order_line.set_discount(line.order_line.price);
							} else {
								line.order_line.set_quantity(origin_qty - 1);
								if (line_clone == 0){
									var new_line = line.order_line.clone();
		                            self.add_orderline(new_line);
		                            new_line.set_quantity(1);
									new_line.set_discount(line.order_line.price);
									line_clone = new_line.id;
								} else {
									let line_discount = _.filter(self.get_orderlines(), function(order_line){
										return order_line.id == line_clone
									})
									line_discount[0].set_quantity(line_discount[0].quantity + 1);
								}
							}
							qty_discounted +=1;
							break;
						}
					}
				}
				promos_qty +=1;
			};
		});
	},
    apply_promotion_line_limit_times: function(apply_lines, promotion_lines, apply_times){
        let self = this;
        if (!apply_times){
            console.log(">> apply_promotion_line: apply_time is:", apply_times);
            return false;
        }

        // if there is no apply_lines, auto add a line
        if (_.isEmpty(apply_lines)){
            for (let p=0; p < promotion_lines.length; p++) {
                let promotion_line = promotion_lines[p];
                if (_.has(promotion_line, 'product_id')){
                    let product = this.pos.db.get_product_by_id(promotion_line.product_id[0]);
                    let line = new models.Orderline({}, {pos: this.pos, order: this, product: product})
                    self.add_orderline(line);
                    line.set_quantity(apply_times);
                    line.set_product_promotion(promotion_line);
                    apply_times = 0;
                }
            }
        } else {
            let last_product_line = false;

            for (let i=0; i < apply_lines.length; i++) {
                let order_line = apply_lines[i];
                // break if there isn't appy_times anymore
                if (!apply_times){
                    break;
                }
                // check if this line is ok to apply
                if (!order_line.get_promotion_id()
                    && !order_line.get_condition_promotion_id()) {
                    // check if product is product list of promotion program
                    for (let p=0; p < promotion_lines.length; p++) {
                        let promotion_line = promotion_lines[p];

                        // break if there isn't any apply_times anymore
                        if (!apply_times){
                            break;
                        }

                        if ((_.has(promotion_line, 'product_id') && order_line.product.id === promotion_line.product_id[0])
                           || (_.has(promotion_line, 'category_id') && order_line.product.categ.id === promotion_line.category_id[0])
                           || (_.has(promotion_line, 'category_id') && order_line.product.categ_bxgy_id[0] === promotion_line.category_id[0])
						   || (_.has(promotion_line, 'season_id') && order_line.product.product_seasons_id[0] === promotion_line.season_id[0])
						   || (_.has(promotion_line, 'brand_id') && order_line.product.brand_id[0] === promotion_line.brand_id[0])
                           || (_.has(promotion_line, 'template_id') && order_line.product.product_tmpl_id === promotion_line.template_id[0])) {
                            
                            order_line.set_product_promotion(promotion_line);
                            apply_times -= order_line.get_quantity();

                            // mark last product line, use to set remain quantity
                            last_product_line = order_line;

                        }
                    }
                }
            };

            // if still exist remain apply_times, apply all remain for last line
            if (apply_times > 0 && last_product_line) {
                // get last element and distribute the remain apply_qties
                last_product_line.set_quantity(apply_times + last_product_line.get_quantity());
                apply_times = 0;
            }

        }

        return apply_times;
    },
    apply_promotion_line_combo_limit_times_freeqty: function (to_apply_lines, promotion_lines, apply_times){
        let self = this;

        let freeqty_promo_lines = _.filter(promotion_lines, function (pl) {
            return pl.free_qty > 0 && !pl.fixed_price && !pl.disc_percentage && !pl.disc_amount;
        })

        // only keep product in apply_lines that exist in promotion_lines
        let promotion_line_product_ids = _.map(promotion_lines, function(pl){ return pl.product_id[0]; })
        let applicable_lines = _.filter(to_apply_lines, function (order_line) {
            return _.indexOf(promotion_line_product_ids, order_line.product.id) != -1;
        })

        /**
         * Get apply time for array of products which to be applied promotion
         */
        let qty_apply_times = {}
        _.each(freeqty_promo_lines, function(pl){
            qty_apply_times[pl.product_id[0]] = pl.free_qty * apply_times;
        })

        if (!apply_times) {
            console.log(">> apply_promotion_line: apply_time is:", apply_times);
            return false;
        }

        // if there is no applicable_lines, auto add a line
        if (_.isEmpty(applicable_lines)) {
            for (let p = 0; p < freeqty_promo_lines.length; p++) {
                let promotion_line = freeqty_promo_lines[p];
                if (_.has(promotion_line, 'product_id')) {
                    let product = this.pos.db.get_product_by_id(promotion_line.product_id[0]);
                    let line = new models.Orderline({}, {
                        pos: this.pos,
                        order: this,
                        product: product
                    })
                    self.add_orderline(line);
                    line.set_quantity(qty_apply_times[product.id]);
                    line.set_product_promotion(promotion_line);
                    qty_apply_times[product.id] = 0;
                }
            }
        } else {

            for (let i = 0; i < applicable_lines.length; i++) {
                let order_line = applicable_lines[i];
                // break if there isn't appy_times anymore
                if (_.isEmpty(qty_apply_times)) {
                    break;
                }
                // check if this line is ok to apply
                if (!order_line.get_promotion_id()) {
                    // check if product is product list of promotion program
                    for (let p = 0; p < freeqty_promo_lines.length; p++) {
                        let promotion_line = freeqty_promo_lines[p];

                        // break if there isn't any apply_times anymore
                        if (_.isEmpty(qty_apply_times)) {
                            break;
                        }

                        if ((_.has(promotion_line, 'product_id') && order_line.product.id === promotion_line.product_id[0]) ||
                            (_.has(promotion_line, 'category_id') && order_line.product.categ.id === promotion_line.category_id[0]) ||
                            (_.has(promotion_line, 'category_id') && order_line.product.categ_bxgy_id[0] === promotion_line.category_id[0]) ||
							(_.has(promotion_line, 'season_id') && order_line.product.product_seasons_id[0] === promotion_line.season_id[0]) ||
							(_.has(promotion_line, 'brand_id') && order_line.product.brand_id[0] === promotion_line.brand_id[0]) ||
                            (_.has(promotion_line, 'template_id') && order_line.product.product_tmpl_id === promotion_line.template_id[0])) {
                            // if product has apply_times < qty of line, split it
                            let product_times = qty_apply_times[promotion_line.product_id[0]];
                            if (product_times < order_line.get_quantity()) {
                                order_line.split_line(product_times);
                            }
                            order_line.set_product_promotion(promotion_line);
                            qty_apply_times[promotion_line.product_id[0]] -= order_line.get_quantity();


                        }
                    }
                }
            };
        }
        apply_times = 0
        return apply_times;
    },
    apply_promotion_line_combo_limit_times_discount: function (to_apply_lines, promotion_lines, apply_times) {
        let self = this;

        let discount_promo_lines = _.filter(promotion_lines, function (pl) {
            return pl.fixed_price || pl.disc_percentage || pl.disc_amount
        })


        // only keep product in apply_lines that exist in promotion_lines
        let promotion_line_product_ids = _.map(promotion_lines, function (pl) {
            return parseInt(pl.product_id[0]);
        })
        let applicable_lines = _.filter(to_apply_lines, function (order_line) {
            return _.indexOf(promotion_line_product_ids, parseInt(order_line.product.id)) != -1;
        })

        // if there is no applicable_lines, auto add a line
        if (_.isEmpty(applicable_lines)) {
            for (let p = 0; p < promotion_lines.length; p++) {
                let promotion_line = promotion_lines[p];
                if (_.has(promotion_line, 'product_id')) {
                    let product = this.pos.db.get_product_by_id(promotion_line.product_id[0]);
                    let line = new models.Orderline({}, {
                        pos: this.pos,
                        order: this,
                        product: product
                    })
                    self.add_orderline(line);
                    line.set_quantity(apply_times);
                    line.set_product_promotion(promotion_line);
                }
            }
        } else {

            for (let i = 0; i < applicable_lines.length; i++) {
                let order_line = applicable_lines[i];

                // check if this line is ok to apply
                if (!order_line.get_promotion_id()) {
                    // check if product is product list of promotion program
                    for (let p = 0; p < discount_promo_lines.length; p++) {
                        let promotion_line = discount_promo_lines[p];

                        if ((_.has(promotion_line, 'product_id') && order_line.product.id === promotion_line.product_id[0]) ||
                            (_.has(promotion_line, 'category_id') && order_line.product.categ.id === promotion_line.category_id[0]) ||
                            (_.has(promotion_line, 'category_id') && order_line.product.categ_bxgy_id[0] === promotion_line.category_id[0]) ||
							(_.has(promotion_line, 'season_id') && order_line.product.product_seasons_id[0] === promotion_line.season_id[0]) ||
							(_.has(promotion_line, 'brand_id') && order_line.product.brand_id[0] === promotion_line.brand_id[0]) ||
                            (_.has(promotion_line, 'template_id') && order_line.product.product_tmpl_id === promotion_line.template_id[0])) {

                            order_line.set_product_promotion(promotion_line);
                        }
                    }
                }
            };

        }
        apply_times = 0;
        return apply_times;
    },
    apply_promotion_line_unlimit_times: function(promotion_lines){
        let order_lines = this.get_orderlines();
        // case (_.isEmpty(multi_condition_product_ids) && _.isEmpty(standalone_condition_prod_ids))
        _.each(order_lines, function(order_line){
            // check if this line is ok to apply
            if (!order_line.get_promotion_id()
                && !order_line.get_condition_promotion_id()) {
                // check if product is product list of promotion program
                _.each(promotion_lines, function(promotion_line){
                    if ((_.has(promotion_line, 'product_id') && order_line.product.id === promotion_line.product_id[0])
                        || (_.has(promotion_line, 'category_id') && order_line.product.categ.id === promotion_line.category_id[0])
                        || (_.has(promotion_line, 'category_id') && order_line.product.categ_bxgy_id[0] === promotion_line.category_id[0])
						|| (_.has(promotion_line, 'season_id') && order_line.product.product_seasons_id[0] === promotion_line.season_id[0])
						|| (_.has(promotion_line, 'brand_id') && order_line.product.brand_id[0] === promotion_line.brand_id[0])
                        || (_.has(promotion_line, 'template_id') && order_line.product.product_tmpl_id === promotion_line.template_id[0])) {

                        order_line.set_product_promotion(promotion_line);

                    }
                })
            }
        });
    },
});

});


odoo.define('pos_promotion_season_brand.order', function (require) {
"use strict";

let models = require('point_of_sale.models');
let Order = models.Order;
let _super = Order.prototype;

models.Order = Order.extend({
    initialize: function(attributes, options){
        _super.initialize.apply(this, arguments);
    },
    apply_promotion_on_product: function(promotions){
        let self = this;
        let order_lines = this.get_orderlines();
        _.each(promotions, function(promotion){
            // check if this.promotion can apply for this pos
            let can_apply = self.can_apply_promotion_for_this_pos(promotion);
            can_apply = can_apply && self.check_expiration(promotion);
            if (!can_apply){
                // return immediately if this promotion is not OK
                return can_apply;
            }

            let prod_promotions = self.pos.db.get_promo_product_by_promo_id(promotion.id);
            let apply_tmpl_promotions = self.pos.db.get_promo_template_by_promo_id(promotion.id);
            let apply_categ_promotions = self.pos.db.get_promo_category_by_promo_id(promotion.id);
			let apply_season_promotions = self.pos.db.get_promo_season_by_promo_id(promotion.id);
			let apply_brand_promotions = self.pos.db.get_promo_brand_by_promo_id(promotion.id);
            // combo condition of promotion
            let combo_condition_prod_ids = self.get_combo_condition_product_ids(promotion).sort();

            // they can be selected line by line => single condition for each line
            let standalone_condition_prod_ids = self.get_standalone_condition_prod_ids(promotion);

            // product_ids of order
            let order_product_ids = self.get_order_product_ids(order_lines);

            // same for combo condition
            let combo_condition_common_prod_ids = _.intersection(combo_condition_prod_ids, order_product_ids).sort();
			
            // the main logic is here
            if (!_.isEmpty(combo_condition_prod_ids)) {
                // if exist standalone condition also, apply it
                if (!_.isEmpty(standalone_condition_prod_ids)){
                    self.apply_with_condition_standalone(promotion);
                }
                // if exist combo product product_ids
                if (_.isEqual(combo_condition_common_prod_ids.sort(), combo_condition_prod_ids.sort())) {
                    self.apply_with_condition_combo(promotion);
                }
            } else {
	            if (!_.isEmpty(standalone_condition_prod_ids)){
	                self.apply_with_condition_standalone(promotion);
	            } else {
	                self.apply_promotion_line_unlimit_times(prod_promotions);
	            }
	
				if (promotion.promotion_code == 'prod_bxgy_free_combo') {
					if(apply_categ_promotions.length != 0){
						self.apply_promotion_free_combo(apply_categ_promotions);							
					}
					if(apply_season_promotions.length != 0){							
						self.apply_promotion_free_combo(apply_season_promotions);
					}
					if(apply_brand_promotions.length != 0){
						self.apply_promotion_free_combo(apply_brand_promotions);							
					}
				} else {
					if(apply_tmpl_promotions.length != 0){
						self.apply_promotion_line_unlimit_times(apply_tmpl_promotions);							
					}
					if(apply_categ_promotions.length != 0){
						self.apply_promotion_line_unlimit_times(apply_categ_promotions);							
					}
					if(apply_season_promotions.length != 0){							
						self.apply_promotion_line_unlimit_times(apply_season_promotions);
					}
					if(apply_brand_promotions.length != 0){
						self.apply_promotion_line_unlimit_times(apply_brand_promotions);							
					}
				}
            }

        });
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
    apply_with_condition_combo: function(promotion){
        let self = this;
        let apply_times = [];
        let condition_line_ids = [];
        let all_condition_ok = true;
        let combo_conditions = self.pos.db.get_promo_combo_condition_by_promo_id(promotion.id);

        for (let i=0; i < combo_conditions.length; i ++) {
            let condition = combo_conditions[i];
            condition.multiply_weight = 0;
            let condition_ok = false;
            _.each(self.get_orderlines(), function(order_line){
                // check each line with each condition
                if (order_line.product.id == condition.condition_product_id[0]
                    && order_line.get_quantity() >= condition.condition_qty
                    && condition.condition_qty > 0
                    && !order_line.get_promotion_id()
                    && !order_line.get_condition_promotion_id()
                    && condition.multiply_weight == 0){

                    // ok, process apply multiple time if enough
                    let multiply_weight = parseInt(order_line.get_quantity() / condition.condition_qty, 0);
                    if (multiply_weight > 0){

                        condition.multiply_weight = multiply_weight;
                        condition.order_line = order_line;
                        condition_ok = true;
                        apply_times.push(multiply_weight);
                        condition_line_ids.push(order_line.id);
                    }
                }
            })

            all_condition_ok = all_condition_ok && condition_ok;

            if (!all_condition_ok){
                break;
            }
        }

        if (!all_condition_ok){
            return;
        }
        // multiply_weight is the min multiply_weight of all condition
        let all_weights = _.map(combo_conditions, function(condition){ return condition.multiply_weight; })
        let multiply_number = _.min(all_weights);
        _.each(combo_conditions, function(condition){
            // split line if needed
            let qty_to_condition_ok = multiply_number * condition.condition_qty;
            let order_line = condition.order_line;
            // split line if current_line is > qty_to_condition_ok
            if (order_line.get_quantity() > qty_to_condition_ok){
                order_line.split_line(qty_to_condition_ok);
            }
            // mark order_line as condition of combo promotion
            order_line.set_condition_promotion_id(promotion.id);
        })

        apply_times = _.min(apply_times);
        if (apply_times > 0 && all_condition_ok){
            // find line to apply promotion
            let apply_lines = _.filter(self.get_orderlines(), function(order_line){
                return !order_line.get_promotion_id();
            })

            let prod_promotions = self.pos.db.get_promo_product_by_promo_id(promotion.id);
            prod_promotions = _.filter(prod_promotions, function(promotion){ return !promotion.condition_product_id; })
            /**
             * Small case, apply lines will be condition product themself
             */
            apply_times = self.apply_promotion_line_combo_limit_times(apply_lines, prod_promotions, apply_times);

            let apply_tmpl_promotions = self.pos.db.get_promo_template_by_promo_id(promotion.id);
            apply_times = self.apply_promotion_line_limit_times(apply_lines, apply_tmpl_promotions, apply_times);

            let apply_categ_promotions = self.pos.db.get_promo_category_by_promo_id(promotion.id);
            apply_times = self.apply_promotion_line_limit_times(apply_lines, apply_categ_promotions, apply_times);

			let apply_season_promotions = self.pos.db.get_promo_season_by_promo_id(promotion.id);
            apply_times = self.apply_promotion_line_limit_times(apply_lines, apply_season_promotions, apply_times);

			let apply_brand_promotions = self.pos.db.get_promo_brand_by_promo_id(promotion.id);
            apply_times = self.apply_promotion_line_limit_times(apply_lines, apply_brand_promotions, apply_times);

            // in case has apply_lines
            // and already apply product/ template/ category/ season. But still exist apply_times,
            // => there is no promotion_line has product = apply_lines, auto add random the first line of prod_promotions if any
            if (!_.isEmpty(prod_promotions) && apply_times) {
                let promotion_line = prod_promotions[0];
                if (_.has(promotion_line, 'product_id')){
                    let product = this.pos.db.get_product_by_id(promotion_line.product_id[0]);
                    let line = new models.Orderline({}, {pos: this.pos, order: this, product: product})
                    self.add_orderline(line);
                    line.set_quantity(apply_times);
                    line.set_product_promotion(promotion_line);
                    apply_times = 0;
                }
            }

        };
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


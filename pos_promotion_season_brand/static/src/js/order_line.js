odoo.define('pos_promotion_season_brand.order_line', function (require) {
"use strict";

let models = require('point_of_sale.models');
let Orderline = models.Orderline;
let _super = Orderline.prototype;

models.Orderline = Orderline.extend({ 
	initialize: function(attributes, options){
		this.promo_bxgy_free = 0;
        _super.initialize.apply(this, arguments);
    },
    set_promo_fixed_price: function(fixed_price){
        let origin_price = this.get_origin_price() > 0 ? this.get_origin_price() : this.get_unit_price();
        if (origin_price >= 0) {
            this.promo_fixed_price = Math.min(Math.max(parseFloat(fixed_price) || 0, 0), origin_price);
            this.set_unit_price(this.promo_fixed_price);
            this.set_origin_price(origin_price);
        }
    },
	set_promo_bxgy_free: function() {
        let origin_price = this.get_origin_price() > 0 ? this.get_origin_price() : this.get_unit_price();
		this.promo_bxgy_free = 0;
        this.set_unit_price(this.promo_bxgy_free);
        this.set_origin_price(origin_price);
    },
	has_promotion: function(){
        return  this.get_promo_disc_amount() || this.get_promo_get_free() || this.get_promo_fixed_price() || this.get_promo_disc_percentage() || this.get_promo_bxgy_free();
    },
	get_promo_bxgy_free: function(){
        return this.get_promo_bxgy_free;
    },
	set_product_promotion: function(prod_promo){
        if (prod_promo.disc_percentage > 0){
            this.set_promo_disc_percentage(prod_promo.disc_percentage)
            this.set_promotion_id(prod_promo.promotion_id[0]);

        } else if (prod_promo.disc_amount > 0) {
            this.set_promo_disc_amount(prod_promo.disc_amount);
            this.set_promotion_id(prod_promo.promotion_id[0]);
        } else if (prod_promo.fixed_price > 0) {
            this.set_promo_fixed_price(prod_promo.fixed_price);
            this.set_promotion_id(prod_promo.promotion_id[0]);
        } else if (prod_promo.free_qty > 0) {
            this.set_promo_get_free(prod_promo.free_qty);
            this.set_promotion_id(prod_promo.promotion_id[0]);
        } else if (prod_promo.bx_qty > 0 && prod_promo.fy_qty > 0) {
			this.set_promo_bxgy_free();
            this.set_promotion_id(prod_promo.promotion_id[0]);
		}
    },
	clear_promotion: function(){
        this.promo_bxgy_free = 0;
		_super.clear_promotion.apply(this);
    },
    export_as_JSON: function() {
        let res = _super.export_as_JSON.call(this);
        _.extend(res, {
            promo_bxgy_free: this.get_promo_bxgy_free(),
        });
        return res;
    },
    init_from_JSON: function(json) {
        _super.init_from_JSON.call(this, json);
        // setting origin price first for next promotion
        this.set_origin_price(json.origin_price);
        // set custom promotion
        this.set_promo_get_free(json.promo_get_free);
		this.set_promo_bxgy_free(json.promo_bxgy_free);
    },
});
});

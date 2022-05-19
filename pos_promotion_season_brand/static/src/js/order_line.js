odoo.define('pos_promotion_season_brand.order_line', function (require) {
"use strict";

var models = require('point_of_sale.models');
var Orderline = models.Orderline;
let _super = Orderline.prototype;

models.Orderline = Orderline.extend({ 
	initialize: function(attributes, options){
        _super.initialize.apply(this, arguments);
    },
    set_promo_fixed_price: function(fixed_price){
        var origin_price = this.get_origin_price() > 0 ? this.get_origin_price() : this.get_unit_price();
        if (origin_price >= 0) {
            this.promo_fixed_price = Math.min(Math.max(parseFloat(fixed_price) || 0, 0), origin_price);
            this.set_unit_price(this.promo_fixed_price);
            this.set_origin_price(origin_price);
        }
    },
});
});

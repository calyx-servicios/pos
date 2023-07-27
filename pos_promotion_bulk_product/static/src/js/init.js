odoo.define('pos_promotion_bulk_product.init', function (require) {
"use strict";
    let models = require('point_of_sale.models');

	models.load_fields('product.product', ['categ_bxgy_id',]);

});


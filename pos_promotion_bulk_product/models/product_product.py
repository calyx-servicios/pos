from odoo import models, fields


class ProductProduct(models.Model):
    _inherit = 'product.product'
    
    is_categ_bxgy = fields.Boolean(string='Is Category bXgY', default=False)
    categ_bxgy_id = fields.Many2one('product.category', string='Category bXgY')
    
    
    def set_bulk_categ_bxgy(self):
        active_ids = self.env.context["active_ids"] 
        if len(active_ids) != 0:
            products = self.env["product.product"].browse(active_ids)
            categ_bxgy = self.env.ref("pos_promotion_bulk_product.categ_bulk_product_bxgy")
            products.write({"is_categ_bxgy": True, "categ_bxgy_id": categ_bxgy.id})
            
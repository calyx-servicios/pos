from odoo import fields, models

class PosPromotionBrand(models.Model):
    _name = 'pos.promotion.brand'

    promotion_id = fields.Many2one("Promotion", 
        comodel_name="pos.promotion")
    promotion_code = fields.Char("Promotion Code",
                                 related='promotion_id.promotion_code',
                                 store=True)

    state = fields.Selection('State',
        related='promotion_id.state', store=True)
    brand_id = fields.Many2one('Brand', 'product.brand', required=True)
    fixed_price = fields.Float('Fixed Price')
    disc_percentage = fields.Float('Disc. %')
    disc_amount = fields.Float('Disc. Amount')


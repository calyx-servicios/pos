from odoo import fields, models

class PosPromotionBrand(models.Model):
    _name = 'pos.promotion.brand'

    promotion_id = fields.Many2one( 
        comodel_name="pos.promotion", string="Promotion")
    promotion_code = fields.Char(related='promotion_id.promotion_code',
                                 string="Promotion Code",
                                 store=True)

    state = fields.Selection(
        related='promotion_id.state', string='State', store=True)
    brand_id = fields.Many2one(
        comodel_name='product.brand', string='Brand', required=True)
    fixed_price = fields.Float('Fixed Price')
    disc_percentage = fields.Float('Disc. %')
    disc_amount = fields.Float('Disc. Amount')


from odoo import fields, models

class PosPromotionSeason(models.Model):
    _name = 'pos.promotion.season'

    promotion_id = fields.Many2one(
        comodel_name="pos.promotion", string="Promotion")
    promotion_code = fields.Char(related='promotion_id.promotion_code',
                                 string="Promotion Code",
                                 store=True)

    state = fields.Selection(
        related='promotion_id.state', string='State', store=True)
    season_id = fields.Many2one(
        comodel_name='product.seasons', string='Season', required=True)
    fixed_price = fields.Float('Fixed Price')
    disc_percentage = fields.Float('Disc. %')
    disc_amount = fields.Float('Disc. Amount')
    bx_qty = fields.Float('Buy Qty X')
    fy_qty = fields.Float('Free Qty Y')


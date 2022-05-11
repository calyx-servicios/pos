from odoo import fields, models

class PosPromotionSeason(models.Model):
    _name = 'pos.promotion.season'

    promotion_id = fields.Many2one(
        comodel_name="pos.promotion", "Promotion")
    promotion_code = fields.Char(related='promotion_id.promotion_code',
                                 "Promotion Code",
                                 store=True)

    state = fields.Selection(
        related='promotion_id.state', 'State', store=True)
    season_id = fields.Many2one('product.seasons', 'Season', required=True)
    fixed_price = fields.Float('Fixed Price')
    disc_percentage = fields.Float('Disc. %')
    disc_amount = fields.Float('Disc. Amount')


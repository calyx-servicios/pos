from odoo import fields, models

class PosPromotionSeason(models.Model):
    _name = 'pos.promotion.season'

    promotion_id = fields.Many2one("Promotion",
        comodel_name="pos.promotion")
    promotion_code = fields.Char("Promotion Code",
                                 related='promotion_id.promotion_code',
                                 store=True)

    state = fields.Selection('State',
        related='promotion_id.state', store=True)
    season_id = fields.Many2one('Season', 'product.seasons', required=True)
    fixed_price = fields.Float('Fixed Price')
    disc_percentage = fields.Float('Disc. %')
    disc_amount = fields.Float('Disc. Amount')


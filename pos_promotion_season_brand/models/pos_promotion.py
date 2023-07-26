from odoo import fields, models

class PosPromotion(models.Model):
    _inherit = 'pos.promotion'

   
    promotion_season_ids = fields.One2many(
        comodel_name="pos.promotion.season",
        inverse_name="promotion_id",
        string="Seasons"
    )

    promotion_brand_ids = fields.One2many(
        comodel_name="pos.promotion.brand",
        inverse_name="promotion_id",
        string="Brand"
    )


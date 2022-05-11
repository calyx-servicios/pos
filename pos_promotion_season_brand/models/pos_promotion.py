from odoo import fields, models

class PosPromotion(models.Model):
    _inherit = 'pos.promotion'

   
    promotion_season_ids = fields.One2many("Seasons",
        comodel_name="pos.promotion.season",
        inverse_name="promotion_id"  
    )

    promotion_brand_ids = fields.One2many("Brand", 
        comodel_name="pos.promotion.brand",
        inverse_name="promotion_id"
    )


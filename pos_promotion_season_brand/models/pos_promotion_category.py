from odoo import fields, models

class PosPromotionCategory(models.Model):
    _inherit = 'pos.promotion.category'

    bx_qty = fields.Float('Buy Qty X')
    fy_qty = fields.Float('Free Qty Y')
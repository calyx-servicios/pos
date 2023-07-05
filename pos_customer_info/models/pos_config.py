from odoo import fields, models

class PosConfig(models.Model):
    _inherit = "pos.config"

    receipt_customer_information = fields.Boolean(Strings='Show Customer information', default=True)

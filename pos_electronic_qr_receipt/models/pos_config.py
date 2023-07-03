from odoo import fields, models

class PosConfig(models.Model):
    _inherit = "pos.config"

    pos_auto_invoice = fields.Boolean(String='POS auto invoice', help='POS auto to checked to invoice button', default=True)
    receipt_invoice_number = fields.Boolean(Strings='Show invoice information', default=True)
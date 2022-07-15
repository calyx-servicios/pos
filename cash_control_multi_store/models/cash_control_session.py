from odoo import models,fields

class CashControlSession(models.Model):
    _inherit ='cash.control.session'

    store_id = fields.Many2one(related='config_id.store_id')
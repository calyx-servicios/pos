from odoo import fields, models

class PosConfig(models.Model):
    _inherit = "pos.config"

    is_required_customer = fields.Boolean(Strings='Is the client required?', default=True)

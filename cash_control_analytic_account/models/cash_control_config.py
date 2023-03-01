from odoo import models, fields, api, _


class CashControlConfig(models.Model):
    _inherit = "cash.control.config"

    analytic_account_id = fields.Many2one(comodel_name="account.analytic.account")

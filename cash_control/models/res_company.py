from odoo import models, fields, api


class ResCompany(models.Model):
    _inherit = "res.company"

    allow_sessionless_payments = fields.Boolean(string="Allow Sessionless Payments")

    allow_closed_session_payments = fields.Boolean(
        string="Allow Closed Session Payments"
    )

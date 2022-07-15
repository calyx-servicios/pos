from odoo import models, fields


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    allow_sessionless_payments = fields.Boolean(
        string="Allow Sessionless Payments",
        related="company_id.allow_sessionless_payments",
        readonly=False,
    )

    allow_closed_session_payments = fields.Boolean(
        string="Allow Closed Session Payments",
        related="company_id.allow_closed_session_payments",
        readonly=False,
    )
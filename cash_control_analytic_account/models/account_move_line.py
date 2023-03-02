from odoo import models, fields


class AccountMoveLine(models.Model):
    _inherit = "account.move.line"

    analytic_account_id = fields.Many2one(
        comodel_name="account.analytic.account",
        string="Analytic Account",
        index=True,
        related="move_id.cash_control_session_id.config_id.analytic_account_id",
    )

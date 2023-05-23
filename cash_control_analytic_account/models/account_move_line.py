from odoo import models, fields, api
import logging


class AccountMoveLine(models.Model):
    _inherit = "account.move.line"

    manual_analytic_account_id = fields.Many2one(
        comodel_name="account.analytic.account", default=False
    )

    analytic_account_id = fields.Many2one(
        comodel_name="account.analytic.account",
        string="Analytic Account",
        index=True,
        compute="_compute_analytic_account_id",
        inverse="_inverse_analytic_account_id",
    )

    @api.depends("move_id.cash_control_session_id", "manual_analytic_account_id")
    def _compute_analytic_account_id(self):
        for line in self:
            cc_session_id = line.move_id.cash_control_session_id
            if (
                cc_session_id
                and cc_session_id.config_id.analytic_account_id
                and not line.manual_analytic_account_id
            ):
                line.analytic_account_id = cc_session_id.config_id.analytic_account_id
            else:
                line.analytic_account_id = line.manual_analytic_account_id or False

    def _inverse_analytic_account_id(self):
        for line in self:
            line.manual_analytic_account_id = line.analytic_account_id.id

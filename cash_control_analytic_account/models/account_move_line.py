from odoo import models, fields, api


class AccountMoveLine(models.Model):
    _inherit = "account.move.line"

    analytic_account_id = fields.Many2one(
        comodel_name="account.analytic.account",
        string="Analytic Account",
        index=True,
        related="move_id.cash_control_session_id.config_id.analytic_account_id",
        # compute="_compute_analytic_account_id",
        # inverse="_inverse_analytic_account_id",
    )


    @api.depends("move_id.cash_control_session_id")
    def _compute_analytic_account_id(self):
        for line in self:
            if line.move_id.cash_control_session_id:
                line.analytic_account_id = line.move_id.cash_control_id.config_id.analytic_account_id.id
            else:
                line.analytic_account_id = False
    
    def _inverse_analytic_account_id(self):
        for line in self:
            print("how the fuck does inverse work")

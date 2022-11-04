from odoo import models, fields, api

class SaleOrder(models.Model):
    _inherit = "sale.order"

    @api.model
    @api.returns('self', lambda value: value.id if value else False)
    def _get_default_team(self):
        default_outcome = super()._get_default_team()
        session_id = self.env['cash.control.session'].browse(self.cash_control_session_id)
        return session_id.config_id.team_id or default_outcome

    session_date_start = fields.Datetime(
        string='Session Date Start', 
        related="cash_control_session_id.date_start", 
        store=True,
        )
    session_date_end = fields.Datetime(
        string='Session Date End', 
        related="cash_control_session_id.date_end", 
        store=True,
        )
    
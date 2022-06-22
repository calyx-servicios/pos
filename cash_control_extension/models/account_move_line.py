from odoo import models,fields

class AccountMoveLine(models.Model):
    _inherit = 'account.move.line'

    cash_control_session_id = fields.Many2one(related="move_id.cash_control_session_id")
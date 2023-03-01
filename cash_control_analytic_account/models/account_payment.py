from odoo import models, fields, api, _


class AccountPayment(models.Model):
    _inherit = "account.payment"

    def _prepare_payment_moves(self):
        all_move_vals = []
        for payment in self:
            move_vals = super(AccountPayment, payment)._prepare_payment_moves()
            for move in move_vals:
                if payment.cash_control_session_id:
                    move["cash_control_session_id"] = payment.cash_control_session_id.id
                all_move_vals += [move]
        return all_move_vals

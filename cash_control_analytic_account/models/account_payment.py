from odoo import models, fields, api, _

import logging

_logger = logging.getLogger("ACCOUNT PAYMENT DICE QUE:")


class AccountPayment(models.Model):
    _inherit = "account.payment"

    def _prepare_payment_moves(self):
        # this is here just to not break inheritance
        all_move_vals = super()._prepare_payment_moves()
        _logger.info(all_move_vals)
        all_move_vals = []
        for payment in self:
            move_vals = super(AccountPayment, payment)._prepare_payment_moves()
            _logger.info(move_vals)
            for move in move_vals:
                if payment.cash_control_session_id:
                    _logger.info("se rompe en la asignacion")
                    move["cash_control_session_id"] = payment.cash_control_session_id.id
                _logger.info("se rompe en el +=")
                all_move_vals += [move]
        _logger.info(all_move_vals)
        return all_move_vals

    # TODO:
    # FALTA TESTEAR ESTO^!


# [
#     {
#         "date": datetime.date(2023, 3, 1),
#         "ref": "1100501",
#         "journal_id": 37,
#         "currency_id": 19,
#         "partner_id": False,
#         "line_ids": [
#             (
#                 0,
#                 0,
#                 {
#                     "name": "TRANS/2023/0623",
#                     "amount_currency": 0.0,
#                     "currency_id": False,
#                     "debit": 12000.0,
#                     "credit": 0.0,
#                     "date_maturity": datetime.date(2023, 3, 1),
#                     "partner_id": False,
#                     "account_id": 1,
#                     "payment_id": 1163,
#                 },
#             ),
#             (
#                 0,
#                 0,
#                 {
#                     "name": "Transfer to Efectivo",
#                     "amount_currency": 0.0,
#                     "currency_id": False,
#                     "debit": 0.0,
#                     "credit": 12000.0,
#                     "date_maturity": datetime.date(2023, 3, 1),
#                     "partner_id": False,
#                     "account_id": 910,
#                     "payment_id": 1163,
#                 },
#             ),
#         ],
#     },
#     {
#         "date": datetime.date(2023, 3, 1),
#         "ref": "1100501",
#         "partner_id": False,
#         "journal_id": 8,
#         "line_ids": [
#             (
#                 0,
#                 0,
#                 {
#                     "name": "TRANS/2023/0623",
#                     "amount_currency": 0.0,
#                     "currency_id": False,
#                     "debit": 0.0,
#                     "credit": 12000.0,
#                     "date_maturity": datetime.date(2023, 3, 1),
#                     "partner_id": False,
#                     "account_id": 1,
#                     "payment_id": 1163,
#                 },
#             ),
#             (
#                 0,
#                 0,
#                 {
#                     "name": "Transfer from Visa Debito",
#                     "amount_currency": 0.0,
#                     "currency_id": False,
#                     "debit": 12000.0,
#                     "credit": 0.0,
#                     "date_maturity": datetime.date(2023, 3, 1),
#                     "partner_id": False,
#                     "account_id": 299,
#                     "payment_id": 1163,
#                 },
#             ),
#         ],
#     },
# ]

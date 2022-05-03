# -*- coding: utf-8 -*-
from odoo import fields, models,api,_

import logging
_logger = logging.getLogger(__name__)


class AccountMove(models.Model):

    _inherit = 'account.move'

    @api.model
    def _default_cash_control_session_id(self):
        session = self.env['cash.control.session'].search([
            ('user_ids', 'in', self.env.uid),
            ('state', '=', 'opened')
        ], limit=1)
        if not session:
            return False
            # raise ValidationError(_("There is not open cash session for de the current user. Please open a cash session"))
        return session.id

    cash_control_session_id = fields.Many2one(
        'cash.control.session',
        string='Session',
        copy=False,
        default=_default_cash_control_session_id
    )

    config_id = fields.Many2one(
        'cash.control.config',
        related='cash_control_session_id.config_id',
        string="Cash Control",
        readonly=False
    )

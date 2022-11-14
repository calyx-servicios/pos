from odoo import models,fields,api,_
from odoo.exceptions import UserError


class AccountMove(models.Model):
    _inherit = 'account.move'

    @api.model
    def _default_store_id(self):
        return self.journal_id.store_id.id

    store_id = fields.Many2one(comodel_name="res.store",default=_default_store_id)

    @api.onchange("cash_control_session_id","journal_id")
    def _onchange_cash_control_session_id(self):
        if self.cash_control_session_id: #we prioritize cash control store
            self.store_id = self.cash_control_session_id.config_id.store_id.id
        else:
            self.store_id = self._default_store_id()

    def post(self):
        if not self.journal_id.multi_store:
            if not self.store_id:
                store_id = self.journal_id.store_id
                if not store_id:
                    raise UserError(_("Move must have a store assigned if journal is not Multi Store"))
                self.store_id = store_id.id
        return super().post()
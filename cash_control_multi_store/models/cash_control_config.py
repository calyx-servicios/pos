from odoo import models, fields, api, _

class CashControlConfig(models.Model):
    _inherit = 'cash.control.config'

    def _get_default_store_id(self):
        return self.env["res.store"].search([("company_id","=",self.company_id.id)],limit=1)

    store_id = fields.Many2one(
        'res.store',
        string="Store"
    )

    @api.onchange("store_id")
    def _onchange_store_id(self):
        if self.store_id:
            self.company_id = self.store_id.company_id.id

    @api.onchange("company_id")
    def _onchange_company_id(self):
        if self.store_id.company_id.id != self.company_id.id:
            self.store_id = self._get_default_store_id()

    @api.model
    def _search(self, args, offset=0, limit=None, order=None, count=False, access_rights_uid=None):
        """
        Same restriction applied to models in multi-store modules. We add user.store_ids to allow multiple
        stores' configs to be shown at once
        """
        user = self.env.user
        # if superadmin, do not apply
        if not self.env.is_superuser():
            args += ['|','|',('store_id', '=', False), ('store_id', 'child_of', [user.store_id.id]),("store_id","in",user.store_ids.ids)]
        return super()._search(args, offset, limit, order, count=count, access_rights_uid=access_rights_uid)
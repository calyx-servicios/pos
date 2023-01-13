from odoo import models,fields,api

class CashControlSession(models.Model):
    _inherit ='cash.control.session'

    store_id = fields.Many2one(related='config_id.store_id')


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
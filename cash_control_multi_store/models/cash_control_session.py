from odoo import models,fields,api

class CashControlSession(models.Model):
    _inherit ='cash.control.session'

    store_id = fields.Many2one(related='config_id.store_id')


    @api.model
    def _search(self, args, offset=0, limit=None, order=None, count=False, access_rights_uid=None):
        """
        Para que usuarios los usuarios no puedan elegir diarios donde no puedan
        escribir, modificamos la funcion search. No lo hacemos por regla de
        permiso ya que si no pueden ver los diarios termina dando errores en
        cualquier lugar que se use un campo related a algo del diario
        """
        user = self.env.user
        # if superadmin, do not apply
        if not self.env.is_superuser():
            args += ['|', ('store_id', '=', False), ('store_id', 'child_of', [user.store_id.id])]
        return super()._search(args, offset, limit, order, count=count, access_rights_uid=access_rights_uid)
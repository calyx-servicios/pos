from odoo import models, fields, api

class SaleOrder(models.Model):
    _inherit = "sale.order"

    def _get_default_team(self):
        context = {
            "default_team_id": self.config_id.team_id.id,
        }
        return self.env['crm.team'].with_context(context)._get_default_team_id()
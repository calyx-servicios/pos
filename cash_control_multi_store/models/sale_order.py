from odoo import models, fields, api
import logging

_logger = logging.getLogger(__name__)


class SaleOrder(models.Model):
    _inherit = "sale.order"

    store_id = fields.Many2one(comodel_name="res.store")

    @api.onchange("cash_control_session_id", "warehouse_id")
    def _onchange_cc_session_id(self):
        for order in self:
            if order.cash_control_session_id:
                order.store_id = order.cash_control_session_id.config_id.store_id.id
            elif order.warehouse_id:  # keep original behavior
                order.store_id = order.warehouse_id.store_id.id
            else:
                order.store_id = False

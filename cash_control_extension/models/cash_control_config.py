from odoo import models, fields, api
import logging

_logger = logging.getLogger(__name__)


class CashControlConfig(models.Model):
    _inherit = "cash.control.config"

    accumulator_cash_id = fields.Many2one(
        comodel_name="cash.control.config",
        string="Accumulator Cashbox",
        domain="[('is_acum_cash_control','=',True)]",
    )

    team_id = fields.Many2one(comodel_name="crm.team", string="Sales Team")

    location_id = fields.Many2one(
        comodel_name="stock.location",
        string="Location",
        domain=[("usage", "=", "internal")],
        help="Default location to deduce stock on sales"
    )


from odoo import models, fields, api, _

import logging

_logger = logging.getLogger(__name__)


class CashControlSession(models.Model):
    _inherit = "cash.control.session"

    company_id = fields.Many2one(
        "res.company",
        string="Company",
        required=True,
        default=lambda self: self.env.company,
    )

    company_currency_id = fields.Many2one(
        related="company_id.currency_id", string="Company currency", readonly=True
    )

    user_id = fields.Many2one(comodel_name="res.users", string="Responsible")
    user_ids = fields.Many2many(comodel_name="res.users", string="Assignees")

    transfer_ids = fields.Many2many(
        string="transfers",
        comodel_name="account.bank.statement.line",
        compute="_compute_transfer_ids",
    )

    def invoice_ids_domain(self):
        return [
            ("journal_id.type", "in", ["sale","purchase"]),
        ]

    invoice_ids = fields.One2many(
        comodel_name="account.move",
        inverse_name="cash_control_session_id",
        string="Invoices",
        domain=invoice_ids_domain,
    )

    sale_invoice_ids = fields.Many2many(
        comodel_name="account.move",
        string="Sale Invoices",
        compute="_compute_invoice_ids",
    )

    purchase_invoice_ids = fields.Many2many(
        comodel_name="account.move",
        string="Purchase Invoices",
        compute="_compute_invoice_ids",
    )

    @api.depends("invoice_ids")
    def _compute_invoice_ids(self):
        for session in self:
            session.sale_invoice_ids = self.invoice_ids.filtered(
                lambda i: i.journal_id.type == "sale"
            )
            session.purchase_invoice_ids = self.invoice_ids.filtered(
                lambda i: i.journal_id.type == "purchase"
            )

    @api.depends("statement_id")
    def _compute_transfer_ids(self):
        for session in self:
            session.transfer_ids = self.env["account.bank.statement.line"].search(
                [
                    ("statement_id", "=", session.statement_id.id),
                    ("transaction_type", "in", ["TRANSFER_OUT", "TRANSFER_IN"]),
                ]
            )

    @api.model
    def create(self, vals):
        res = super().create(vals)
        try:
            res.user_id = self.env.user.id
        except Exception as e:
            _logger.error(e)
        return res

from odoo import fields, models


class SaleReport(models.Model):
    _inherit = "sale.report"

    session_date = fields.Datetime(string="Session Date",)

    def _query(self, with_clause="", fields=None, groupby="", from_clause=""):
        fields = fields or {}
        fields["session_date"] = ", s.session_date AS" " session_date"
        groupby += ", s.session_date"
        return super(SaleReport, self)._query(with_clause, fields, groupby, from_clause)
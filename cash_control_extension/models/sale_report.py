from odoo import fields, models


class SaleReport(models.Model):
    _inherit = "sale.report"

    session_date_start = fields.Datetime(string="Session Date Start",)
    session_date_end = fields.Datetime(string="Session Date End",)

    def _query(self, with_clause="", fields=None, groupby="", from_clause=""):
        fields = fields or {}
        fields["session_date_start"] = ", s.session_date_start AS" " session_date_start"
        fields["session_date_end"] = ", s.session_date_end AS" " session_date_end"
        groupby += ", s.session_date_start, s.session_date_end"
        return super(SaleReport, self)._query(with_clause, fields, groupby, from_clause)
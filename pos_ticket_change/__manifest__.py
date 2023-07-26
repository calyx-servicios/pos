# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
{
    "name": "Point of sale Ticket Change",
    "summary": """
        This module adds the functionality of printing 
        the change ticket for a sale.
    """,
    "author": "Calyx Servicios S.A.",
    "maintainers": ["PerezGabriela"],
    "website": "http://odoo.calyx-cloud.com.ar/",
    "license": "AGPL-3",
    "category": "Point of sale",
    "version": "13.0.1.0.0",
    "installable": True,
    "application": False,
    "depends": [
        "pos_all_in_one"
    ],
    "data": [
        "views/assets.xml",
    ],
    "qweb": [
        "static/src/xml/pos.xml"
    ],
}

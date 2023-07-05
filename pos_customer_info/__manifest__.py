# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
{
    "name": "POS customer info",
    "summary": """
        This module extends the POS receipt by adding customer information.
    """,
    "author": "Calyx Servicios S.A.",
    "maintainers": ["Zamora, Javier"],
    "website": "http://odoo.calyx-cloud.com.ar/",
    "license": "AGPL-3",
    "category": "Stock",
    "version": "13.0.1.0.0",
    "installable": True,
    "application": False,
    "depends": ['point_of_sale'],
    "data": [
        "views/import_library.xml",
        "views/pos_config.xml",
    ],
    "qweb": [
        "static/src/xml/pos_customer_info.xml",
    ],
}

# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
{
    "name": "POS Customer Required",
    "summary": """
        This module is required by the client before making a payment.
    """,
    "author": "Calyx Servicios S.A.",
    "maintainers": ["Zamora, Javier", "mbrecalyx"],
    "website": "http://odoo.calyx-cloud.com.ar/",
    "license": "AGPL-3",
    "category": "Point of Sale",
    "version": "13.0.3.0.0",
    "installable": True,
    "application": False,
    "depends": ["point_of_sale"],
    "data": [
        "views/import_library.xml",
        "views/pos_config.xml",
    ],
}

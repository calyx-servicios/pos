# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
{
    "name": "POS fields partner",
    "summary": """
        This module extends the customer data in the POS.
    """,
    "author": "Calyx Servicios S.A.",
    "maintainers": ["PerezGabriela"],
    "website": "http://odoo.calyx-cloud.com.ar/",
    "license": "AGPL-3",
    "category": "Stock",
    "version": "13.0.1.0.0",
    "installable": True,
    "application": False,
    "depends": ['point_of_sale', 'globalteckz_magento_2'],
    "data": [
        "views/pos_assets.xml",
    ],
    "qweb": [
        "static/src/xml/pos.xml",
    ],
}

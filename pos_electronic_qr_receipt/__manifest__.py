# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
{
    "name": "POS Electronic Receipts with QR code",
    "summary": '''
        This module adds the information of the invoice, data from the afip and generates
         a qr code in an electronic format receipt for the POS
    ''',
    "author": "Calyx Servicios S.A.",
    "maintainers": ["Zamora, Javier"],
    "website": "http://odoo.calyx-cloud.com.ar/",
    "license": "AGPL-3",
    "category": "Point of Sale",
    "version": "13.0.1.0.0",
    "installable": True,
    "application": False,
    "depends": [
        "point_of_sale"
    ],
    "data": [
        "views/import_library.xml",
        "views/pos_config.xml",
    ],
    "qweb": [
        "static/src/xml/pos_electronic_qr_receipt.xml",
    ],
}
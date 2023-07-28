# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
{
    "name": "Point of sale Promotion bulk product",
    "summary": """
        This module adds products to promotions in bulk.
    """,
    "author": "Calyx Servicios S.A.",
    "maintainers": ["PerezGabriela"],
    "website": "http://odoo.calyx-cloud.com.ar/",
    "license": "AGPL-3",
    "category": "Point of sale",
    "version": "13.0.1.1.0",
    "installable": True,
    "application": False,
    "depends": [
        "pos_promotion_season_brand"
    ],
    "data": [
        'data/product_category_data.xml',
        'views/point_of_sale_assets.xml',
        'views/product_product_view.xml'
    ],
}

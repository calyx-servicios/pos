# -*- coding: utf-8 -*-
{
    "name": "POS credit card automatic",
    "summary": """
        This module adds card functionality automatic to the point of sale.
    """,
    "author": "Calyx Servicios S.A.",
    "maintainers": ["PerezGabriela"],
    "website": "http://odoo.calyx-cloud.com.ar/",
    "category": "Point of sale",
    "version": "13.0.1.1.0",
    "installable": True,
    "application": False,
    "depends": [
        "credit_card_instalment_pos"
    ],
    "data": [
        "views/point_of_sale.xml",
    ],
}
# -*- coding: utf-8 -*-
{
    'name': "Implent in pos credit card instalment",
    'summary': """
        This module adds card functionality to the point of sale.
    """,
    'author': "Filoquin",
    "maintainers": ["Filoquin", "PerezGabriela"],
    'website': "http://www.sipecu.com.ar",
    'category': 'Point of sale',
    'version': '13.0.2.0.0',
    'depends': [
        'credit_card_instalment', 
        'point_of_sale',
        'pos_all_in_one',
        'pos_orders_all'
    ],
    'data': [
        # 'security/ir.model.access.csv',
        'views/pos_payment_method.xml',
        'views/pos_make_payment.xml',
        'views/point_of_sale.xml',
        'views/pos_payment.xml',
    ],
    'qweb': [
        'static/src/xml/card_instalment.xml',
    ],
}
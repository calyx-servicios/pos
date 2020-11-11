# -*- coding: utf-8 -*-
##############################################################################
#
#    Copyright (C) 2019  Calyx  (http://www.calyxservicios.com.ar)
#    All Rights Reserved.
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################
{
    'name': 'Pos Maxirest',
    'version': '11.0.1',
    'category': 'Tools',
    'author': "Calyx",
    'website': 'www.calyxservicios.com.ar',
    'license': 'AGPL-3',
    'summary': '''Pos Maxirest Features ''',
    'depends': [
        'base',
        'point_of_sale',
        'pos_restaurant',
        'account_document',
    ],
    'external_dependencies': {
    },
    'data': [
        'pos_assets.xml',
        'security/ir.model.access.csv',

        'report/paperformat.xml',
        'report/pos_template.xml',
        'report/pos_session_report.xml',
        'report/pos_session_template.xml',
        'report/pos_report.xml',
        'view/pos_session_view.xml',
    ],
    'demo': [
    ],
    'test': [
    ],
    'installable': True,
    'auto_install': False,
    'application': False,
}

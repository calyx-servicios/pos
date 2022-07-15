# -*- coding: utf-8 -*-
{
    "name": "Cash Control",
    "version": "13.0.0.2",
    "author": "Ing. Gabriela Rivero",
    "license": "LGPL-3",
    "category": "cash_control",
    "summary": """Cash Control""",
    "depends": [
        # 'sale_multi_store',
        "credit_card_instalment_sale",
        "l10n_ar",
        "account_payment_group",
        # 'account_multi_store',
    ],
    "data": [
        # "security/security.xml", saved for future reference
        "security/ir.model.access.csv",
        "wizards/add_credit_note.xml",
        "wizards/cash_control_details.xml",
        "wizards/cash_control_transfer_wizard.xml",
        "wizards/pos_box.xml",
        "views/account_bnk_stmt_cashbox.xml",
        # 'views/account_journal_view.xml',
        "views/account_payment_view.xml",
        "views/cash_control_config_view.xml",
        "views/cash_control_session_view.xml",
        "views/cash_control_transfer_cash_view.xml",
        "views/res_company.xml",
        "views/res_config_settings.xml",
        "views/menuitems.xml",
        "views/sale_order.xml",
        "report/cash_control_report.xml",
        "report/report_cashbox_template.xml",
        "report/report_cash_control_detail_template.xml",
        "report/report_saledetails.xml",
    ],
    "qweb": [],
    "installable": True,
}

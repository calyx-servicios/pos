# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
{
    "name": "DEBO Cash Control Extension",
    "summary": """
        Add DEBO specific fields and interactions.
    """,
    "author": "Calyx Servicios S.A.",
    "maintainers": ["marcooegg", "leandro090685"],
    "website": "https://odoo.calyx-cloud.com.ar/",
    "license": "AGPL-3",
    "category": "Endpoint",
    "version": "13.0.1.0.3",
    "development_status": "Production/Stable",
    "application": False,
    "installable": True,
    "external_dependencies": {
        "python": [],
        "bin": [],
    },
    "depends": [
        "base",
        "cash_control",
        "account_ux",
    ],
    "data": [
        "views/cash_control_config.xml",
        "views/cash_control_session.xml",
        "views/sale_views.xml",
    ],
}

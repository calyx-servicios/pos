from odoo import api, fields, models, _
from odoo.exceptions import ValidationError

MAX_INSTALMENT = 24


class PosPaymentMethod(models.Model):

    _inherit = 'pos.payment.method'

    card_id = fields.Many2one(
        'account.card',
        string='Card',
    )
    instalment_product_id = fields.Many2one(
        'product.product',
        string='Product to invoice',
        related='card_id.instalment_product_id'
    )
    
    instalment_ids = fields.One2many(
        'account.card.instalment',
        string='Instalments',
        related='card_id.instalment_ids'
    )



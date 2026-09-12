from flask import Blueprint, g
from backend.middleware.auth import token_required
from backend.utils.responses import success_response, error_response
from backend.services import inventory_service

inventory_bp = Blueprint('inventory', __name__, url_prefix='/api/inventory')

@inventory_bp.route('', methods=['GET'])
@token_required
def get_inventory():
    db = g.db
    items = list(db.inventory.find({'user_id': g.user_id}))
    for item in items:
        item['id'] = str(item.get('id', item['_id']))
        if '_id' in item:
            del item['_id']
    return success_response(items)

@inventory_bp.route('/<item_id>/use', methods=['POST'])
@token_required
def use_item(item_id):
    db = g.db
    try:
        res = inventory_service.use_item(db, g.user_id, item_id)
        return success_response(res)
    except ValueError as e:
        return error_response('INVENTORY_ERROR', str(e), 400)

@inventory_bp.route('/<item_id>/equip', methods=['POST'])
@token_required
def equip_item(item_id):
    db = g.db
    try:
        res = inventory_service.equip_item(db, g.user_id, item_id)
        return success_response(res)
    except ValueError as e:
        return error_response('INVENTORY_ERROR', str(e), 400)

@inventory_bp.route('/<item_id>/sell', methods=['POST'])
@token_required
def sell_item(item_id):
    db = g.db
    try:
        res = inventory_service.sell_item(db, g.user_id, item_id)
        return success_response(res)
    except ValueError as e:
        return error_response('INVENTORY_ERROR', str(e), 400)

@inventory_bp.route('/<item_id>/buy', methods=['POST'])
@token_required
def buy_item(item_id):
    db = g.db
    try:
        res = inventory_service.buy_item(db, g.user_id, item_id)
        return success_response(res)
    except ValueError as e:
        return error_response('INVENTORY_ERROR', str(e), 400)

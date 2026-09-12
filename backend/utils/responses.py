from flask import jsonify
from bson import ObjectId
from datetime import datetime

def _sanitize_mongo_objects(data):
    if isinstance(data, dict):
        new_dict = {}
        for k, v in data.items():
            if k == '_id':
                new_dict['id'] = str(v)
            elif isinstance(v, ObjectId):
                new_dict[k] = str(v)
            elif isinstance(v, datetime):
                new_dict[k] = v.isoformat()
            else:
                new_dict[k] = _sanitize_mongo_objects(v)
        return new_dict
    elif isinstance(data, list):
        return [_sanitize_mongo_objects(item) for item in data]
    elif isinstance(data, ObjectId):
        return str(data)
    elif isinstance(data, datetime):
        return data.isoformat()
    return data

def success_response(data=None, message=None, status_code=200):
    payload = {"success": True}
    if data is not None:
        payload["data"] = _sanitize_mongo_objects(data)
    if message is not None:
        payload["message"] = message
    return jsonify(payload), status_code

def error_response(code="BAD_REQUEST", message="An error occurred", status_code=400, details=None):
    payload = {
        "success": False,
        "error": {
            "code": code,
            "message": message
        }
    }
    if details is not None:
        payload["error"]["details"] = details
    return jsonify(payload), status_code

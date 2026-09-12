from functools import wraps
from flask import request, g
import jwt
from bson import ObjectId
from backend.config import Config
from backend.utils.responses import error_response

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return error_response('UNAUTHORIZED', 'Authorization header is missing', 401)
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return error_response('UNAUTHORIZED', 'Invalid Authorization header format. Expected Bearer <token>', 401)
        
        token = parts[1]
        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
            user_id = payload.get('user_id')
            if not user_id:
                return error_response('UNAUTHORIZED', 'Invalid token payload', 401)
            
            db = g.db
            user = db.users.find_one({'_id': ObjectId(user_id)})
            if not user:
                return error_response('UNAUTHORIZED', 'User not found or session invalid', 401)
            
            g.user_id = str(user['_id'])
            g.user = user
        except jwt.ExpiredSignatureError:
            return error_response('TOKEN_EXPIRED', 'Token has expired. Please log in again', 401)
        except jwt.InvalidTokenError:
            return error_response('UNAUTHORIZED', 'Invalid authentication token', 401)
        except Exception as e:
            return error_response('UNAUTHORIZED', f'Authentication failed: {str(e)}', 401)
        
        return f(*args, **kwargs)
    return decorated

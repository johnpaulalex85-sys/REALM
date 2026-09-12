import re
from bson import ObjectId

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

def is_valid_email(email: str) -> bool:
    if not email or not isinstance(email, str):
        return False
    return bool(EMAIL_REGEX.match(email.strip()))

def is_valid_password(password: str) -> bool:
    if not password or not isinstance(password, str):
        return False
    return len(password.strip()) >= 6

def is_valid_object_id(id_str: str) -> bool:
    if not id_str:
        return False
    try:
        ObjectId(id_str)
        return True
    except Exception:
        return False

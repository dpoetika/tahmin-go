from flask import Blueprint, request, jsonify
from app.services.auth_services import login_user, register_user
from app.middleware.rate_limit import rate_limit
auth_bp = Blueprint('auth', __name__)

@rate_limit
@auth_bp.post("/login")
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    result, status_code = login_user(username, password)
    return jsonify(result), status_code

@rate_limit
@auth_bp.post("/register")
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    result, status_code = register_user(username, password)
    return jsonify(result), status_code
from firebase_admin import db
from app.utils.security import hash_password, check_password, validate_password
import jwt
from datetime import datetime, timedelta,timezone
from flask import current_app
def login_user(username, password):
    if not (username and password):
        return {"error": "username and password required"}, 401
    
    try:
        user_ref = db.reference(f"users/{username}")
        user_data = user_ref.get()
        
        if not user_data:
            return {"error": "User not found"}, 401
        
        # Şifreyi kontrol et
        if not check_password(password, user_data.get('password', '')):
            return {"error": "Invalid password"}, 401
        
        # JWT token oluştur
        role = user_data.get("role", "user")
        token = jwt.encode({
            'username': username,
            'exp': datetime.now(timezone.utc) + timedelta(hours=24),
            "role":role,
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        user_info = {
            "balance": user_data.get('balance', 0),
            "coupons": user_data.get('coupons', {}),
            "username": user_data.get('username'),
            "token": token,
            "role":role,
        }
        
        return user_info, 200
        
    except Exception as err:
        return {"error": str(err)}, 401

def register_user(username, password):
    if not (username and password):
        return {"error": "Invalid Credentials"}, 401
    
    # Şifre validasyonu
    is_valid, message = validate_password(password)
    if not is_valid:
        return {"error": message}, 400
    
    # Kullanıcı adı validasyonu
    if len(username) < 3:
        return {"error": "Username must be at least 3 characters long"}, 400
    
    try:
        user_ref = db.reference(f"users/{username}")
        existing_user = user_ref.get()
        
        if existing_user:
            return {"error": "Username is already in use"}, 401
        
        # Şifreyi hash'le
        hashed_password = hash_password(password)
        
        user_data = {
            "username": username,
            "password": hashed_password,
            "balance": 200,
            "coupons": {},
            "created_at": datetime.now(timezone.utc).isoformat(),
            "role":"user",
        }
        
        user_ref.set(user_data)
        
        # Kayıt sonrası token oluştur
        token = jwt.encode({
            'username': username,
            'exp': datetime.now(timezone.utc) + timedelta(hours=24)
        }, 'your-secret-key', algorithm='HS256')
        
        return {
            "message": "User created successfully",
            "token": token
        }, 201
        
    except Exception as err:
        return {"error": str(err)}, 401
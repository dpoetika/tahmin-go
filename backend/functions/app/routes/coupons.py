from flask import Blueprint, request, jsonify
from app.services.coupon_services import post_coupon, check_coupons
from app.middleware.auth import token_required
from app.middleware.rate_limit import rate_limit

coupons_bp = Blueprint('coupons', __name__)

@coupons_bp.post("/")
@rate_limit
@token_required
def create_coupon(current_user):
    data = request.get_json()
    data['username'] = current_user['username']  # Token'dan kullanıcı adını al
    
    result, status_code = post_coupon(data)
    return jsonify(result), status_code


@coupons_bp.get("/check")
@rate_limit
@token_required
def check(current_user):
    # Sadece admin kullanıcılar için
    if current_user.get('role') != 'admin':
        return jsonify({'error': f'Unauthorized {current_user.get('role')}'}), 403
    
    result, status_code = check_coupons()
    return jsonify(result), status_code
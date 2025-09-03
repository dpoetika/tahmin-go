from flask import Blueprint, jsonify
from app.services.match_services import refresh_matches, get_match_details

matches_bp = Blueprint('matches', __name__)

@matches_bp.get("/refresh")
def refresh():
    result, status_code = refresh_matches()
    return jsonify(result), status_code

@matches_bp.get("/details")
@matches_bp.get("/details/<id>")
def details(id=None):
    result, status_code = get_match_details(id)
    return jsonify(result), status_code
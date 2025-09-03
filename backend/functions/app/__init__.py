from flask import Flask
from app.middleware.error_handler import register_error_handlers
from app.middleware.rate_limit import limiter, rate_limit
from datetime import datetime, timezone
def create_app():
    """
    Flask uygulama fabrikası fonksiyonu
    """
    app = Flask(__name__)
    
    # Config
    app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
    app.config['JSON_SORT_KEYS'] = False
    
    # Error handlers
    register_error_handlers(app)
    
    # Blueprint'leri kaydet
    from app.routes.auth import auth_bp
    from app.routes.matches import matches_bp
    from app.routes.coupons import coupons_bp
    from app.routes.forum import forum_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(matches_bp, url_prefix='/matches')
    app.register_blueprint(coupons_bp, url_prefix='/coupons')
    app.register_blueprint(forum_bp, url_prefix='/forum')
    # Kök route
    @app.get("/")
    @rate_limit
    def home():
        return {"status": "Server is alive", "version": "1.0.0"}, 200
    
    # Health check endpoint
    @app.get("/health")
    def health():
        
        return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}, 200
    
    return app
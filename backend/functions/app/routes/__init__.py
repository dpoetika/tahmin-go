# Routes paketinin dışa aktarılacak üyeleri
from app.routes.auth import auth_bp
from app.routes.matches import matches_bp
from app.routes.coupons import coupons_bp
from app.routes.forum import forum_bp
__all__ = ['auth_bp', 'matches_bp', 'coupons_bp',"forum_bp"]
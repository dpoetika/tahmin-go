from flask import jsonify,request
from functools import wraps
import time

class RateLimiter:
    def __init__(self, max_requests, time_window):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = {}

    def is_allowed(self, ip):
        current_time = time.time()
        if ip not in self.requests:
            self.requests[ip] = [current_time]
            return True
        
        # Eski istekleri temizle
        self.requests[ip] = [t for t in self.requests[ip] if current_time - t < self.time_window]
        
        if len(self.requests[ip]) < self.max_requests:
            self.requests[ip].append(current_time)
            return True
        
        return False

# Global rate limiter instance
limiter = RateLimiter(max_requests=100, time_window=3600)  # 100 requests/hour

def rate_limit(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        ip = request.remote_addr
        if not limiter.is_allowed(ip):
            return jsonify({'error': 'Rate limit exceeded. Try again later.'}), 429
        return f(*args, **kwargs)
    return decorated_function
from firebase_admin import db
from datetime import datetime,timezone
def post_blog(data):
    username = data.get('username')
    coupon = data.get('coupons')
    id = data.get('id')
    
    if not (username and coupon and id):
        return {"error": "Invalid Credentials"}, 401
    
    try:
        ref = db.reference(f"blogs")
        
        ref.child(id).set({
            "coupon": coupon,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "author":username,
        })
        return {"message": "Success"}, 201
    except Exception as err:
        return {"error": str(err)}, 401
    

    
def get_blogs():
    try:
        blogs_ref = db.reference("blogs").get() or {}

        return {"blogs": blogs_ref, "message": "Success"}, 200
    except Exception as err:
        return {"error": str(err)}, 401


def post_comment(data):
    username = data.get('username')
    post_id= data.get('post_id')
    comment = data.get('comment')
    
    if not (username and post_id and comment):
        return {"error": "Invalid Credentials"}, 401
    
    try:
        ref = db.reference(f"blogs/{post_id}/comments/")
        
        ref.push({
            "username": username,
            "comment": comment,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        return {"message": "Success"}, 201
    except Exception as err:
        return {"error": str(err)}, 401
    
def get_comments(post_id):
    try:
        
        blogs_ref = db.reference(f"blogs/{post_id}/comments").get() or {}

        return {"comments": blogs_ref, "message": "Success"}, 200
    except Exception as err:
        return {"error": str(err)}, 401

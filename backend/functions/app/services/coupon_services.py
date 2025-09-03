from firebase_admin import db
from check import check

def post_coupon(data):
    username = data.get('username')
    coupons = data.get('coupons')
    betAmount = data.get('betAmount')
    id = data.get('id')
    
    if not (username and coupons):
        return {"error": "Invalid Credentials"}, 401
    
    try:
        ref = db.reference(f"users/{username}/coupons")
        odd = 1
        matches = []
        
        for coupon in coupons:
            matches.append({
                "id": coupon["id"],
                "taraflar": coupon["taraflar"],
                "iddaa": coupon["iddaa"],
                "oran": coupon["oran"],
                "tahmin": coupon["tahmin"]
            })
            odd *= float(coupon["oran"])
        
        ref.child(id).set({
            "matches": matches,
            "odd": round(odd,2),
            "betAmount": betAmount,
        })
        
        balance_ref = db.reference(f"users/{username}/balance")
        current_balance = balance_ref.get() or 0
        balance_ref.set(current_balance - betAmount)
        
        return {"message": "Success"}, 201
    except Exception as err:
        return {"error": str(err)}, 401

def check_coupons():
    try:
        users = db.reference("users").get()  
        if not users:
            return {"message": "No users found"}, 200

        for username, userData in users.items():
            if not userData:
                continue
                
            coupons = userData.get("coupons", {})
            if not coupons:
                continue

            for couponId, coupon in coupons.items():
                matches = coupon.get("matches", [])
                if not matches:
                    continue
                
                all_correct = True
                for match in matches:
                    isTrue = check(
                        match.get("id"),
                        match.get("iddaa"),
                        match.get("tahmin")
                    )
                    if not isTrue:
                        all_correct = False
                        break

                if all_correct:
                    win_amount = float(coupon.get("betAmount", 0)) * float(coupon.get("odd", 1))
                    balance_ref = db.reference(f"users/{username}/balance")
                    current_balance = balance_ref.get() or 0
                    balance_ref.set(current_balance + win_amount)

        return {"message": "Success"}, 201

    except Exception as err:
        return {"error": str(err)}, 401
from firebase_admin import db
from get_odds import get_odds
from get_match_code import get_match_code

def refresh_matches():
    detailedRef = db.reference("matchesDetailed")
    matchesRef = db.reference("matches")

    matchesRef.set({})
    detailedRef.set({})
    try:
        match_codes = get_match_code()
        for match_code in match_codes:
            data = get_odds(match_code)
            allOdds = data[0]
            sumOdds = data[1]
            matchesRef.update(sumOdds)
            detailedRef.update(allOdds)
            
        return {"message": "Success"}, 201
    except Exception as e:
        return {"error": str(e)}, 401

def get_match_details(match_id=None):
    try:
        if match_id is not None:
            match_data = db.reference(f"/matchesDetailed/{match_id}").get()
            return match_data, 200
        else:
            matches_data = db.reference("/matches").get()
            return matches_data, 200
    except Exception as e:
        return {"error": str(e)}, 401
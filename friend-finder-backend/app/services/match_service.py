from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.db import users_collection
from bson import ObjectId

async def get_interest_matches(current_user_email: str):
    all_users = await users_collection.find({}, {"username": 1, "email": 1, "interests": 1}).to_list(length=None)
    current_user = next((u for u in all_users if u["email"] == current_user_email), None)

    if not current_user:
        return []

    others = [u for u in all_users if u["email"] != current_user_email]
    if not others:
        return []

    interests = [current_user["interests"]] + [user["interests"] for user in others]
    tfidf = TfidfVectorizer().fit_transform(interests)
    cosine_scores = cosine_similarity(tfidf[0:1], tfidf[1:]).flatten()

    suggestions = []
    for i, score in enumerate(cosine_scores):
        suggestions.append({
            "username": others[i]["username"],
            "email": others[i]["email"],
            "interests": others[i]["interests"],
            "similarity": round(float(score), 2)
        })

    suggestions = sorted(suggestions, key=lambda x: -x["similarity"])
    return suggestions[:5]

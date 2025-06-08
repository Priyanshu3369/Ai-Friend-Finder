from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Session, engine

match_bp = Blueprint("match", __name__, url_prefix="/match")

@match_bp.route("/", methods=["GET"])
@jwt_required()
def match_users():
    user_id = get_jwt_identity()
    with Session(engine) as session:
        current_user = session.get(User, user_id)
        all_users = session.exec(User.select()).all()

        matches = []
        for user in all_users:
            if user.id == current_user.id or not user.mbti_summary:
                continue

            mbti_score = 100 if user.mbti_summary == current_user.mbti_summary else 50
            emotion_match = user.emotion_label == current_user.emotion_label
            emotion_score = 100 if emotion_match else 60

            total_score = (mbti_score * 0.6) + (emotion_score * 0.4)

            matches.append({
                "name": user.name,
                "email": user.email,
                "mbti": user.mbti_summary,
                "emotion": user.emotion_label,
                "score": round(total_score, 2)
            })

        matches = sorted(matches, key=lambda x: x["score"], reverse=True)
        return jsonify(matches)

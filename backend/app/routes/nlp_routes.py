from flask import Blueprint, request, jsonify
from app.nlp.emotion_model import detect_emotion
from app.nlp.mbti_model import analyze_mbti
from flask_jwt_extended import jwt_required , get_jwt_identity
from app.models import User, engine, Session

nlp_bp = Blueprint("nlp", __name__, url_prefix="/nlp")

@nlp_bp.route("/analyze", methods=["POST"])
@jwt_required()
def analyze_text():
    user_id = get_jwt_identity()
    data = request.get_json()
    text = data.get("text")

    if not text:
        return jsonify({"error": "Text is required"}), 400

    emotion = detect_emotion(text)
    mbti = analyze_mbti(text)

    with Session(engine) as session:
        user = session.get(User, user_id)
        user.mbti_summary = mbti["summary"]
        user.emotion_label = emotion["label"]
        session.add(user)
        session.commit()

    return jsonify({
        "emotion": emotion,
        "mbti": mbti
    })
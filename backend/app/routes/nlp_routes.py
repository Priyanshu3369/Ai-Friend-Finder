from flask import Blueprint, request, jsonify
from app.nlp.emotion_model import detect_emotion
from app.nlp.mbti_model import analyze_mbti
from flask_jwt_extended import jwt_required

nlp_bp = Blueprint("nlp", __name__, url_prefix="/nlp")

@nlp_bp.route("/analyze", methods=["POST"])
@jwt_required()
def analyze_text():
    data = request.get_json()
    text = data.get("text")
    if not text:
        return jsonify({"error": "Text is required"}), 400

    emotion = detect_emotion(text)
    mbti = analyze_mbti(text)

    return jsonify({
        "emotion": emotion,
        "mbti": mbti
    })

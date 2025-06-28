from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from extensions import mongo

user_bp = Blueprint('users', __name__)

@user_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_users():
    current_user_id = get_jwt_identity()
    users = mongo.db.users.find({"_id": {"$ne": ObjectId(current_user_id)}})
    user_list = [{"_id": str(u["_id"]), "email": u["email"]} for u in users]
    return jsonify(user_list), 200

@user_bp.route('/me', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "email": user["email"],
        "interests": user.get("interests", []),
        "personality": user.get("personality", ""),
        "mood": user.get("mood", "")
    }), 200

@user_bp.route('/update', methods=['POST'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "interests": data.get("interests", []),
            "personality": data.get("personality", ""),
            "mood": data.get("mood", "")
        }}
    )
    return jsonify({"message": "Profile updated"}), 200

@user_bp.route('/send-request/<receiver_id>', methods=['POST'])
@jwt_required()
def send_friend_request(receiver_id):
    sender_id = get_jwt_identity()
    mongo.db.friend_requests.insert_one({
        "sender_id": sender_id,
        "receiver_id": receiver_id,
        "status": "pending"
    })
    return jsonify({"message": "Friend request sent"}), 201

@user_bp.route('/accept-request/<sender_id>', methods=['POST'])
@jwt_required()
def accept_friend_request(sender_id):
    receiver_id = get_jwt_identity()

    mongo.db.friend_requests.update_one(
        {"sender_id": sender_id, "receiver_id": receiver_id},
        {"$set": {"status": "accepted"}}
    )
    return jsonify({"message": "Friend request accepted"}), 200

@user_bp.route('/friends', methods=['GET'])
@jwt_required()
def get_friends():
    user_id = get_jwt_identity()
    accepted = mongo.db.friend_requests.find({
        "$or": [
            {"sender_id": user_id},
            {"receiver_id": user_id}
        ],
        "status": "accepted"
    })

    friend_ids = set()
    for fr in accepted:
        if fr["sender_id"] != user_id:
            friend_ids.add(fr["sender_id"])
        if fr["receiver_id"] != user_id:
            friend_ids.add(fr["receiver_id"])

    friends = mongo.db.users.find({"_id": {"$in": [ObjectId(fid) for fid in friend_ids]}})
    return jsonify([{"_id": str(f["_id"]), "email": f["email"]} for f in friends]), 200

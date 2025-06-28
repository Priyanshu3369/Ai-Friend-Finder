from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from extensions import mongo

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400

    users = mongo.db.users
    if users.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already exists'}), 400

    hashed_password = generate_password_hash(data['password'])
    users.insert_one({
        'email': data['email'],
        'password': hashed_password
    })
    return jsonify({'message': 'User registered'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = mongo.db.users.find_one({'email': data['email']})

    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = create_access_token(identity=str(user['_id']))
    return jsonify({'token': token}), 200

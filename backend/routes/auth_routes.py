from flask import Blueprint , request , jsonify
from services.auth_service import register_user , login_user

auth_bp = Blueprint('auth',__name__)

@auth_bp.route('/register',methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    return register_user(name, email, password)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    return login_user(email, password)

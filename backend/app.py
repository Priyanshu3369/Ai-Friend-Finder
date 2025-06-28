from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import mongo, jwt
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from flask_socketio import SocketIO
from routes.chat_socket import init_chat_events

# ✅ Create socketio instance globally
socketio = SocketIO(cors_allowed_origins="*")

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ Initialize extensions
    mongo.init_app(app)
    jwt.init_app(app)

    # ✅ CORS setup
    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    # ✅ Register routes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')

    # ✅ Initialize SocketIO with app
    socketio.init_app(app, cors_allowed_origins="*")
    init_chat_events(socketio)

    return app

app = create_app()

if __name__ == '__main__':
    socketio.run(app, debug=True)
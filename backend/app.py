from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import jwt, mongo
from routes.auth_routes import auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    jwt.init_app(app)
    mongo.init_app(app)
    CORS(app, supports_credentials=True)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)

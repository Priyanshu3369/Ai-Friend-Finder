from flask import Flask
from flask_cors import CORS
from extensions import mongo
from config import Config
from routes.auth_routes import auth_bp
from utils.custom_json_encoder import CustomJSONProvider

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.json = CustomJSONProvider(app)

    CORS(app)
    mongo.init_app(app)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, jwt, bcrypt
from routes.auth_routes import auth_bp
from flask_sqlalchemy import SQLAlchemy

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    app.register_blueprint(auth_bp)

    @app.route("/")
    def home():
        return {"message": "AI Friend Finder backend is running!"}

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)

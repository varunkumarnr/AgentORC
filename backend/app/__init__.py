from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    # CORS(app) 
    

    CORS(app, resources={
        r"/*": {
            "origins": "http://localhost:3000",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": "*",
            "supports_credentials": True
        }
        })

    db.init_app(app)
    migrate.init_app(app, db)

    # Import models after initializing app to avoid circular imports
    from models import Agent, Memory
    from routes import main
    
    app.register_blueprint(main)

    return app
import flask as f
from flask_cors import CORS
from auth_manager import auth_bp
from dbmanager import cursor

app = f.Flask(__name__)
CORS(app, resources={"/api/*": {"origins": ["http://localhost:5173"]}})


app.config["CORS_ORIGINS"] = ["http://localhost:5173"]
app.register_blueprint(auth_bp)


if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
import flask as f
from flask_cors import CORS
from auth_manager import auth_bp
from generic_user import user_bp
from fuc import fuc_bp
from lur import lurjs, lurpy, lurlua
from dbmanager import cursor

# F.U.C. - Flare User Content

ORIGIN = "http://localhost:5173"

app = f.Flask(__name__)
CORS(app, resources={"/api/*": {"origins": [ORIGIN]}})


app.config["CORS_ORIGINS"] = [ORIGIN]
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(fuc_bp)
app.register_blueprint(lurjs.lurjs_bp)
app.register_blueprint(lurpy.lurpy_bp)
app.register_blueprint(lurlua.lurlua_bp)


if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)

cursor.close()
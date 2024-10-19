from flask import Blueprint, request, jsonify
import dbmanager as dbm

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/api/uauth:def', methods=["POST"])
def user_auth():
    return {"login"}


@auth_bp.route('/api/user_make:def', methods=["POST"])
def user_registry():
    request_data = request.json
    uname = request_data.get('username')
    email = request_data.get('email')
    pwd = request_data.get('password')
    pwd2 = request_data.get('confirm_password')

    print(pwd, pwd2)


    try:
        dbm.add_user(uname, pwd, pwd2, email, False, None)

        return jsonify({"result": True, "reason": "All info is right!"})
    except Exception as e:
        return jsonify({"result": False, "reason": str(e)})
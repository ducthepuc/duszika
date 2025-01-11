from flask import Blueprint, request, jsonify
from flask_cors import CORS
import dbmanager as dbm

auth_bp = Blueprint('auth', __name__)

CORS(auth_bp, origins=["http://localhost:3000"], methods=["GET", "POST", "OPTIONS"])

@auth_bp.route('/api/uauth:def', methods=["POST"])
def user_auth():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        user = dbm.login_user_via_auth(email, password)
        print(user)
        return {"result": True, "reason": "Cuz you put everything in correctly!",
                "data": {"username": user[5], "token": user[4], "id": user[0]}}
    except Exception as e:
        return {"result": False, "reason": str(e), "data": {}}


@auth_bp.route('/api/user_make:def', methods=["POST"])
def user_registry():
    request_data = request.json
    uname = request_data.get('name')
    email = request_data.get('email')
    pwd = request_data.get('password')
    pwd2 = request_data.get('confirm_password')

    try:
        dbm.add_user(uname, pwd, pwd2, email, False, None)

        return jsonify({"result": True, "reason": "All info is right!"})
    except Exception as e:
        return jsonify({"result": False, "reason": str(e)})


@auth_bp.route('/api/get_user_by_token', methods=["GET"])
def get_user():
    try:
        data = request.headers

        if not data:
            return jsonify({'error': 'No data received'}), 400

        token = data.get('Authorization')

        if not token:
            return jsonify({'error': 'No token provided'}), 400

        user_data = dbm.get_user_by_token(token)
        profile_data = dbm.get_profile(user_data[2])

        if user_data:
            response = {
                'username': profile_data[1],
                'id': user_data[0]
            }
            return jsonify(response)
        else:
            return jsonify({'error': 'User not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/api/me')
def get_me():
    auth = request.headers.get("Authorization")
    print(f"GET /api/me - Auth token: {auth}")

    if auth is None:
        print("No auth token provided")
        return {
            "result": False,
            "reason": "Please provide a valid user key"
        }
    
    usr = dbm.get_user_by_token(auth)
    print(f"User data from token: {usr}")
    
    if not usr:
        print("User not found for token")
        return {
            "result": False,
            "reason": "User not found"
        }
    
    profile_id = usr[0]
    profile = dbm.get_profile(profile_id)
    print(f"Profile data: {profile}")

    if not profile:
        print("Invalid profile id")
        return {
            "result": False,
            "reason": "Invalid profile id"
        } 

    response = {
        "username": profile[1],
        "bio": profile[2],
        "streak": profile[3],
        "profilePicture": f"http://localhost:5000/cdn/pfp/{usr[0]}",
        "id": usr[0]
    }
    print(f"Sending response: {response}")
    return response
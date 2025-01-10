from flask import Blueprint, request, send_from_directory, abort
import dbmanager as dbm
from PIL import Image

user_bp = Blueprint('generic_user', __name__)


# @user_bp.route('/api/v1/<path:uid>/picture', methods=['GET'])
# def get_pfp(uid):
#     return f"UID: {uid}"


@user_bp.route('/cdn/pfp/<path:uid>')
def get_pfp(uid):
    try:
        uid = int(uid)
        return send_from_directory("../cdn", f"images/{uid}.png")
    except Exception:
        return send_from_directory('../cdn', "images/error.png")


@user_bp.route('/api/v1/configure', methods=["PUT"])
def change_user():
    auth = request.headers.get("Authorization")
    changes = request.json

    for change, value in changes.items():
        if change == "username":
            dbm.change_display_name(auth, value)
        elif change == "bio":
            dbm.change_bio(auth, value)

    return {"response": True}


@user_bp.route('/api/me')
def get_me():
    auth = request.headers.get("Authorization")

    if auth is None:
        return {
            "result": False,
            "reason": "Please provide a valid user key"
        }

    usr = dbm.get_user_by_token(auth)
    if not usr:
        return {
            "result": False,
            "reason": "User not found"
        }
    profile_id = usr[2]
    profile = dbm.get_profile(profile_id)

    if not profile:
        return {
            "result": False,
            "reason": "Invalid profile id"
        }

    return {
        "username": profile[1],
        "bio": profile[2],
        "streak": profile[3],
        "profilePicture": f"http://localhost:5000/cdn/pfp/{usr[0]}",
        "role": usr[9],
        "mention": usr[6],
        "member_since": usr[7]
    }


@user_bp.route('/api/change_pfp', methods=['POST'])
def change_pfp():
    auth = request.headers.get("Authorization")

    if auth is None:
        return {
            "result": False,
            "reason": "Please provide a valid user key"
        }

    usr = dbm.get_user_by_token(auth)
    if not usr:
        return {
            "result": False,
            "reason": "User not found"
        }

    uid = usr[0]

    file_stream = request.files.get('pfp')

    img = Image.open(file_stream.stream)
    img.verify()

    width, height = img.size

    if width > 200 or height > 200:
        return {
            "result": False
        }

    file_stream.save(f'../cdn/images/{uid}.png')

    return {
        "result": True
    }
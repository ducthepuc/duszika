from flask import Blueprint, request, send_from_directory, abort
import dbmanager as dbm
import io

user_bp = Blueprint('generic_user', __name__)


@user_bp.route('/api/v1/me')
def me():
    data = request.json
    token = data["Auth"]


# @user_bp.route('/api/v1/<path:uid>/picture', methods=['GET'])
# def get_pfp(uid):
#     return f"UID: {uid}"


@user_bp.route('/cdn/pfp/<path:uid>')
def get_pfp(uid):
    try:
        uid = int(uid)
        return send_from_directory("../cdn", f"images/{uid}.png")
    except Exception:
        return send_from_directory('../cdn', 'images/error.png')


@user_bp.route('/api/v1/upload_pfp', methods=['POST', 'OPTIONS'])
def upload_pfp():
    auth = request.headers.get('Authorization')
    if auth is None:
        return {
            "result": False,
            "reason": "Please provide valid user token"
        }

    files = request.files
    if len(files) == 0:
        return {
            "result": False,
            "reason": "Please provide a file"
        }

    img = files.get("pfp")
    if img is None:
        return {
            "result": False,
            "reason": "Please provide a file with pfp key"
        }

    usr = dbm.get_user_by_token(auth)

    uid = usr[0]

    file_stream = img.stream

    with open(f"../cdn/images/{uid}.png", "wb") as f:
        f.write(file_stream.read())

    return {
        "result": True,
        "reason": "Picture uploaded"
    }


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

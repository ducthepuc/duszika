from flask import Blueprint, request, send_from_directory, abort
import dbmanager as dbm

user_bp = Blueprint('generic_user', __name__)


@user_bp.route('/api/v1/me')
def me():
    data = request.json
    token = data["Auth"]


# @user_bp.route('/api/v1/<path:uid>/picture', methods=['GET'])
# def get_pfp(uid):
#     return f"UID: {uid}"


@user_bp.route('/api/v1/<path:uid>/picture')
def get_pfp(uid):
    try:
        uid = int(uid)
        return send_from_directory("../cdn", f"images/{uid}.png")
    except Exception:
        return abort(404)


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

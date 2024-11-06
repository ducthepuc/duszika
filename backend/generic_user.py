from flask import Blueprint, request
import dbmanager as dbm

user_bp = Blueprint('generic_user', __name__)

@user_bp.route('/api/v1/me')
def me():
    data = request.json
    token = data["Auth"]


@user_bp.route('/api/v1/get_pfp')
def get_pfp():
    ...

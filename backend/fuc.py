from flask import Blueprint, request, send_from_directory

fuc_bp = Blueprint("fuc", __name__)


@fuc_bp.route("/cdn/course/<cid>", methods=["GET"])
def cdnCourse(cid):
    return send_from_directory("cdn/course", cid + ".fc")

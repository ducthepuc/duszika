from flask import Blueprint, request

lurjs_bp = (Blueprint("lurjs", __name__))


@lurjs_bp.route("/api/lur/js", methods=["POST"])
def lurjs():
    data = request.json
    code = data["code"]

    return {}

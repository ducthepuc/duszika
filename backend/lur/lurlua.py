from flask import Blueprint, request
from lupa import LuaRuntime

lurlua_bp = (Blueprint("lurlua", __name__))


#lua.execute

def lua_run(code):
    lua = LuaRuntime()
    outputs = []

    def print_wrapper(*args, **kwargs):
        outputs.append(" ".join(map(str, args)))

    lua.globals()['print'] = print_wrapper
    code = lua.execute(code)

    return code, outputs

@lurlua_bp.route("/api/lur/lua", methods=["POST"])
def lurlua():
    data = request.json
    code = data["code"]
    output, log = lua_run(code)

    return {"output": output, 'log': log}

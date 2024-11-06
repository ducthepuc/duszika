from flask import Blueprint, request

lurpy_bp = (Blueprint("lurpy", __name__))


def safe_exec(code_string, env: dict = None):
    console_prints = []

    def print_hook(*args, **kwargs):
        console_prints.append(" ".join(map(str, args)))

    safe_globals = {
        '__builtins__': {
            'print': print_hook,
            'range': range,
            'len': len,
        }
    }
    if env is None:
        env = {}
    else:
        env2 = {}
        for k, v in env.items():
            if k == '__builtins__':
                for name in v:
                    env2[name] = __builtins__[name]
            else:
                env2[k] = eval(v, safe_globals)

        env = {'__builtins__': safe_globals['__builtins__'] | env2}

    safe_globals.update(env)
    print(safe_globals)
    return exec(code_string, safe_globals), console_prints


@lurpy_bp.route("/api/lur/py", methods=["POST"])
def lurpy():
    data = request.json
    code = data["code"]
    env_data = data["env_data"]
    output, printed = safe_exec(code, env_data)

    return {"output": printed[-1], 'log': printed}

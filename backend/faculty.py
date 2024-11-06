import requests

print(requests.post("http://127.0.0.1:5000/api/lur/py", json={
    "code": """test()""",
    "env_data": {
         '__builtins__':  ["min", "max"],
        'test': "lambda : print('hi cat')"
    }
}).json())
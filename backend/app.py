from flask import Flask as flask
from flask_cors import CORS as cors

app = flask(__name__)
cors(app)

@app.route('/api/data')
def get_data():
    return {"message": "Hello from Flask"}
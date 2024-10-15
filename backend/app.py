from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/api/data')
def get_data():
    return {"message": "I'm tired of this"}

@app.route('/login', methods=["POST"], strict_slashes=False)
def login():
    return{"login"}

@app.route('/register', methods=["POST"], strict_slashes=False)
def login():
    return{"regi"}
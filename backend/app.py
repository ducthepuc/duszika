import flask as f
from flask_cors import CORS
from auth_manager import auth_bp
from generic_user import user_bp
from file_manager import file_bp
from lur import lurjs, lurpy, lurlua
import socket
import signal
import sys
import atexit

APP_PORT = 5000
FRONTEND_PORT = 3000

ORIGINS = [f"http://localhost:{FRONTEND_PORT}"]

def cleanup_port():
    """Cleanup function to release the port"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.bind(('localhost', APP_PORT))
        sock.close()
        print(f"\nPort {APP_PORT} cleaned up successfully")
    except socket.error:
        print(f"\nPort {APP_PORT} was already free")

def signal_handler(sig, frame):
    """Handle Ctrl+C signal"""
    print("\nReceived Ctrl+C. Cleaning up...")
    cleanup_port()
    sys.exit(0)

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(('localhost', port))
            return False
        except socket.error:
            return True

app = f.Flask(__name__)
CORS(app, 
     resources={r"/api/*": {
         "origins": ORIGINS,
         "methods": ["GET", "POST", "OPTIONS", "PUT"],
         "allow_headers": ["Content-Type", "Authorization"]
     }},
     supports_credentials=True)

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(file_bp)
app.register_blueprint(lurjs.lurjs_bp)
app.register_blueprint(lurpy.lurpy_bp)
app.register_blueprint(lurlua.lurlua_bp)

signal.signal(signal.SIGINT, signal_handler)
atexit.register(cleanup_port)

@app.route('/debug/routes')
def list_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': list(rule.methods),
            'path': str(rule)
        })
    return f.jsonify(routes)

if __name__ == '__main__':
    if is_port_in_use(APP_PORT):
        print(f"Port {APP_PORT} is already in use. Attempting to clean up...")
        cleanup_port()
    
    try:
        app.run(port=APP_PORT, debug=True)
    except KeyboardInterrupt:
        print("\nShutting down gracefully...")
        cleanup_port()
        sys.exit(0)
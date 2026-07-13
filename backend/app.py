from flask import Flask
from flask_cors import CORS
from routes.search import search_bp
from routes.upload import upload_bp
from routes.auth import auth_bp

app = Flask(__name__)

# IMPORTANT CORS FIX 👇
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.register_blueprint(search_bp, url_prefix="/api")
app.register_blueprint(upload_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")

@app.route("/")
def home():
    return {"message": "SmartBuy Backend Running 🚀"}

if __name__ == "__main__":
    app.run(debug=True, port=5001)
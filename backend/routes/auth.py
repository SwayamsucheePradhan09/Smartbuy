import os
import json
from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)
USERS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "users.json")

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    try:
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []

def save_users(users):
    try:
        with open(USERS_FILE, "w") as f:
            json.dump(users, f, indent=4)
        return True
    except Exception as e:
        print(f"Error saving users: {e}")
        return False

@auth_bp.route("/register", methods=["POST", "OPTIONS"])
def register():
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    gender = data.get("gender", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    confirm_password = data.get("confirm_password", "")

    if not name or not gender or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    users = load_users()
    if any(u.get("email", "").lower() == email.lower() for u in users):
        return jsonify({"error": "User with this email already exists"}), 400

    new_user = {
        "name": name,
        "gender": gender,
        "email": email,
        "password": password # In a production environment, use a secure hashing algorithm like bcrypt
    }

    users.append(new_user)
    if save_users(users):
        return jsonify({
            "message": "User registered successfully!",
            "user": {
                "name": name,
                "gender": gender,
                "email": email
            }
        }), 201
    else:
        return jsonify({"error": "Failed to save user data"}), 500

@auth_bp.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    users = load_users()
    matched_user = None
    for u in users:
        if u.get("email", "").lower() == email.lower() and u.get("password") == password:
            matched_user = u
            break

    if not matched_user:
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful!",
        "user": {
            "name": matched_user["name"],
            "gender": matched_user["gender"],
            "email": matched_user["email"]
        },
        "token": f"mock-jwt-token-{matched_user['email']}"
    }), 200

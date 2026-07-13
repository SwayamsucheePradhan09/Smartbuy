import os
import json
from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)
USERS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "users.json")

IN_MEMORY_USERS = []

def load_users():
    global IN_MEMORY_USERS
    if not os.path.exists(USERS_FILE):
        return IN_MEMORY_USERS
    try:
        with open(USERS_FILE, "r") as f:
            loaded = json.load(f)
            # Sync in-memory list
            IN_MEMORY_USERS = loaded
            return loaded
    except Exception as e:
        print(f"Failed to read users.json, using in-memory list: {e}")
        return IN_MEMORY_USERS

def save_users(users):
    global IN_MEMORY_USERS
    IN_MEMORY_USERS = users
    try:
        with open(USERS_FILE, "w") as f:
            json.dump(users, f, indent=4)
        return True
    except Exception as e:
        # On serverless platforms like Vercel, writing to disk fails.
        # We fall back to in-memory storage and return True.
        print(f"Failed to write users.json, falling back to in-memory: {e}")
        return True

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

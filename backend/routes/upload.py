from flask import Blueprint, request, jsonify
import os
from services.image_logic import get_product_query
from services.scraper import scrape_all

upload_bp = Blueprint("upload", __name__)

UPLOAD_FOLDER = "/tmp" if os.environ.get("VERCEL") or not os.access(".", os.W_OK) else "temp_uploads"
if not os.path.exists(UPLOAD_FOLDER):
    try:
        os.makedirs(UPLOAD_FOLDER)
    except Exception as e:
        print(f"Failed to create upload folder: {e}")

@upload_bp.route("/upload", methods=["POST"])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # 1. Detect product name
    query = get_product_query(file_path)
    
    # 2. Scrape results for that query
    results = scrape_all(query)
    
    # 3. Clean up
    try:
        os.remove(file_path)
    except:
        pass

    return jsonify({
        "detected_product": query,
        "results": results
    })

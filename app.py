from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from internship_agent import scrape_website_text, generate_internship_content
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing so GitHub Pages can request this backend

# Setup rate limiting to prevent abuse
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["20 per hour"]
)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/generate", methods=["POST"])
@limiter.limit("5 per minute")
def generate():
    data = request.json
    url = data.get("url")
    api_key = os.getenv("NVIDIA_API_KEY")
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
    if not api_key:
        return jsonify({"error": "Backend configuration error: API Key missing"}), 500
        
    try:
        raw_text = scrape_website_text(url)
        content = generate_internship_content(raw_text, url, api_key)
        
        # Optionally, we can attempt to parse the content into Poster and WhatsApp Caption
        # We will let the frontend handle the display. It might be easier to just split by "TASK 2: WHATSAPP CAPTION" or similar if we want.
        # But for now, we just pass the full content and the frontend can parse it.
        
        return jsonify({
            "success": True,
            "content": content
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)

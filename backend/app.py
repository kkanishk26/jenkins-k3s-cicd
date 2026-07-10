from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route("/api/hello")
def hello():
    return jsonify(
        message="Hello from Flask backend",
        version=os.environ.get("APP_VERSION", "dev"),
    )

@app.route("/health")
def health():
    return jsonify(status="ok"), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

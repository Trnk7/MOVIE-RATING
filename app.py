import os
import joblib

from flask import Flask, request, jsonify, render_template


app = Flask(__name__)


BASE_DIR = os.path.dirname(__file__)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "movie_model.joblib"
)

ENCODER_PATH = os.path.join(
    BASE_DIR,
    "genre_encoder.joblib"
)


# Load saved model
model = joblib.load(MODEL_PATH)

# Load saved genre encoder
label_encoder = joblib.load(ENCODER_PATH)


@app.route("/")
def index():
    genres = sorted(
        label_encoder.classes_.tolist()
    )

    return render_template(
        "index.html",
        genres=genres
    )


@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        budget = float(data["budget"])
        duration = float(data["duration"])
        genre = data["genre"]
        votes = float(data["num_voted_users"])
        year = float(data["title_year"])

        if genre not in label_encoder.classes_:
            return jsonify({
                "success": False,
                "error": "Invalid genre selected."
            }), 400

        encoded_genre = int(
            label_encoder.transform([genre])[0]
        )

        features = [[
            budget,
            duration,
            encoded_genre,
            votes,
            year
        ]]

        prediction = float(model.predict(features)[0])
        rating = round(prediction, 2)

        return jsonify({
            "success": True,
            "prediction": rating,
            "confidence": round(min(max((rating / 10) * 100, 0), 100), 2),
            "message": f"Estimated IMDb rating: {rating:.2f}/10"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 400


if __name__ == "__main__":

    app.run(
        debug=True
    )

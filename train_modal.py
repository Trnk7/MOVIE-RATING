import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeRegressor

BASE_DIR = os.path.dirname(__file__)
DATASET_PATH = os.path.join(BASE_DIR, "movie_metadata.csv")
MODEL_PATH = os.path.join(BASE_DIR, "movie_model.joblib")
ENCODER_PATH = os.path.join(BASE_DIR, "genre_encoder.joblib")

df = pd.read_csv(DATASET_PATH)

required_cols = [
    "budget",
    "duration",
    "genres",
    "num_voted_users",
    "title_year",
    "imdb_score",
]

df = df[required_cols].dropna().copy()

df["main_genre"] = df["genres"].astype(str).apply(
    lambda x: x.split("|")[0]
)

le = LabelEncoder()
df["main_genre"] = le.fit_transform(df["main_genre"])

X = df[
    ["budget", "duration", "main_genre", "num_voted_users", "title_year"]
]
y = df["imdb_score"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

model = DecisionTreeRegressor(
    max_depth=8,
    random_state=42,
)

model.fit(X_train, y_train)

joblib.dump(model, MODEL_PATH)
joblib.dump(le, ENCODER_PATH)

print("Model saved:", MODEL_PATH)
print("Encoder saved:", ENCODER_PATH)
print("R² score:", round(model.score(X_test, y_test), 4))

import os
import traceback
import librosa
import numpy as np
import tensorflow as tf

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model

# ==================================================
# CONFIG
# ==================================================

MODEL_PATH = "model/best_model.keras"

IMG_SIZE = 128
N_MELS = 128
SR = 22050

# ==================================================
# LOAD MODEL
# ==================================================

print("Loading model...")

model = load_model(
    MODEL_PATH,
    compile=False
)

print("Model loaded.")
print("Input shape :", model.input_shape)
print("Output shape:", model.output_shape)

# ==================================================
# FASTAPI
# ==================================================

app = FastAPI(
    title="Music Emotion Recognition API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================================================
# TEST ENDPOINT
# ==================================================

@app.get("/")
def root():
    return {
        "message": "MER API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "OK"
    }

# ==================================================
# AUDIO TO MEL-SPECTROGRAM
# ==================================================

def audio_to_mel(path):

    print("Loading audio...")

    y, sr = librosa.load(
        path,
        sr=SR,
        mono=True
    )

    print("Audio shape:", y.shape)

    start = 30 * sr
    end = 60 * sr

    if len(y) > end:
        y = y[start:end]

    target_length = 30 * sr

    if len(y) < target_length:
        y = np.pad(
            y,
            (0, target_length - len(y))
        )

    mel = librosa.feature.melspectrogram(
        y=y,
        sr=sr,
        n_mels=N_MELS,
        n_fft=2048,
        hop_length=512
    )

    mel = librosa.power_to_db(
        mel,
        ref=np.max
    )

    mel = librosa.util.normalize(
        mel
    )

    mel = tf.image.resize(
        mel[..., np.newaxis],
        (IMG_SIZE, IMG_SIZE)
    ).numpy()

    mel = mel.astype(
        np.float32
    )

    print("Mel shape:", mel.shape)

    return mel

# ==================================================
# PREDICT
# ==================================================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    file_path = None

    try:

        print("\n========== NEW REQUEST ==========")
        print("Filename :", file.filename)

        os.makedirs(
            "temp",
            exist_ok=True
        )

        file_path = os.path.join(
            "temp",
            file.filename
        )

        contents = await file.read()

        with open(
            file_path,
            "wb"
        ) as f:
            f.write(contents)

        print("File saved.")

        # =====================================
        # PREPROCESS
        # =====================================

        mel = audio_to_mel(
            file_path
        )

        X = np.expand_dims(
            mel,
            axis=0
        )

        X = X.astype(
            np.float32
        )

        print("Input shape:", X.shape)

        # =====================================
        # PREDICTION
        # =====================================

        pred_valence, pred_arousal = model.predict(
            X,
            verbose=0
        )

        valence = float(
            pred_valence[0][0]
        )

        arousal = float(
            pred_arousal[0][0]
        )

        print(
            f"Valence: {valence:.4f} | "
            f"Arousal: {arousal:.4f}"
        )

        return {
            "success": True,
            "valence": round(
                valence,
                4
            ),
            "arousal": round(
                arousal,
                4
            )
        }

    except Exception:

        print("\n===== ERROR =====")
        traceback.print_exc()

        return {
            "success": False,
            "valence": None,
            "arousal": None
        }

    finally:

        if (
            file_path is not None
            and
            os.path.exists(file_path)
        ):
            os.remove(
                file_path
            )

            print(
                "Temporary file deleted."
            )

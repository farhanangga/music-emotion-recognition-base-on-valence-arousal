from tensorflow.keras.models import load_model

model = load_model(
    "model/best_model.keras",
    compile=False
)

print("Model loaded")

model.save_weights(
    "model/weights.weights.h5"
)

print("Weights saved")
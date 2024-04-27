import os
from ultralytics import YOLO
from fastapi import FastAPI

app = FastAPI()

model = YOLO("./app/best.pt")

@app.get("/predict")
def predict(filename: str = None):
    image_path = f"./app/uploads/{filename}"
    image_path = image_path or os.path.join("test", "6.png")
    results = model(image_path)

    # Xử lý kết quả
    bee_count = 0
    boxes = []
    for result in results:
        bee_count += len(result.boxes.xyxy)
        boxes += result.boxes.xyxy.tolist()

    return {"bee_number": bee_count, "boxes": boxes}



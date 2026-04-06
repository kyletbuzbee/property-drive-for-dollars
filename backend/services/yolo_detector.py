from ultralytics import YOLO
from typing import Optional
import os


class YOLODetector:
    def __init__(self, model_path: Optional[str] = None):
        self.confidence_threshold = 0.60
        self.distress_labels = [
            "blue roof tarp",
            "roof tarp",
            "tarp",
            "boarded window",
            "boarded up window",
            "boarded up",
            "peeling paint",
            "overgrown grass",
            "overgrown yard",
            "broken window",
            "damaged roof",
        ]

        if model_path and os.path.exists(model_path):
            self.model = YOLO(model_path)
        else:
            self.model = YOLO("yolov8n.pt")

    def detect_distress(self, image_path: str) -> dict:
        results = self.model(image_path, verbose=False)

        indicators = []
        max_confidence = 0.0
        all_detections = []

        for result in results:
            boxes = result.boxes
            if boxes is None:
                continue

            for box in boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                label = result.names.get(cls_id, str(cls_id)).lower()

                matched_indicator = self._match_distress_label(label)
                if matched_indicator and conf >= self.confidence_threshold:
                    indicators.append(matched_indicator)
                    all_detections.append(
                        {
                            "label": matched_indicator,
                            "confidence": conf,
                            "bbox": box.xyxy[0].tolist(),
                        }
                    )
                    max_confidence = max(max_confidence, conf)

        unique_indicators = list(set(indicators))

        return {
            "distressed": len(unique_indicators) > 0,
            "indicators": unique_indicators,
            "max_confidence": max_confidence * 100,
            "detections": all_detections,
        }

    def _match_distress_label(self, label: str) -> str | None:
        label_lower = label.lower()

        label_map = {
            "tarp": "Roof Tarp",
            "blue tarp": "Roof Tarp",
            "roof": None,
            "window": None,
            "board": "Boarded Window",
            "boarded": "Boarded Window",
            "paint": "Peeling Paint",
            "grass": "Overgrown Grass",
            "broken": "Broken Window",
            "damaged": "Damaged Roof",
        }

        for keyword, indicator in label_map.items():
            if keyword in label_lower:
                return indicator

        for distress_label in self.distress_labels:
            if (
                distress_label.lower() in label_lower
                or label_lower in distress_label.lower()
            ):
                return distress_label.title()

        return None

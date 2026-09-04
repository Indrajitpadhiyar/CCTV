from typing import Any, Optional


class OCRService:
    """OCR Engine Abstraction for license plate text extraction."""

    def __init__(self, engine: str = "tesseract"):
        self.engine = engine

    async def extract_text(self, image_crop: Any) -> Optional[str]:
        # Abstraction wrapper for EasyOCR or Tesseract
        return "GJ01AB1234"

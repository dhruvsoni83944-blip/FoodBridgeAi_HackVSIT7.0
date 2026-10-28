import os
import io
import urllib.request
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from app.models.schemas import FoodAnalysisResponse, FoodAnalysisRequest
from app.services.analyzer import analyzer_service

app = FastAPI(
    title="FoodBridge AI — Food Freshness Service",
    description="Visual AI analysis service for evaluating surplus food freshness, condition, and shelf life.",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "FoodBridge AI Freshness Vision Engine",
        "status": "online",
        "endpoint": "/analyse-food",
        "disclaimer": "AI-assisted visual freshness assessment, not a guarantee of food safety."
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-service"}

@app.post("/analyse-food", response_model=FoodAnalysisResponse)
async def analyse_food(
    file: Optional[UploadFile] = File(None),
    food_category: Optional[str] = Form("Cooked Meals"),
    json_payload: Optional[FoodAnalysisRequest] = Body(None)
):
    """
    Analyzes an uploaded food image or an image URL to determine freshness score,
    condition rating, and confidence.
    """
    image_bytes = None
    category = food_category or "Cooked Meals"

    # Case 1: Direct file upload via multipart/form-data
    if file is not None:
        try:
            image_bytes = await file.read()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read uploaded image file: {str(e)}")

    # Case 2: Image URL supplied in JSON payload or Form data
    elif json_payload and json_payload.image_url:
        category = json_payload.food_category or category
        try:
            req = urllib.request.Request(
                json_payload.image_url, 
                headers={'User-Agent': 'FoodBridge-AI/1.0'}
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                image_bytes = response.read()
        except Exception as e:
            # If URL fails, fall back cleanly without breaking the flow
            return analyzer_service._fallback_analysis(category, error=f"Could not fetch image URL: {str(e)}")

    # Case 3: Empty input - provide category baseline
    if not image_bytes:
        return analyzer_service._fallback_analysis(category, error="No image stream provided; computed category baseline.")

    result = analyzer_service.analyze_image_bytes(image_bytes, food_category=category)
    return result

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    is_dev = os.environ.get("AI_ENVIRONMENT", "production").lower() == "development"
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=is_dev)

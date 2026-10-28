# FoodBridge AI — AI Food Freshness Service

This Python FastAPI microservice provides visual AI assessment of surplus food freshness, estimating:
- Freshness Score (0–100)
- Condition Rating (`EXCELLENT`, `GOOD`, `ACCEPTABLE`, `NEEDS_INSPECTION`, `SPOILED`)
- Model Confidence (0.0–1.0)
- Visual Quality Checks (Color/Vibrancy, Mold/Spoilage detection, Texture, Container Seal)
- Estimated Remaining Shelf Life in Hours

> **Disclaimer**: This is an AI-assisted visual freshness assessment, not a guarantee of food safety.

## Installation & Setup

1. Navigate to the service folder:
   ```bash
   cd ai-service
   ```

2. Create and activate a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the development server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## API Endpoints

### 1. Health Check
`GET /health`

### 2. Analyse Food
`POST /analyse-food`

Accepts either:
- **Multipart Form Upload**:
  - `file`: Image binary (JPEG, PNG, WEBP)
  - `food_category`: e.g. `"Cooked Meals"`, `"Bakery & Pastries"`, `"Fresh Produce"`, `"Packaged Foods"`
- **JSON Body**:
  ```json
  {
    "image_url": "https://example.com/food-image.jpg",
    "food_category": "Cooked Meals"
  }
  ```

**Response Format**:
```json
{
  "freshnessScore": 86,
  "condition": "EXCELLENT",
  "confidence": 0.92,
  "checks": [
    {
      "category": "Color & Vibrancy",
      "pass": true,
      "description": "Natural appetizing color tone without abnormal dullness",
      "confidence": 0.91
    },
    {
      "category": "Mold & Spoilage Patches",
      "pass": true,
      "description": "No visible fungal mold colonies or microbial discoloration detected",
      "confidence": 0.94
    },
    {
      "category": "Surface Moisture & Texture",
      "pass": true,
      "description": "Normal hydration and food texture consistency verified",
      "confidence": 0.87
    },
    {
      "category": "Packaging & Container Sealed",
      "pass": true,
      "description": "Hygienic storage baseline verified visually",
      "confidence": 0.85
    }
  ],
  "estimatedShelfLifeHours": 5,
  "disclaimer": "AI-assisted visual freshness assessment, not a guarantee of food safety.",
  "metadata": {
    "meanBrightness": 142.5,
    "vibrancyIndex": 48.2,
    "foodCategory": "Cooked Meals",
    "analysisEngine": "FoodBridge-CV-Vision-v1.2"
  }
}
```

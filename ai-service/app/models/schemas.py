from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum

class FoodCondition(str, Enum):
    EXCELLENT = "EXCELLENT"
    GOOD = "GOOD"
    ACCEPTABLE = "ACCEPTABLE"
    NEEDS_INSPECTION = "NEEDS_INSPECTION"
    SPOILED = "SPOILED"

class QualityCheck(BaseModel):
    category: str
    pass_status: bool = Field(..., alias="pass")
    description: str
    confidence: float

class FoodAnalysisRequest(BaseModel):
    image_url: Optional[str] = None
    food_category: Optional[str] = "Cooked Meals"
    food_name: Optional[str] = None

class FoodAnalysisResponse(BaseModel):
    freshnessScore: int = Field(..., description="Estimated visual freshness score from 0 to 100")
    condition: FoodCondition = Field(..., description="Visual condition rating")
    confidence: float = Field(..., description="Model confidence level from 0.0 to 1.0")
    checks: List[QualityCheck] = []
    estimatedShelfLifeHours: Optional[int] = None
    disclaimer: str = "AI-assisted visual freshness assessment, not a guarantee of food safety."
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        populate_by_name = True

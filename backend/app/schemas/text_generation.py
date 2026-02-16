from pydantic import BaseModel
from typing import Optional

class TextGenerationRequest(BaseModel):
    prompt: str

class TextGenerationResponse(BaseModel):
    text: str
    model_used: str

class ErrorResponse(BaseModel):
    detail: str

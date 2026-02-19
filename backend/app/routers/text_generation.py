from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Body
from app.services.deepseek_service import DeepSeekService
from app.services.gemini_service import GeminiService
from app.schemas.text_generation import TextGenerationRequest, TextGenerationResponse
from app.core.dependencies import get_current_user
from app.db.models import User
from typing import Optional

router = APIRouter(prefix="/text", tags=["text"])

# Dependencies
def get_deepseek_service():
    return DeepSeekService()

def get_gemini_service():
    return GeminiService()

@router.post("/chat", response_model=TextGenerationResponse)
async def chat_text_only(
    request: TextGenerationRequest,
    current_user: User = Depends(get_current_user),
    service: DeepSeekService = Depends(get_deepseek_service)
):
    """
    Generate text from text prompt using DeepSeek (text-only).
    """
    try:
        text = await service.generate_text(request.prompt)
        if not text:
             raise HTTPException(status_code=500, detail="Failed to generate text")
        
        return TextGenerationResponse(text=text, model_used="deepseek-chat")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze", response_model=TextGenerationResponse)
async def analyze_multimodal(
    prompt: str = Form(...),
    image: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    service: GeminiService = Depends(get_gemini_service)
):
    """
    Generate text from text prompt and optional image using Gemini (multimodal).
    If image is provided, Gemini Vision is used.
    If only text is provided to this endpoint, Gemini is still used (as fallback or specific choice).
    """
    try:
        image_bytes = None
        if image:
            image_bytes = await image.read()
            
        text = service.generate_content(prompt, image_bytes, image.content_type if image else "image/jpeg")
        
        if not text:
             raise HTTPException(status_code=500, detail="Failed to generate content")
        
        return TextGenerationResponse(text=text, model_used="gemini-flash")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from app.services.gemini_service import GeminiService
from app.schemas.image_generation import ImageGenerationRequest, ImageGenerationResponse
from app.core.dependencies import get_current_user
from app.db.models import User
import base64

router = APIRouter(prefix="/images", tags=["images"])

# Dependency to get Gemini Service
def get_gemini_service():
    return GeminiService()

@router.post("/generate", response_model=ImageGenerationResponse)
async def generate_image(
    request: ImageGenerationRequest,
    current_user: User = Depends(get_current_user),
    service: GeminiService = Depends(get_gemini_service)
):
    """
    Generate an image from a text prompt.
    """
    try:
        image_base64 = service.generate_image(request.prompt)
        if not image_base64:
             raise HTTPException(status_code=500, detail="Failed to generate image")
        
        return ImageGenerationResponse(base64_image=image_base64)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/edit", response_model=ImageGenerationResponse)
async def edit_image(
    prompt: str = Form(...),
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    service: GeminiService = Depends(get_gemini_service)
):
    """
    Analyze an uploaded image and generate a new one based on the prompt instructions.
    Useful for "put the flower in a blue vase" type requests.
    """
    try:
        contents = await image.read()
        image_base64 = service.analyze_and_modify(prompt, contents, image.content_type)
        
        if not image_base64:
             raise HTTPException(status_code=500, detail="Failed to modify image")
        
        return ImageGenerationResponse(base64_image=image_base64)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

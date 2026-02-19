from pydantic import BaseModel
from typing import Optional

class ImageGenerationRequest(BaseModel):
    prompt: str

class ImageGenerationResponse(BaseModel):
    base64_image: str
    content_type: str = "image/png"

class ImageEditRequest(BaseModel):
    prompt: str
    # Image will be uploaded as file, this model is for the JSON part if needed, 
    # but for multipart/form-data we usually use Form parameters.
    # So this might not be strictly used in the controller if we use Form(), 
    # but good for documentation.

class ErrorResponse(BaseModel):
    detail: str

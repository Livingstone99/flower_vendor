from google import genai
from google.genai import types
from app.core.config import settings
import base64
import io
from PIL import Image
from typing import Optional

class GeminiService:
    def __init__(self):
        self.api_key = settings.google_api_key
        if not self.api_key:
            print("Warning: GOOGLE_API_KEY not set. Gemini features will not work.")
            self.client = None
        else:
            self.client = genai.Client(api_key=self.api_key)
            
        self.generation_model = "imagen-3.0-generate-001"
        self.vision_model = "models/gemini-2.0-flash"

    def generate_image(self, prompt: str) -> Optional[str]:
        """
        Generates an image from a text prompt.
        Returns the base64 encoded image string.
        """
        if not self.client:
            return None
            
        try:
            response = self.client.models.generate_images(
                model=self.generation_model,
                prompt=prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    include_rai_reason=True,
                    output_mime_type="image/jpeg"
                )
            )
            
            if response.generated_images:
                generated_image = response.generated_images[0]
                
                # Check if .image is PIL Image or bytes
                if hasattr(generated_image, 'image') and generated_image.image:
                     image_obj = generated_image.image
                     # If it's a PIL Image
                     if isinstance(image_obj, Image.Image):
                         buffered = io.BytesIO()
                         image_obj.save(buffered, format="JPEG")
                         return base64.b64encode(buffered.getvalue()).decode('utf-8')
                     # If it's bytes
                     elif isinstance(image_obj, bytes):
                         return base64.b64encode(image_obj).decode('utf-8')
                     else:
                         # Try getting bytes attribute
                         if hasattr(image_obj, '_image_bytes'):
                              return base64.b64encode(image_obj._image_bytes).decode('utf-8')
            
            return None

        except Exception as e:
            print(f"Error generating image: {e}")
            # Raise or return None? Raising gives more info to caller
            raise e

    def analyze_and_modify(self, prompt: str, image_bytes: bytes, mime_type: str = "image/jpeg") -> Optional[str]:
        """
        Analyzes an input image and generates a new one based on the prompt + image content.
        Step 1: Use Gemini Vision to describe the image.
        Step 2: Combine original prompt with description to generate new image.
        """
        if not self.client:
            return None
            
        try:
            # Step 1: Analyze
            # Create a Part from bytes
            image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            
            analysis_prompt = (
                f"Describe the main subject and composition of this image in detail. "
                f"Then, formulate a detailed image generation prompt that would create an image "
                f"incorporating these visual elements but modified according to this instruction: '{prompt}'. "
                f"Return ONLY the prompt text, no other explanation."
            )
            
            analysis_response = self.client.models.generate_content(
                model=self.vision_model,
                contents=[analysis_prompt, image_part]
            )
            
            enhanced_prompt = analysis_response.text
            print(f"Enhanced Prompt: {enhanced_prompt}")
            
            # Step 2: Generate
            return self.generate_image(enhanced_prompt)

        except Exception as e:
            print(f"Error in analyze_and_modify: {e}")
            raise e

    def generate_content(self, prompt: str, image_bytes: Optional[bytes] = None, mime_type: str = "image/jpeg") -> Optional[str]:
        """
        Generates text content from text prompt and optional image.
        """
        if not self.client:
            return None
            
        try:
            contents = [prompt]
            if image_bytes:
                contents.append(types.Part.from_bytes(data=image_bytes, mime_type=mime_type))
            
            response = self.client.models.generate_content(
                model=self.vision_model,
                contents=contents
            )
            
            return response.text
        except Exception as e:
            print(f"Error generating content with Gemini: {e}")
            raise e

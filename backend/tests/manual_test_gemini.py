import sys
import os
# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.gemini_service import GeminiService
from app.core.config import settings

def test_generation():
    print("Testing Image Generation...")
    if not settings.google_api_key:
        print("GOOGLE_API_KEY not set. Skipping.")
        return

    service = GeminiService()
    try:
        # Prompt: simple flower
        print("Generating a flower image...")
        result = service.generate_image("A beautiful red rose in a garden, photorealistic, 8k")
        if result:
            print("Success! Image generated.")
            # Save to file to verify
            import base64
            with open("test_generated_flower.jpg", "wb") as f:
                f.write(base64.b64decode(result))
            print("Saved to test_generated_flower.jpg")
        else:
            print("Failed to generate image (None returned).")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_generation()

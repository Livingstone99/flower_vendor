import sys
import os
import asyncio
# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.deepseek_service import DeepSeekService
from app.services.gemini_service import GeminiService
from app.core.config import settings

async def test_deepseek():
    print("\n=== Testing DeepSeek (Text-only) ===")
    if not settings.deepseek_api_key:
        print("DEEPSEEK_API_KEY not set. Skipping.")
        return False

    service = DeepSeekService()
    try:
        prompt = "Give a brief description of a rose flower in 2-3 sentences."
        print(f"Prompt: {prompt}")
        result = await service.generate_text(prompt)
        if result:
            print(f"✓ Success!\nResponse: {result}")
            return True
        else:
            print("✗ Failed (None returned).")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_gemini_text():
    print("\n=== Testing Gemini (Text-only) ===")
    if not settings.google_api_key:
        print("GOOGLE_API_KEY not set. Skipping.")
        return False

    service = GeminiService()
    try:
        prompt = "What are the main characteristics of tulips?"
        print(f"Prompt: {prompt}")
        result = service.generate_content(prompt)
        if result:
            print(f"✓ Success!\nResponse: {result}")
            return True
        else:
            print("✗ Failed (None returned).")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_gemini_multimodal():
    print("\n=== Testing Gemini (Multimodal - Image Analysis) ===")
    if not settings.google_api_key:
        print("GOOGLE_API_KEY not set. Skipping.")
        return False

    # Check if we have a test image
    test_image_path = "test_generated_flower.jpg"
    if not os.path.exists(test_image_path):
        print(f"Test image '{test_image_path}' not found. Skipping multimodal test.")
        print("You can run the image generation test first to create a test image.")
        return None

    service = GeminiService()
    try:
        with open(test_image_path, "rb") as f:
            image_bytes = f.read()
        
        prompt = "What flowers can be identified in this image? Describe what you see."
        print(f"Prompt: {prompt}")
        print(f"Image: {test_image_path}")
        result = service.generate_content(prompt, image_bytes, "image/jpeg")
        if result:
            print(f"✓ Success!\nResponse: {result}")
            return True
        else:
            print("✗ Failed (None returned).")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

async def main():
    print("=" * 60)
    print("TEXT GENERATION MODULE TEST")
    print("=" * 60)
    
    results = []
    
    # Test DeepSeek
    results.append(("DeepSeek", await test_deepseek()))
    
    # Test Gemini Text
    results.append(("Gemini Text", test_gemini_text()))
    
    # Test Gemini Multimodal
    multimodal_result = test_gemini_multimodal()
    if multimodal_result is not None:
        results.append(("Gemini Multimodal", multimodal_result))
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    for name, result in results:
        status = "✓ PASSED" if result else "✗ FAILED"
        print(f"{name}: {status}")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())

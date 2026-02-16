from openai import AsyncOpenAI
from app.core.config import settings
from typing import Optional

class DeepSeekService:
    def __init__(self):
        self.api_key = settings.deepseek_api_key
        self.base_url = settings.deepseek_base_url
        
        if not self.api_key:
            print("Warning: DEEPSEEK_API_KEY not set. DeepSeek features will not work.")
            self.client = None
        else:
            self.client = AsyncOpenAI(api_key=self.api_key, base_url=self.base_url)
            
        self.model = "deepseek-chat"

    async def generate_text(self, prompt: str) -> Optional[str]:
        """
        Generates text response from a text prompt using DeepSeek.
        """
        if not self.client:
            return None
            
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt},
                ],
                stream=False
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error generating text with DeepSeek: {e}")
            raise e

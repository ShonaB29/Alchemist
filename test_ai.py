import os
import asyncio

# Change to backend directory and load env
os.chdir('d:/Alchemist/alchemist-platform/backend')
from dotenv import load_dotenv
load_dotenv()

print("Environment variables:")
print(f"GOOGLE_API_KEY: {os.getenv('GOOGLE_API_KEY')[:10]}...")

from app.services.ai_service import AIService

# Create new instance to see initialization
print("\nCreating AIService instance...")
ai = AIService()
print(f"openai_client: {ai.openai_client}")
print(f"gemini_model: {ai.gemini_model}")

# Test directly
async def test():
    personality = {"name": "Test", "system_prompt": "You are a helpful assistant.", "is_default": True}
    user_context = {"learning_dna": {}, "career_goal": None}
    
    print("\nTesting generate_response...")
    result = ""
    async for chunk in ai.generate_response(
        "hello",
        [],
        user_context,
        personality,
        "normal",
        "intermediate"
    ):
        result += chunk
        print(f"Chunk: {chunk[:50]}...")
    
    print(f"\nFinal result: {result[:200]}")

asyncio.run(test())


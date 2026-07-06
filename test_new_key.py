#!/usr/bin/env python3
"""Test if new API key works"""
import asyncio
import os
import sys
from dotenv import load_dotenv

# Load env vars
load_dotenv()

sys.path.insert(0, 'd:\\Alchemist\\alchemist-platform\\backend')

from app.services.ai_service import AIService

async def test_chat():
    """Test chat with new API key"""
    ai_service = AIService()
    
    print("Testing AI response generation...")
    print("-" * 50)
    
    # Create a test context
    context = {
        "username": "admin",
        "learning_level": "beginner",
        "topics": ["Python", "SQL"]
    }
    
    # Test message
    message = "What is Python and why should I learn it?"
    
    print(f"User: {message}\n")
    print("AI Response:")
    print("-" * 50)
    
    try:
        response_chunks = []
        personality = {"learning_style": "visual", "motivation": "high"}
        async for chunk in ai_service.generate_response(
            user_message=message,
            conversation_history=[],
            user_context=context,
            personality=personality,
            context_mode="normal",
            teach_level="beginner"
        ):
            print(chunk, end='', flush=True)
            response_chunks.append(chunk)
        
        print("\n" + "-" * 50)
        full_response = ''.join(response_chunks)
        
        if "That's interesting" in full_response:
            print("⚠️  Got fallback response (quota likely exhausted)")
        elif len(full_response) > 50:
            print("✅ Got real AI response!")
        else:
            print("❓ Response unclear")
            
    except Exception as e:
        print(f"\n❌ Error: {type(e).__name__}: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_chat())

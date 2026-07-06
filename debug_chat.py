#!/usr/bin/env python3
"""Debug the chat endpoint error"""
import asyncio
import sys
import os

sys.path.insert(0, 'd:\\Alchemist\\alchemist-platform\\backend')

from app.services.ai_service import AIService

async def debug_chat():
    """Debug the chat generation"""
    ai_service = AIService()

    # Test parameters similar to what the endpoint uses
    user_message = "test"
    conversation_history = []
    user_context = {"username": "admin", "learning_dna": {}}
    personality = {"name": "Default Mentor", "learning_style": "visual", "motivation": "high"}
    context_mode = "normal"
    teach_level = "intermediate"

    print("Testing generate_response with endpoint-like parameters...")

    try:
        full_response = ""
        async for chunk in ai_service.generate_response(
            user_message=user_message,
            conversation_history=conversation_history,
            user_context=user_context,
            personality=personality,
            context_mode=context_mode,
            teach_level=teach_level
        ):
            full_response += chunk
            print(f"Chunk: {chunk}", end='')

        print(f"\n\nFull response: {full_response[:200]}...")

    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_chat())

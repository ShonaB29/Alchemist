#!/usr/bin/env python3
"""Test updated fallback responses"""
import asyncio
import sys
import os

sys.path.insert(0, 'd:\\Alchemist\\alchemist-platform\\backend')

from app.services.ai_service import AIService

async def test_fallbacks():
    """Test the updated fallback responses"""
    ai_service = AIService()

    test_messages = [
        "teach me c",
        "what is c",
        "tell me about python",
        "explain javascript",
        "how does sql work",
        "i'm stuck",
        "motivate me",
        "what is my progress"
    ]

    user_context = {
        "username": "testuser",
        "learning_dna": {
            "math_level": 0.7,
            "python_level": 0.5,
            "sql_level": 0.8
        }
    }

    print("Testing Updated Fallback Responses")
    print("=" * 50)

    for msg in test_messages:
        print(f"\nUser: {msg}")
        print("-" * 30)
        response = ai_service._get_fallback_response(msg, user_context)
        print(response)
        print("-" * 50)

if __name__ == "__main__":
    asyncio.run(test_fallbacks())

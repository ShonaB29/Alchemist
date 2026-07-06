#!/usr/bin/env python3
"""Test if new API key works - writes to file"""
import asyncio
import os
import sys
import time
from dotenv import load_dotenv

# Load env vars
load_dotenv()

output = []

def log(msg):
    """Log to both console and file"""
    print(msg)
    output.append(msg)

sys.path.insert(0, 'd:\\Alchemist\\alchemist-platform\\backend')

from app.services.ai_service import AIService

async def test_chat():
    """Test chat with new API key"""
    start = time.time()
    log(f"[{time.time():.1f}s] Starting test...")
    log(f"[{time.time():.1f}s] Initializing AIService...")
    
    ai_service = AIService()
    
    log(f"[{time.time():.1f}s] Testing AI response generation...")
    
    # Create a test context
    context = {
        "username": "admin",
        "learning_level": "beginner",
        "topics": ["Python", "SQL"]
    }
    
    # Test message
    message = "What is Python and why should I learn it?"
    
    log(f"[{time.time():.1f}s] User: {message}\n")
    log("AI Response:")
    log("-" * 50)
    
    try:
        response_chunks = []
        personality = {"learning_style": "visual", "motivation": "high"}
        log(f"[{time.time():.1f}s] Starting generate_response...")
        count = 0
        async for chunk in ai_service.generate_response(
            user_message=message,
            conversation_history=[],
            user_context=context,
            personality=personality,
            context_mode="normal",
            teach_level="beginner"
        ):
            print(chunk, end='', flush=True)
            log(chunk)
            response_chunks.append(chunk)
            count += 1
        
        log("\n" + "-" * 50)
        full_response = ''.join(response_chunks)
        
        if "That's interesting" in full_response:
            log("⚠️  Got fallback response (quota likely exhausted)")
        elif len(full_response) > 50:
            log(f"✅ Got real AI response! ({len(full_response)} chars, {count} chunks)")
        else:
            log(f"❓ Response unclear: {full_response[:100]}")
            
    except Exception as e:
        log(f"\n❌ Error: {type(e).__name__}: {str(e)}")
        import traceback
        log(traceback.format_exc())
    
    log(f"[{time.time():.1f}s] Test complete (duration: {time.time() - start:.1f}s)")

if __name__ == "__main__":
    try:
        asyncio.run(test_chat())
    except Exception as e:
        log(f"FATAL ERROR: {e}")
        import traceback
        log(traceback.format_exc())
    finally:
        with open('test_result.txt', 'w') as f:
            f.write('\n'.join(output))
        log(f"\n\nResults written to test_result.txt")

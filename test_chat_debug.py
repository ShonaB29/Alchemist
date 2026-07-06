from dotenv import load_dotenv
load_dotenv()

import asyncio
from app.services.ai_service import ai_service

async def test():
    personality = {
        "name": "Coach",
        "system_prompt": "Be helpful"
    }
    user_context = {"learning_dna": {"python_level": 0.5}}
    
    try:
        print("Starting AI response generation...")
        full_response = ""
        count = 0
        async for chunk in ai_service.generate_response(
            user_message="what is data analyst in 2 sentences",
            conversation_history=[],
            user_context=user_context,
            personality=personality
        ):
            count += 1
            full_response += chunk
            if count <= 3:
                print(f"Chunk {count}: {chunk[:60]}")
        print(f"\nTotal chunks: {count}")
        print(f"Full response length: {len(full_response)}")
        print(f"Response preview: {full_response[:200]}")
    except Exception as e:
        print(f"ERROR: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

asyncio.run(test())

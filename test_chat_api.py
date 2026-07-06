#!/usr/bin/env python3
"""Test chat endpoint with updated fallbacks"""
import requests
import json

def test_chat_api():
    print('Testing chat endpoint with updated fallbacks...')

    # Login
    r = requests.post('http://127.0.0.1:8000/api/v1/auth/login',
                     json={'username':'admin','password':'admin123'})
    if r.status_code != 200:
        print('Login failed:', r.status_code, r.text)
        return

    token = json.loads(r.text)['access_token']
    print('Login successful')

    # Test messages
    test_messages = ['teach me c', 'what is python', 'i am stuck', 'motivate me']

    for msg in test_messages:
        print(f'\n--- Testing: "{msg}" ---')
        r2 = requests.post('http://127.0.0.1:8000/api/v1/chat/chat',
                          json={'message': msg},
                          headers={'Authorization': f'Bearer {token}'})

        if r2.status_code == 200:
            response_data = json.loads(r2.text)
            print('Response received')
            # Print first 200 chars of response
            response_text = response_data.get('response', '')
            print(f'Response preview: {response_text[:200]}...')
        else:
            print('Chat failed:', r2.status_code, r2.text)

if __name__ == "__main__":
    test_chat_api()

# Realtime Database Migration to Supabase - TODO List

## Approved Plan Steps (Completed: ✅ Pending: ⭕)

### Phase 1: Setup & Backend (⭕)
- [ ] 1. Get Supabase anon_key (user provides)
- [ ] 2. Update requirements.txt (+supabase)
- [ ] 3. Create backend/.env (SUPABASE_URL, SUPABASE_KEY)
- [ ] 4. Replace core/database.py → supabase_client.py
- [ ] 5. Update main.py (remove SQLAlchemy init)
- [ ] 6. Migrate APIs: chat.py, learning.py (DB → Supabase)
- [ ] 7. Remove models/, SQLAlchemy deps
- [ ] 8. pip install && test uvicorn

### Phase 2: Frontend (⭕)
- [ ] 9. Frontend package.json (+supabase-js)
- [ ] 10. src/services/supabase.js (new)
- [ ] 11. Update api.js (hybrid)
- [ ] 12. AIMentorChat.js + realtime sub
- [ ] 13. PeerTwins.js + realtime peers/messages
- [ ] 14. npm install && test

### Phase 3: Data & Test (⭕)
- [ ] 15. Supabase: Create tables from models schema
- [ ] 16. Migrate alchemist.db → Supabase
- [ ] 17. Test realtime chat/peers across tabs
- [ ] 18. Remove localStorage fallbacks

**Current Progress: Planning complete. Awaiting Supabase anon_key to start Phase 1.**
**Supabase URL provided: https://amscmiclgxxbfebfewwx.supabase.co**


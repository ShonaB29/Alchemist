import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL, chatAPI } from '../services/api';

// Color constants
const COLORS = {
  user: '#F9D6C5',  // Pastel peach
  mentor: '#B4D6D3', // Soft mint
  userText: '#4A4A4A',
  mentorText: '#4A4A4A',
};

// Conversation starter options
const CONVERSATION_STARTERS = [
  { id: 'progress', label: "How's my progress?", icon: '📊' },
  { id: 'stuck', label: "I'm feeling stuck", icon: '😓' },
  { id: 'motivate', label: 'Motivate me', icon: '💪' },
  { id: 'studyplan', label: 'Create a study plan', icon: '📚' },
  { id: 'explain', label: 'Explain a concept', icon: '💡' },
  { id: 'quiz', label: 'Help with quiz prep', icon: '✍️' },
];


// Mentor personality options
const PERSONALITIES = [
  { id: 1, name: 'Encouraging Coach', icon: '🎯', description: 'Warm and supportive' },
  { id: 2, name: 'Detail-oriented Professor', icon: '📖', description: 'Thorough explanations' },
  { id: 3, name: 'Practical Industry Expert', icon: '💼', description: 'Real-world focus' },
  { id: 4, name: 'Friendly Study Buddy', icon: '🤝', description: 'Casual and fun' },
];

const LEARNING_MODES = [
  { id: 'normal', label: 'Normal', icon: '💬' },
  { id: 'deep_dive', label: 'Deep Dive', icon: '🔬' },
  { id: 'teach_me', label: 'Teach Me', icon: '📚' },
];

const TEACH_LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export default function AIMentorChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showStarterMenu, setShowStarterMenu] = useState(true);
  const [personalities, setPersonalities] = useState(PERSONALITIES);
  const [selectedPersonality, setSelectedPersonality] = useState(1);
  const [learningMode, setLearningMode] = useState('normal');
  const [teachLevel, setTeachLevel] = useState('intermediate');
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [userContext, setUserContext] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [conversationSummary, setConversationSummary] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    loadConversations();
    loadContext();
    loadPersonalities();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadContext = async () => {
    try {
      const response = await chatAPI.getContext();
      setUserContext(response.data);
    } catch (error) {
      console.error('Error loading context:', error);
    }
  };

  const loadPersonalities = async () => {
    try {
      const response = await chatAPI.getPersonalities();
      if (response.data && response.data.length > 0) {
        setPersonalities(response.data);
        setSelectedPersonality(response.data[0].id);
      }
    } catch (error) {
      console.error('Error loading personalities:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await chatAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const response = await chatAPI.getConversation(conversationId);
      const conv = response.data;
      const loadedMessages = conv.messages.map(msg => ({
        id: msg.id,
        type: msg.role === 'user' ? 'user' : 'ai',
        text: msg.content,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        feedback: msg.feedback,
        read: true
      }));
      setMessages(loadedMessages);
      setCurrentConversationId(conversationId);
      setShowStarterMenu(false);
      setShowSearchResults(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await chatAPI.createConversation(selectedPersonality);
      setCurrentConversationId(response.data.id);
      setMessages([]);
      setShowStarterMenu(true);
      setShowSearchResults(false);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const searchConversations = async (query) => {
    if (!query.trim()) { setShowSearchResults(false); return; }
    try {
      const response = await chatAPI.searchConversations(query);
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleSend = useCallback(async (text = input) => {
    if (!text.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setTyping(true);
    setSuggestions([]);
    
    try {
      const response = await fetch(`${API_URL}/chat/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: text,
          personality_id: selectedPersonality,
          context_mode: learningMode,
          teach_level: teachLevel,
          conversation_id: currentConversationId || undefined
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
        throw new Error(errorData.detail || 'Failed to get response');
      }
      
      const data = await response.json();
      
      const aiMessage = {
        id: data.message.id,
        type: 'ai',
        text: data.message.content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        feedback: null,
        read: true
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setCurrentConversationId(data.conversation_id);
      setSuggestions(data.suggestions || []);
      setTyping(false);
      loadConversations();
      
    } catch (error) {
      console.error('Error sending message:', error);
      setTyping(false);
      
      // Show a proper error message instead of rule-based fallback
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: `I'm having trouble connecting right now. Please try again in a moment. If the issue persists, check your internet connection.\n\nError: ${error.message}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        feedback: null,
        read: true
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [input, currentConversationId, selectedPersonality, learningMode, teachLevel]);



  const handleFeedback = async (messageId, feedbackType) => {
    try {
      await chatAPI.submitFeedback(messageId, feedbackType);
      setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, feedback: feedbackType } : msg));
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results).map(result => result[0].transcript).join('');
      setInput(transcript);
    };
    recognitionRef.current.onend = () => setIsRecording(false);
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const handleStarter = (starterId) => {
    const starters = {
      progress: "How's my progress?",
      stuck: "I'm feeling stuck on a topic",
      motivate: "I need some motivation",
      studyplan: "Create a study plan for me",
      explain: "Explain a concept I'm learning",
      quiz: "Help me prepare for a quiz"
    };
    handleSend(starters[starterId]);
  };

  const handleSummarize = async () => {
    if (!currentConversationId) return;
    try {
      const response = await chatAPI.summarizeConversation(currentConversationId);
      setConversationSummary(response.data);
      setShowSummary(true);
    } catch (error) {
      console.error('Error summarizing:', error);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.type === 'user';
    return (
      <motion.div key={msg.id || index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`d-flex mb-3 ${isUser ? 'justify-content-end' : ''}`}>
        {!isUser && <div className="rounded-circle d-inline-flex align-items-center justify-content-center me-2 flex-shrink-0" style={{ width: '35px', height: '35px', backgroundColor: COLORS.mentor }}><i className="bi bi-robot"></i></div>}
        <div className="position-relative">
          <div className="p-3 rounded shadow-sm" style={{ maxWidth: '70%', backgroundColor: isUser ? COLORS.user : COLORS.mentor, color: isUser ? COLORS.userText : COLORS.mentorText }}>
            <p className="mb-1" style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
            <div className="d-flex align-items-center justify-content-end gap-2">
              <small className="text-muted">{msg.time}</small>
              {isUser && <span>✓✓</span>}
            </div>
          </div>
          {!isUser && <div className="d-flex gap-1 mt-1">
            <button className={`btn btn-sm btn-link ${msg.feedback === 'up' ? 'text-success' : 'text-muted'}`} onClick={() => handleFeedback(msg.id, 'up')} style={{ fontSize: '0.8rem', padding: '0 4px' }}>👍</button>
            <button className={`btn btn-sm btn-link ${msg.feedback === 'down' ? 'text-danger' : 'text-muted'}`} onClick={() => handleFeedback(msg.id, 'down')} style={{ fontSize: '0.8rem', padding: '0 4px' }}>👎</button>
          </div>}
        </div>
        {isUser && <div className="rounded-circle d-inline-flex align-items-center justify-content-center ms-2 flex-shrink-0" style={{ width: '35px', height: '35px', backgroundColor: COLORS.user }}><i className="bi bi-person"></i></div>}
      </motion.div>
    );
  };

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2><i className="bi bi-chat-dots me-2"></i>AI Mentor Chat</h2>
        <button className="btn btn-outline-secondary" onClick={() => setShowSidebar(!showSidebar)}><i className={`bi ${showSidebar ? 'bi-x' : 'bi-list'}`}></i></button>
      </div>

      <div className="row g-4">
        <AnimatePresence>
          {showSidebar && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="col-md-3">
              <button className="btn btn-primary w-100 mb-3" onClick={createNewConversation}><i className="bi bi-plus-lg me-2"></i>New Chat</button>
              <div className="mb-3">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Search chats..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); searchConversations(e.target.value); }} />
                  <button className="btn btn-outline-secondary"><i className="bi bi-search"></i></button>
                </div>
              </div>
              {showSearchResults && searchResults.length > 0 && <div className="card mb-3 p-2"><small className="text-muted mb-2">Search Results</small>{searchResults.map((result, i) => <button key={i} className="btn btn-sm btn-outline-secondary w-100 text-start mb-1" onClick={() => loadConversation(result.conversation_id)}><small>{result.conversation_title}</small></button>)}</div>}
              <div className="card" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div className="p-2"><small className="text-muted">Recent Chats</small>
                  {conversations.map((conv) => <button key={conv.id} className={`btn btn-sm w-100 text-start mb-1 ${currentConversationId === conv.id ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => loadConversation(conv.id)}><i className="bi bi-chat me-2"></i>{conv.title?.substring(0, 25) || 'New Conversation'}</button>)}
                </div>
              </div>
              {currentConversationId && messages.length > 0 && <button className="btn btn-outline-primary w-100 mt-3" onClick={handleSummarize}><i className="bi bi-card-text me-2"></i>Summarize Chat</button>}
            </motion.div>
          )}
        </AnimatePresence>

        <div className={showSidebar ? 'col-md-9' : 'col-md-12'}>
          <div className="card" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <div className="p-3 border-bottom d-flex align-items-center justify-content-between" style={{ backgroundColor: COLORS.mentor }}>
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-white d-inline-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}><i className="bi bi-robot" style={{ fontSize: '1.5rem', color: '#4A4A4A' }}></i></div>
                <div><h6 className="mb-0">{personalities.find(p => p.id === selectedPersonality)?.name || 'AI Mentor'}</h6><small className="text-muted">{learningMode === 'deep_dive' ? '🔬 Deep Dive Mode' : learningMode === 'teach_me' ? `📚 Teach Me (${teachLevel})` : '💬 Normal'}</small></div>
                <span className="badge bg-success ms-2">Online</span>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-dark" onClick={() => setShowModeSelector(!showModeSelector)} title="Learning Mode"><i className="bi bi-lightning"></i></button>
                <button className="btn btn-sm btn-outline-dark" onClick={() => setShowPersonalityModal(true)} title="Change Personality"><i className="bi bi-person-badge"></i></button>
              </div>
            </div>

            {showModeSelector && <div className="position-absolute top-0 end-0 mt-5 me-5 bg-white rounded shadow p-3" style={{ zIndex: 1000 }}><small className="text-muted d-block mb-2">Learning Mode</small><div className="d-flex gap-2 mb-3">{LEARNING_MODES.map(mode => <button key={mode.id} className={`btn btn-sm ${learningMode === mode.id ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => { setLearningMode(mode.id); setShowModeSelector(false); }}>{mode.icon} {mode.label}</button>)}</div>{learningMode === 'teach_me' && <><small className="text-muted d-block mb-2">Your Level</small><div className="d-flex gap-2">{TEACH_LEVELS.map(level => <button key={level.id} className={`btn btn-sm ${teachLevel === level.id ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setTeachLevel(level.id)}>{level.label}</button>)}</div></>}</div>}

            <div className="flex-grow-1 p-3 overflow-auto" style={{ backgroundColor: 'var(--background)' }}>
              {showStarterMenu && messages.length === 0 && <div className="text-center mb-4"><h5 className="mb-3">Welcome! How can I help you today?</h5><div className="d-flex flex-wrap justify-content-center gap-2">{CONVERSATION_STARTERS.map(starter => <button key={starter.id} className="btn btn-outline-primary" onClick={() => handleStarter(starter.id)}>{starter.icon} {starter.label}</button>)}</div></div>}
              {messages.map(renderMessage)}
              {typing && <div className="d-flex mb-3"><div className="rounded-circle d-inline-flex align-items-center justify-content-center me-2" style={{ width: '35px', height: '35px', backgroundColor: COLORS.mentor }}><i className="bi bi-robot"></i></div><div className="p-3 rounded bg-white shadow-sm"><div className="typing-indicator"><span></span><span></span><span></span></div></div></div>}
              <div ref={messagesEndRef} />
            </div>

            {suggestions.length > 0 && !typing && <div className="px-3 py-2 border-top bg-light d-flex flex-wrap gap-2"><small className="text-muted w-100 mb-1">Suggestions:</small>{suggestions.map((suggestion, i) => <button key={i} className="btn btn-sm btn-outline-primary" onClick={() => handleSend(suggestion)}>{suggestion}</button>)}</div>}

            <div className="p-3 border-top bg-white">
              {userContext && userContext.learning_dna && (
                <div className="mb-2 small text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Using your learning data: 
                  <span className="ms-1">
                    {Object.entries(userContext.learning_dna)
                      .filter(([key, val]) => val > 0)
                      .slice(0, 3)
                      .map(([key, val]) => `${key.replace('_level', '')}:${Math.round(val * 100)}%`)
                      .join(', ')}
                  </span>
                </div>
              )}
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Ask your AI mentor..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} ref={inputRef} />
                <button className="btn btn-outline-secondary" onClick={startVoiceInput} title="Voice input"><i className={`bi ${isRecording ? 'bi-mic-fill text-danger' : 'bi-mic'}`}></i></button>
                <button className="btn btn-primary" onClick={() => handleSend()} disabled={typing}><i className="bi bi-send"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPersonalityModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowPersonalityModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Choose Mentor Personality</h5>
                <button className="btn-close" onClick={() => setShowPersonalityModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {personalities.map(personality => (
                    <div key={personality.id} className="col-6">
                      <button className={`btn w-100 p-3 text-start ${selectedPersonality === personality.id ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => { setSelectedPersonality(personality.id); setShowPersonalityModal(false); }}>
                        <div className="h5">{personality.name}</div>
                        <small>{personality.description || (personality.system_prompt && personality.system_prompt.substring(0, 50))}</small>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSummary && conversationSummary && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowSummary(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">📝 Chat Summary</h5>
                <button className="btn-close" onClick={() => setShowSummary(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Summary:</strong> {conversationSummary.summary}</p>
                <div className="mb-3">
                  <strong>Key Takeaways:</strong>
                  <ul>
                    {conversationSummary.key_takeaways && conversationSummary.key_takeaways.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <strong>Action Items:</strong>
                  <ul>
                    {conversationSummary.action_items && conversationSummary.action_items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

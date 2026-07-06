import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL, learningAPI } from '../services/api';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function PeerTwins() {
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [following, setFollowing] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchPeerMatches();
    loadFollowing();
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/learning/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const openChat = async (msg) => {
    setActiveChatUser({
      id: msg.sender_id,
      username: msg.sender_username,
      name: msg.sender_name
    });
    
    // Load full conversation
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/learning/conversation/${msg.sender_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatMessages(response.data);
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setChatMessages([msg]);
    }
    
    setShowMessages(false);
  };

  const sendReply = async () => {
    if (!replyMessage.trim() || !activeChatUser) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/learning/send-message`,
        { recipient_id: activeChatUser.id, message: replyMessage },
        { headers: { Authorization: `Bearer ${token}` }, params: { recipient_id: activeChatUser.id, message: replyMessage } }
      );
      
      const newMsg = {
        message: replyMessage,
        timestamp: new Date(),
        sender_username: 'You',
        is_sent: true
      };
      setChatMessages([...chatMessages, newMsg]);
      setReplyMessage('');
      toast.success('Reply sent!');
    } catch (err) {
      toast.error('Failed to send reply');
    }
  };

  const loadFollowing = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/learning/following`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFollowing(response.data);
    } catch (err) {
      console.error('Failed to load following:', err);
    }
  };

  const fetchPeerMatches = async () => {
    try {
      const response = await learningAPI.getPeerMatches();
      setPeers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch peer matches:', error);
      const mockPeers = [
        { id: 1, username: 'sarah_dev', full_name: 'Sarah Johnson', match_score: 92, primary_topic: 'Web Development', total_mastery: 0.65, completed_lessons: 24, career_goal: 'Full Stack Developer', learning_dna: { python_level: 0.7, web_dev_level: 0.8, sql_level: 0.6 }, streak: 12, points: 2400 },
        { id: 2, username: 'mike_data', full_name: 'Mike Chen', match_score: 88, primary_topic: 'Data Science', total_mastery: 0.72, completed_lessons: 31, career_goal: 'Data Scientist', learning_dna: { python_level: 0.9, data_analysis_level: 0.8, ml_level: 0.6 }, streak: 8, points: 3100 },
        { id: 3, username: 'alex_ml', full_name: 'Alex Kumar', match_score: 85, primary_topic: 'Machine Learning', total_mastery: 0.58, completed_lessons: 18, career_goal: 'AI Engineer', learning_dna: { python_level: 0.8, ml_level: 0.7, math_level: 0.6 }, streak: 5, points: 1800 },
        { id: 4, username: 'emma_code', full_name: 'Emma Davis', match_score: 81, primary_topic: 'Python', total_mastery: 0.61, completed_lessons: 22, career_goal: 'Backend Developer', learning_dna: { python_level: 0.85, sql_level: 0.7, web_dev_level: 0.5 }, streak: 15, points: 2200 },
        { id: 5, username: 'john_analyst', full_name: 'John Smith', match_score: 78, primary_topic: 'Data Analysis', total_mastery: 0.54, completed_lessons: 16, career_goal: 'Data Analyst', learning_dna: { sql_level: 0.8, data_analysis_level: 0.7, python_level: 0.5 }, streak: 3, points: 1600 },
        { id: 6, username: 'lisa_web', full_name: 'Lisa Brown', match_score: 75, primary_topic: 'Frontend', total_mastery: 0.68, completed_lessons: 27, career_goal: 'Frontend Developer', learning_dna: { web_dev_level: 0.9, python_level: 0.4 }, streak: 20, points: 2700 }
      ];
      setPeers(mockPeers);
      setLoading(false);
    }
  };

  const getAvatarColor = (username) => {
    const colors = ['#B4D6D3', '#F9D6C5', '#E2C2E0', '#FFF2CC', '#4ECDC4', '#FF6B6B'];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getAvatarInitials = (fullName, username) => {
    if (fullName) {
      const names = fullName.split(' ');
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return username.slice(0, 2).toUpperCase();
  };

  const handleConnect = async (peer) => {
    if (!chatMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/learning/send-message`, 
        { recipient_id: peer.id, message: chatMessage },
        { headers: { Authorization: `Bearer ${token}` }, params: { recipient_id: peer.id, message: chatMessage } }
      );
      toast.success(`Message sent to ${peer.full_name || peer.username}!`);
      setChatMessage('');
      setShowChat(false);
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const handleFollow = async (peerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/learning/follow`,
        { user_id: peerId },
        { headers: { Authorization: `Bearer ${token}` }, params: { user_id: peerId } }
      );
      
      if (response.data.following) {
        setFollowing([...following, peerId]);
        toast.success('Following!');
      } else {
        setFollowing(following.filter(id => id !== peerId));
        toast.info('Unfollowed');
      }
    } catch (err) {
      toast.error('Failed to update follow status');
    }
  };

  const handleSendMessage = async () => {
    if (chatMessage.trim() && selectedPeer) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/learning/send-message`,
          { recipient_id: selectedPeer.id, message: chatMessage },
          { headers: { Authorization: `Bearer ${token}` }, params: { recipient_id: selectedPeer.id, message: chatMessage } }
        );
        toast.success('Message sent!');
        setChatMessage('');
        setShowChat(false);
      } catch (err) {
        toast.error('Failed to send message');
      }
    }
  };

  const filteredPeers = peers
    .filter(peer => {
      if (filter === 'high') return peer.match_score >= 85;
      if (filter === 'medium') return peer.match_score >= 70 && peer.match_score < 85;
      if (filter === 'following') return following.includes(peer.id);
      return true;
    })
    .filter(peer => 
      peer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peer.primary_topic?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-people me-2"></i>Peer Twin Matching</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={() => setShowMessages(!showMessages)}>
            <i className="bi bi-envelope me-2"></i>Messages
            {messages.filter(m => !m.is_read).length > 0 && (
              <span className="badge bg-danger ms-2">{messages.filter(m => !m.is_read).length}</span>
            )}
          </button>
          <span className="badge bg-primary align-self-center">{peers.length} Matches</span>
        </div>
      </div>

      {showMessages && (
        <div className="card p-4 mb-4">
          <h5 className="mb-3"><i className="bi bi-envelope me-2"></i>Your Messages</h5>
          {messages.length === 0 ? (
            <p className="text-muted">No messages yet</p>
          ) : (
            <div className="d-flex flex-column gap-2">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`p-3 rounded ${msg.is_read ? 'bg-light' : 'bg-primary bg-opacity-10 border border-primary'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => openChat(msg)}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong>{msg.sender_name || msg.sender_username}</strong>
                      <small className="text-muted ms-2">@{msg.sender_username}</small>
                    </div>
                    <small className="text-muted">{new Date(msg.timestamp).toLocaleString()}</small>
                  </div>
                  <p className="mb-0">{msg.message}</p>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    {!msg.is_read && <span className="badge bg-primary">New</span>}
                    <button className="btn btn-sm btn-primary ms-auto" onClick={(e) => { e.stopPropagation(); openChat(msg); }}>
                      <i className="bi bi-reply me-1"></i>Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeChatUser && (
        <div className="card mb-4" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--primary)' }}>
            <div>
              <h6 className="mb-0">{activeChatUser.name || activeChatUser.username}</h6>
              <small className="text-muted">@{activeChatUser.username}</small>
            </div>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setActiveChatUser(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          
          <div className="flex-grow-1 p-3 overflow-auto" style={{ backgroundColor: 'var(--background)' }}>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`d-flex mb-3 ${msg.is_sent ? 'justify-content-end' : ''}`}>
                <div className={`p-3 rounded ${msg.is_sent ? 'bg-primary text-white' : 'bg-white shadow-sm'}`} style={{ maxWidth: '70%' }}>
                  <p className="mb-1">{msg.message}</p>
                  <small className={msg.is_sent ? 'text-white-50' : 'text-muted'}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-top">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Type your reply..." 
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendReply()}
              />
              <button className="btn btn-primary" onClick={sendReply}>
                <i className="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {!selectedPeer ? (
        <>
          <div className="card p-4 mb-4" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
            <div className="text-center text-white">
              <i className="bi bi-people-fill" style={{ fontSize: '3rem' }}></i>
              <h4 className="mt-3 mb-2">Find Your Learning Twin</h4>
              <p className="mb-0">Connect with learners who share similar goals, skills, and learning patterns</p>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by name, username, or topic..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <div className="btn-group w-100" role="group">
                <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('all')}>
                  All ({peers.length})
                </button>
                <button className={`btn ${filter === 'high' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('high')}>
                  High Match (85%+)
                </button>
                <button className={`btn ${filter === 'medium' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('medium')}>
                  Medium (70-84%)
                </button>
                <button className={`btn ${filter === 'following' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('following')}>
                  Following ({following.length})
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredPeers.length === 0 ? (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              No matches found. Try adjusting your filters!
            </div>
          ) : (
            <div className="row g-4">
              {filteredPeers.map((peer, i) => (
                <div key={peer.id} className="col-md-4">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.02 }}>
                    <div className="card p-4 h-100">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div 
                          className="rounded-circle d-inline-flex align-items-center justify-content-center text-white" 
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            fontSize: '1.2rem',
                            backgroundColor: getAvatarColor(peer.username),
                            fontWeight: 'bold'
                          }}
                        >
                          {getAvatarInitials(peer.full_name, peer.username)}
                        </div>
                        <button 
                          className={`btn btn-sm ${following.includes(peer.id) ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => handleFollow(peer.id)}
                        >
                          <i className={`bi bi-${following.includes(peer.id) ? 'check' : 'plus'}`}></i>
                        </button>
                      </div>
                      
                      <h5 className="mb-1">{peer.full_name || peer.username}</h5>
                      <small className="text-muted d-block mb-2">@{peer.username}</small>
                      
                      <div className="d-flex gap-2 mb-3">
                        <span className="badge" style={{ backgroundColor: getAvatarColor(peer.username) }}>
                          {peer.primary_topic || 'Learning'}
                        </span>
                        {peer.streak >= 7 && (
                          <span className="badge bg-warning">
                            <i className="bi bi-fire me-1"></i>{peer.streak} day streak
                          </span>
                        )}
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-muted">Match Score</small>
                          <small className="fw-bold">{peer.match_score}%</small>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar" 
                            style={{ 
                              width: `${peer.match_score}%`,
                              backgroundColor: peer.match_score >= 85 ? '#4ECDC4' : peer.match_score >= 70 ? '#F7B731' : '#FF6B6B'
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--background)' }}>
                            <h6 className="mb-0">{peer.completed_lessons}</h6>
                            <small className="text-muted">Lessons</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--background)' }}>
                            <h6 className="mb-0">{peer.points}</h6>
                            <small className="text-muted">Points</small>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button className="btn btn-primary btn-sm flex-grow-1" onClick={() => setSelectedPeer(peer)}>
                          <i className="bi bi-eye me-1"></i>View
                        </button>
                        <button className="btn btn-outline-primary btn-sm flex-grow-1" onClick={() => handleConnect(peer)}>
                          <i className="bi bi-chat me-1"></i>Connect
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button className="btn btn-outline-secondary mb-4" onClick={() => setSelectedPeer(null)}>
            <i className="bi bi-arrow-left me-2"></i>Back to Matches
          </button>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card p-4 text-center sticky-top" style={{ top: '20px' }}>
                <div 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3 text-white" 
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    fontSize: '2.5rem',
                    backgroundColor: getAvatarColor(selectedPeer.username),
                    fontWeight: 'bold'
                  }}
                >
                  {getAvatarInitials(selectedPeer.full_name, selectedPeer.username)}
                </div>
                
                <h4 className="mb-1">{selectedPeer.full_name || selectedPeer.username}</h4>
                <small className="text-muted d-block mb-3">@{selectedPeer.username}</small>
                
                {selectedPeer.career_goal && (
                  <p className="mb-3">
                    <i className="bi bi-target me-2"></i>
                    <strong>{selectedPeer.career_goal}</strong>
                  </p>
                )}

                <div className="mb-4">
                  <h2 style={{ color: getAvatarColor(selectedPeer.username) }}>{selectedPeer.match_score}%</h2>
                  <small className="text-muted">Match Score</small>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="p-2 rounded bg-light">
                      <h5 className="mb-0">{selectedPeer.streak}</h5>
                      <small className="text-muted">Day Streak</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded bg-light">
                      <h5 className="mb-0">{selectedPeer.points}</h5>
                      <small className="text-muted">Points</small>
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary w-100 mb-2" onClick={() => setShowChat(true)}>
                  <i className="bi bi-chat-dots me-2"></i>Send Message
                </button>
                <button 
                  className={`btn ${following.includes(selectedPeer.id) ? 'btn-success' : 'btn-outline-secondary'} w-100 mb-2`}
                  onClick={() => handleFollow(selectedPeer.id)}
                >
                  <i className={`bi bi-${following.includes(selectedPeer.id) ? 'check-circle' : 'bookmark'} me-2`}></i>
                  {following.includes(selectedPeer.id) ? 'Following' : 'Follow'}
                </button>
                <button className="btn btn-outline-primary w-100">
                  <i className="bi bi-people me-2"></i>Study Together
                </button>
              </div>
            </div>

            <div className="col-md-8">
              <div className="card p-4 mb-3">
                <h5 className="mb-3"><i className="bi bi-graph-up me-2"></i>Learning Progress</h5>
                <div className="progress mb-3" style={{ height: '25px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${Math.round(selectedPeer.total_mastery * 100)}%`,
                      backgroundColor: getAvatarColor(selectedPeer.username)
                    }}
                  >
                    {Math.round(selectedPeer.total_mastery * 100)}%
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 rounded bg-light">
                      <h4 className="mb-0">{selectedPeer.completed_lessons}</h4>
                      <small className="text-muted">Lessons Completed</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 rounded bg-light">
                      <h4 className="mb-0">{(selectedPeer.total_mastery * 100).toFixed(1)}%</h4>
                      <small className="text-muted">Overall Mastery</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-4 mb-3">
                <h5 className="mb-3"><i className="bi bi-star me-2"></i>Skills & Expertise</h5>
                <div className="row g-3">
                  {selectedPeer.learning_dna && Object.entries(selectedPeer.learning_dna).map(([skill, level]) => {
                    if (level > 0) {
                      const skillName = skill.replace('_level', '').replace('_', ' ');
                      const skillLabel = skillName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                      return (
                        <div key={skill} className="col-md-6">
                          <div className="p-3 rounded bg-light">
                            <div className="d-flex justify-content-between mb-2">
                              <strong>{skillLabel}</strong>
                              <span className="badge bg-primary">{Math.round(level * 100)}%</span>
                            </div>
                            <div className="progress" style={{ height: '10px' }}>
                              <div 
                                className="progress-bar" 
                                style={{ 
                                  width: `${level * 100}%`,
                                  backgroundColor: getAvatarColor(selectedPeer.username)
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              <div className="card p-4">
                <h5 className="mb-3"><i className="bi bi-trophy me-2"></i>Why You Match</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Similar learning pace and progress
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Shared interest in {selectedPeer.primary_topic}
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Compatible skill levels for collaboration
                  </li>
                  {selectedPeer.match_score >= 85 && (
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Highly compatible learning patterns
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div 
            className="modal show d-block" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-chat-dots me-2"></i>
                    Message {selectedPeer?.full_name || selectedPeer?.username}
                  </h5>
                  <button className="btn-close" onClick={() => setShowChat(false)}></button>
                </div>
                <div className="modal-body">
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowChat(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSendMessage}>
                    <i className="bi bi-send me-2"></i>Send Message
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

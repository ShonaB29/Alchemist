import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

export default function ConfidenceQuiz() {
  const [started, setStarted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [confidence, setConfidence] = useState(50);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);

  const topics = [
    { id: 'python', name: 'Python Basics', icon: 'bi-code-slash', color: '#3776AB', questions: 10 },
    { id: 'sql', name: 'SQL & Databases', icon: 'bi-database', color: '#F7B731', questions: 8 },
    { id: 'ds', name: 'Data Structures', icon: 'bi-diagram-3', color: '#4ECDC4', questions: 12 },
    { id: 'ml', name: 'Machine Learning', icon: 'bi-cpu', color: '#FF6B6B', questions: 10 }
  ];

  const quizData = {
    python: [
      { q: 'What is a variable in Python?', options: ['A container for data', 'A function', 'A loop', 'A class'], correct: 0, hint: 'Think of it as a box that holds information' },
      { q: 'Which keyword is used to define a function?', options: ['func', 'def', 'function', 'define'], correct: 1, hint: 'Short for "define"' },
      { q: 'What does len() return?', options: ['Length of object', 'Type of object', 'Value of object', 'None'], correct: 0, hint: 'It counts elements' },
      { q: 'Which is mutable in Python?', options: ['Tuple', 'String', 'List', 'Integer'], correct: 2, hint: 'Can be changed after creation' },
      { q: 'What is the output of 3 ** 2?', options: ['6', '9', '5', '8'], correct: 1, hint: '** means exponentiation' }
    ],
    sql: [
      { q: 'What does SQL stand for?', options: ['Simple Query Language', 'Structured Query Language', 'System Query Language', 'Standard Query Language'], correct: 1, hint: 'It\'s about structure' },
      { q: 'Which command retrieves data?', options: ['GET', 'FETCH', 'SELECT', 'RETRIEVE'], correct: 2, hint: 'Most common SQL command' },
      { q: 'What does JOIN do?', options: ['Combines tables', 'Deletes rows', 'Updates data', 'Creates table'], correct: 0, hint: 'Brings data together' },
      { q: 'Which is NOT a SQL clause?', options: ['WHERE', 'HAVING', 'LOOP', 'GROUP BY'], correct: 2, hint: 'SQL doesn\'t have loops' }
    ],
    ds: [
      { q: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Array', 'Tree'], correct: 1, hint: 'Last In, First Out - like a stack of plates' },
      { q: 'What is Big O of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1, hint: 'Divides problem in half each time' },
      { q: 'Which uses FIFO?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correct: 1, hint: 'First In, First Out - like a line' },
      { q: 'What is a linked list node?', options: ['Data only', 'Pointer only', 'Data + Pointer', 'Array element'], correct: 2, hint: 'Contains both value and reference' }
    ],
    ml: [
      { q: 'What is supervised learning?', options: ['Learning with labels', 'Learning without labels', 'Reinforcement', 'Clustering'], correct: 0, hint: 'Teacher provides correct answers' },
      { q: 'Which is a classification algorithm?', options: ['Linear Regression', 'K-Means', 'Decision Tree', 'PCA'], correct: 2, hint: 'Predicts categories' },
      { q: 'What does overfitting mean?', options: ['Too simple', 'Too complex', 'Perfect fit', 'No fit'], correct: 1, hint: 'Model memorizes training data' }
    ]
  };

  useEffect(() => {
    if (started && !showResults && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && started) {
      handleAnswer(-1, confidence);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, started, showResults]);

  const questions = selectedTopic ? quizData[selectedTopic] : [];

  const handleAnswer = (idx, conf) => {
    const isCorrect = idx === questions[currentQ].correct;
    setAnswers([...answers, { question: currentQ, answer: idx, confidence: conf, correct: isCorrect, timeTaken: 30 - timeLeft }]);
    
    if (isCorrect) {
      setStreak(streak + 1);
      toast.success(`Correct! 🎉 Streak: ${streak + 1}`);
    } else {
      setStreak(0);
      toast.error('Incorrect. Keep trying!');
    }

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setTimeLeft(30);
      setShowHint(false);
      setConfidence(50);
    } else {
      setShowResults(true);
    }
  };

  const score = answers.filter(a => a.correct).length;
  const avgConfidence = answers.reduce((sum, a) => sum + a.confidence, 0) / answers.length || 0;
  const avgTime = answers.reduce((sum, a) => sum + a.timeTaken, 0) / answers.length || 0;

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'D';
    
    return (
      <div className="p-4">
        <h2 className="mb-4"><i className="bi bi-trophy me-2"></i>Quiz Results</h2>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="card p-5">
            <div className="text-center mb-4">
              <div className="display-1 mb-3" style={{ color: percentage >= 70 ? '#4ECDC4' : '#FF6B6B' }}>{percentage}%</div>
              <h2 className="mb-2">Grade: {grade}</h2>
              <p className="text-muted">You got {score} out of {questions.length} correct!</p>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card p-3 text-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <h4 className="mb-0">{score}/{questions.length}</h4>
                  <small>Correct</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 text-center" style={{ backgroundColor: 'var(--secondary)' }}>
                  <h4 className="mb-0">{Math.round(avgConfidence)}%</h4>
                  <small>Avg Confidence</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 text-center" style={{ backgroundColor: 'var(--accent-lavender)' }}>
                  <h4 className="mb-0">{Math.round(avgTime)}s</h4>
                  <small>Avg Time</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 text-center" style={{ backgroundColor: 'var(--accent-vanilla)' }}>
                  <h4 className="mb-0">{streak}</h4>
                  <small>Best Streak</small>
                </div>
              </div>
            </div>

            <div className="card p-4 bg-light mb-4">
              <h5 className="mb-3"><i className="bi bi-list-check me-2"></i>Question Review</h5>
              {answers.map((ans, i) => (
                <div key={i} className="mb-3 p-3 rounded bg-white">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <strong>Q{i + 1}: {questions[i].q}</strong>
                      <div className="mt-2">
                        <span className={`badge ${ans.correct ? 'bg-success' : 'bg-danger'} me-2`}>
                          {ans.correct ? 'Correct' : 'Incorrect'}
                        </span>
                        <small className="text-muted">Confidence: {ans.confidence}% | Time: {ans.timeTaken}s</small>
                      </div>
                      {!ans.correct && (
                        <div className="mt-2">
                          <small className="text-success">Correct answer: {questions[i].options[questions[i].correct]}</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-4 bg-light mb-4">
              <h5 className="mb-3"><i className="bi bi-lightbulb me-2"></i>Recommendations</h5>
              <ul className="mb-0">
                {percentage < 70 && <li>Review {topics.find(t => t.id === selectedTopic)?.name} fundamentals</li>}
                {avgConfidence > percentage + 20 && <li>Your confidence is higher than performance - practice more!</li>}
                {avgConfidence < percentage - 20 && <li>Great job! Build more confidence in your abilities</li>}
                {avgTime > 20 && <li>Try to answer faster - practice will improve your speed</li>}
                {percentage >= 90 && <li>Excellent work! Ready for advanced topics</li>}
              </ul>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary flex-grow-1" onClick={() => { setShowResults(false); setStarted(false); setCurrentQ(0); setAnswers([]); setSelectedTopic(null); setStreak(0); }}>
                <i className="bi bi-arrow-left me-2"></i>Choose Another Topic
              </button>
              <button className="btn btn-success flex-grow-1" onClick={() => { setShowResults(false); setCurrentQ(0); setAnswers([]); setStreak(0); }}>
                <i className="bi bi-arrow-repeat me-2"></i>Retake Quiz
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="p-4">
        <h2 className="mb-4"><i className="bi bi-patch-check me-2"></i>Confidence-Based Quiz</h2>
        
        <div className="card p-4 mb-4" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
          <div className="text-center text-white">
            <i className="bi bi-patch-question" style={{ fontSize: '4rem' }}></i>
            <h3 className="mt-3 mb-2">Ready to test your knowledge?</h3>
            <p className="mb-0">This adaptive quiz adjusts difficulty based on your confidence and performance</p>
          </div>
        </div>

        <h5 className="mb-3">Choose a Topic</h5>
        <div className="row g-3">
          {topics.map(topic => (
            <div key={topic.id} className="col-md-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="card p-4 h-100" style={{ cursor: 'pointer', borderLeft: `4px solid ${topic.color}` }} onClick={() => { setSelectedTopic(topic.id); setStarted(true); }}>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle p-3 me-3" style={{ backgroundColor: topic.color + '20' }}>
                      <i className={`${topic.icon}`} style={{ fontSize: '2rem', color: topic.color }}></i>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1">{topic.name}</h5>
                      <small className="text-muted">{topic.questions} questions • 30s each</small>
                    </div>
                    <i className="bi bi-arrow-right" style={{ fontSize: '1.5rem', color: topic.color }}></i>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-patch-check me-2"></i>{topics.find(t => t.id === selectedTopic)?.name} Quiz</h2>
        <div className="d-flex gap-2 align-items-center">
          <span className="badge bg-warning">🔥 Streak: {streak}</span>
          <span className={`badge ${timeLeft <= 10 ? 'bg-danger' : 'bg-primary'}`}>
            <i className="bi bi-clock me-1"></i>{timeLeft}s
          </span>
        </div>
      </div>
      
      <div className="card p-3 mb-3">
        <div className="d-flex justify-content-between mb-2">
          <span>Question {currentQ + 1} of {questions.length}</span>
          <span className="text-muted">{Math.round(((currentQ + 1) / questions.length) * 100)}% Complete</span>
        </div>
        <div className="progress" style={{ height: '10px' }}>
          <div className="progress-bar" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
          <div className="card p-5 mb-3">
            <h4 className="mb-4">{questions[currentQ]?.q}</h4>
            <div className="d-flex flex-column gap-3 mb-4">
              {questions[currentQ]?.options.map((opt, i) => (
                <motion.button key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-outline-secondary text-start p-3" onClick={() => handleAnswer(i, confidence)}>
                  <span className="badge bg-primary me-3">{String.fromCharCode(65 + i)}</span>{opt}
                </motion.button>
              ))}
            </div>

            {showHint && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert alert-info">
                <i className="bi bi-lightbulb me-2"></i><strong>Hint:</strong> {questions[currentQ]?.hint}
              </motion.div>
            )}

            <button className="btn btn-sm btn-outline-warning mb-3" onClick={() => setShowHint(!showHint)}>
              <i className="bi bi-lightbulb me-2"></i>{showHint ? 'Hide' : 'Show'} Hint
            </button>

            <div>
              <div className="d-flex justify-content-between mb-2">
                <h6>How confident are you?</h6>
                <span className="badge bg-primary">{confidence}%</span>
              </div>
              <input type="range" className="form-range" min="0" max="100" value={confidence} onChange={(e) => setConfidence(parseInt(e.target.value))} />
              <div className="d-flex justify-content-between">
                <small className="text-muted">Not sure</small>
                <small className="text-muted">Very confident</small>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

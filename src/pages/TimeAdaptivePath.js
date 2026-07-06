import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../services/api';



export default function TimeAdaptivePath() {
  const [isWeekend, setIsWeekend] = useState(false);
  const [timeAvailable, setTimeAvailable] = useState(2);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [schedules, setSchedules] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [streak, setStreak] = useState(5);

  const [activeLearning, setActiveLearning] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const weekendDays = ['Saturday', 'Sunday'];

  useEffect(() => {
    const saved = localStorage.getItem('timeSchedules');
    if (saved) setSchedules(JSON.parse(saved));

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const wd = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const we = ['Saturday', 'Sunday'];
    if (wd.includes(today) || we.includes(today)) {
      setSelectedDay(today);
      setIsWeekend(we.includes(today));
    }

    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/learning/user-progress`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (res.data?.stats?.currentStreak) setStreak(res.data.stats.currentStreak);
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartLearning = (day, index, block) => {
    setActiveLearning({ day, index, block });
    setCurrentStage(0);
    setQuizAnswers({});
  };

  const handleNextStage = () => {
    if (currentStage < 4) {
      setCurrentStage(currentStage + 1);
    } else {
      setCurrentStage(5);
    }
  };

  const handleQuizSubmit = async () => {
    const correctAnswers = Object.values(quizAnswers).filter(a => a === true).length;
    const total = activeLearning.block.quiz.length;
    const score = Math.round((correctAnswers / total) * 100);

    if (score >= 70) {
      // Save to localStorage
      const key = `${activeLearning.day}-${activeLearning.index}`;
      const newSchedules = { ...schedules, [key]: true };
      setSchedules(newSchedules);
      localStorage.setItem('timeSchedules', JSON.stringify(newSchedules));

      // Save to real database
      try {
        const token = localStorage.getItem('token');
        const topic = activeLearning.block.topic || 'general';
        await axios.post(
          `${API_URL}/learning/complete-lesson`,
          null,
          {
            params: { lesson_name: activeLearning.block.lesson, score, topic },
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } catch (err) {
        console.error('Failed to save progress to server:', err);
      }

      toast.success(`Great job! You scored ${score}% 🎉 Progress saved!`);
      setActiveLearning(null);
      setCurrentStage(0);
      setStreak(prev => prev + 1);
    } else {
      toast.error(`Score: ${score}%. You need 70% to pass. Review and try again!`);
    }
  };

  const handleQuizAnswer = (questionIndex, optionIndex, isCorrect) => {
    setQuizAnswers({ ...quizAnswers, [questionIndex]: isCorrect });
  };

  const isCompleted = (day, index) => schedules[`${day}-${index}`] || false;

  const weekdaySchedules = {
    'Monday': [
      { 
        time: '7:00 AM', 
        lesson: 'Python Basics Review', 
        duration: '15 min', 
        type: 'Micro', 
        link: 'https://www.youtube.com/watch?v=rfscVS0vtbw', 
        icon: 'bi-code-slash', 
        color: '#3776AB',
        stages: [
          { title: 'Introduction', content: 'Python is a high-level, interpreted programming language known for its simplicity and readability.' },
          { title: 'Variables & Data Types', content: 'Python has dynamic typing. Common types: int, float, str, bool, list, dict, tuple.' },
          { title: 'Control Flow', content: 'Control flow: if/elif/else, for loops, while loops, break/continue statements.' },
          { title: 'Functions', content: 'Functions defined with def keyword. Support parameters, return values, default arguments.' },
          { title: 'Best Practices', content: 'Follow PEP 8, use meaningful names, write docstrings, handle exceptions properly.' }
        ],
        quiz: [
          { question: 'What is Python?', options: ['Compiled language', 'Interpreted language', 'Assembly language', 'Machine code'], correct: 1 },
          { question: 'Which is mutable?', options: ['Tuple', 'String', 'List', 'Integer'], correct: 2 },
          { question: 'How to define function?', options: ['function myFunc()', 'def myFunc():', 'func myFunc():', 'define myFunc():'], correct: 1 }
        ]
      },
      { 
        time: '12:30 PM', 
        lesson: 'SQL Practice Problems', 
        duration: '20 min', 
        type: 'Micro', 
        link: 'https://leetcode.com/problemset/database/', 
        icon: 'bi-database', 
        color: '#F7B731',
        stages: [
          { title: 'SQL Basics', content: 'SQL manages relational databases. Key commands: SELECT, INSERT, UPDATE, DELETE.' },
          { title: 'SELECT Queries', content: 'SELECT retrieves data. Use WHERE for filtering, ORDER BY for sorting, LIMIT for restricting.' },
          { title: 'JOINs', content: 'JOINs combine tables. INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN.' },
          { title: 'Aggregations', content: 'Functions: COUNT, SUM, AVG, MAX, MIN. Use GROUP BY and HAVING.' },
          { title: 'Subqueries', content: 'Queries within queries. Used in SELECT, FROM, WHERE clauses.' }
        ],
        quiz: [
          { question: 'What does SQL stand for?', options: ['Simple Query Language', 'Structured Query Language', 'System Query Language', 'Standard Query Language'], correct: 1 },
          { question: 'Which JOIN returns all left rows?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN'], correct: 1 },
          { question: 'Which filters grouped results?', options: ['WHERE', 'FILTER', 'HAVING', 'GROUP'], correct: 2 }
        ]
      },
      { 
        time: '8:00 PM', 
        lesson: 'Data Structures Concepts', 
        duration: '30 min', 
        type: 'Quick', 
        link: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', 
        icon: 'bi-diagram-3', 
        color: '#4ECDC4',
        stages: [
          { title: 'Introduction', content: 'Data structures organize data efficiently for access and modification.' },
          { title: 'Arrays & Lists', content: 'Arrays store elements in contiguous memory. Lists are dynamic arrays.' },
          { title: 'Stacks & Queues', content: 'Stack: LIFO. Queue: FIFO. Both have O(1) operations.' },
          { title: 'Trees & Graphs', content: 'Trees: hierarchical structure. Graphs: nodes connected by edges.' },
          { title: 'Hash Tables', content: 'Key-value pairs with O(1) average lookup time.' }
        ],
        quiz: [
          { question: 'Which uses LIFO?', options: ['Queue', 'Stack', 'Array', 'Tree'], correct: 1 },
          { question: 'Hash table average lookup?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct: 0 },
          { question: 'Best for hierarchical data?', options: ['Array', 'Stack', 'Tree', 'Queue'], correct: 2 }
        ]
      }
    ],
    'Tuesday': [
      { time: '6:30 AM', lesson: 'Algorithm Practice', duration: '20 min', type: 'Micro', link: 'https://leetcode.com/problemset/algorithms/', icon: 'bi-cpu', color: '#FF6B6B', stages: [{ title: 'Algorithm Fundamentals', content: 'Algorithms are step-by-step procedures for solving problems. Key concepts: input/output, correctness, efficiency. Common types: sorting, searching, graph traversal, dynamic programming.' }, { title: 'Time Complexity', content: 'Big O notation measures algorithm efficiency. O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic. Choose algorithms based on input size.' }, { title: 'Space Complexity', content: 'Memory usage matters. In-place algorithms use O(1) space. Recursive algorithms use stack space O(n). Trade-offs between time and space complexity exist.' }, { title: 'Problem Solving Strategy', content: 'Understand the problem first. Identify patterns. Consider edge cases. Start with brute force, then optimize. Test with examples. Analyze complexity.' }, { title: 'Common Patterns', content: 'Two pointers, sliding window, fast/slow pointers, merge intervals, cyclic sort, in-place reversal, tree BFS/DFS, topological sort, binary search, dynamic programming.' }], quiz: [{ question: 'What is Big O?', options: ['Time complexity notation', 'Programming language', 'Data structure', 'Algorithm name'], correct: 0 }, { question: 'Best average sorting?', options: ['Bubble O(n²)', 'Quick O(n log n)', 'Selection O(n²)', 'Insertion O(n²)'], correct: 1 }, { question: 'Binary search complexity?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1 }] },
      { time: '1:00 PM', lesson: 'Web Dev Tutorial', duration: '15 min', type: 'Micro', link: 'https://www.youtube.com/watch?v=mU6anWqZJcc', icon: 'bi-globe', color: '#5F27CD', stages: [{ title: 'HTML Structure', content: 'HTML provides structure. Semantic tags: header, nav, main, article, section, aside, footer. Use proper heading hierarchy h1-h6. Forms: input, select, textarea, button.' }, { title: 'CSS Styling', content: 'CSS styles HTML. Selectors: element, class, id, attribute. Box model: margin, border, padding, content. Flexbox for 1D layouts, Grid for 2D layouts. Responsive design with media queries.' }, { title: 'JavaScript Basics', content: 'JavaScript adds interactivity. Variables: let, const. Data types: string, number, boolean, object, array. Functions, loops, conditionals. DOM manipulation: querySelector, addEventListener, createElement.' }, { title: 'Modern JavaScript', content: 'ES6+ features: arrow functions, template literals, destructuring, spread operator, promises, async/await. Modules: import/export. Fetch API for HTTP requests.' }, { title: 'Best Practices', content: 'Semantic HTML for accessibility. Mobile-first CSS. Minimize JavaScript. Use CDN for libraries. Optimize images. Lazy loading. Progressive enhancement. Cross-browser testing.' }], quiz: [{ question: 'What is HTML?', options: ['Programming language', 'Markup language', 'Style language', 'Database'], correct: 1 }, { question: 'CSS for layout?', options: ['Tables', 'Flexbox/Grid', 'Inline styles', 'JavaScript'], correct: 1 }, { question: 'Modern JS feature?', options: ['var only', 'Arrow functions', 'No functions', 'Only loops'], correct: 1 }] },
      { time: '9:00 PM', lesson: 'React Components', duration: '25 min', type: 'Quick', link: 'https://www.youtube.com/watch?v=bMknfKXIFA8', icon: 'bi-layers', color: '#00D2D3', stages: [{ title: 'Component Basics', content: 'React components are reusable UI pieces. Functional components use functions. Return JSX (JavaScript XML). Props pass data down. Components compose to build complex UIs.' }, { title: 'Props and State', content: 'Props are read-only inputs from parent. State is internal mutable data. useState hook manages state. Props flow down, events flow up. Lift state up for shared data.' }, { title: 'React Hooks', content: 'useState for state, useEffect for side effects, useContext for global state, useRef for DOM access, useMemo for expensive calculations, useCallback for function memoization.' }, { title: 'Component Lifecycle', content: 'Mounting: component created. Updating: props/state change. Unmounting: component removed. useEffect handles lifecycle: runs after render, cleanup on unmount, dependencies control re-runs.' }, { title: 'Best Practices', content: 'Keep components small and focused. Use functional components. Destructure props. Avoid inline functions in JSX. Use keys in lists. Memoize expensive operations. Handle errors with boundaries.' }], quiz: [{ question: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax', 'JSON XML', 'JavaScript Extension'], correct: 0 }, { question: 'State management hook?', options: ['useProps', 'useState', 'useData', 'useValue'], correct: 1 }, { question: 'Props are?', options: ['Mutable', 'Read-only', 'Optional', 'Functions only'], correct: 1 }] }
    ],
    'Wednesday': [
      { time: '7:00 AM', lesson: 'Math Problem Solving', duration: '15 min', type: 'Micro', icon: 'bi-calculator', color: '#E74C3C', stages: [{ title: 'Stage 1', content: 'Math fundamentals' }, { title: 'Stage 2', content: 'Problem solving' }, { title: 'Stage 3', content: 'Patterns' }, { title: 'Stage 4', content: 'Optimization' }, { title: 'Stage 5', content: 'Practice' }], quiz: [{ question: 'What is algebra?', options: ['Math branch', 'Science', 'Language', 'Art'], correct: 0 }] },
      { time: '12:00 PM', lesson: 'API Integration', duration: '20 min', type: 'Micro', icon: 'bi-plug', color: '#9B59B6', stages: [{ title: 'Stage 1', content: 'API basics' }, { title: 'Stage 2', content: 'REST principles' }, { title: 'Stage 3', content: 'HTTP methods' }, { title: 'Stage 4', content: 'Authentication' }, { title: 'Stage 5', content: 'Error handling' }], quiz: [{ question: 'What is REST?', options: ['Protocol', 'Architecture', 'Language', 'Database'], correct: 1 }] },
      { time: '8:30 PM', lesson: 'Database Design', duration: '30 min', type: 'Quick', icon: 'bi-server', color: '#16A085', stages: [{ title: 'Stage 1', content: 'Database concepts' }, { title: 'Stage 2', content: 'Schema design' }, { title: 'Stage 3', content: 'Normalization' }, { title: 'Stage 4', content: 'Relationships' }, { title: 'Stage 5', content: 'Optimization' }], quiz: [{ question: 'What is normalization?', options: ['Data organization', 'Data deletion', 'Data backup', 'Data encryption'], correct: 0 }] }
    ],
    'Thursday': [
      { time: '6:45 AM', lesson: 'Code Review', duration: '15 min', type: 'Micro', icon: 'bi-eye', color: '#F39C12', stages: [{ title: 'What is Code Review?', content: 'Code review is the systematic examination of source code by peers to find bugs, improve quality, and share knowledge. It helps catch errors early and maintains code standards across the team.' }, { title: 'Review Checklist', content: 'Check for: correct logic, readable code, proper naming, error handling, security issues, performance problems, test coverage, and documentation. Follow your team\'s style guide.' }, { title: 'Common Issues', content: 'Look for: hardcoded values, missing error handling, SQL injection risks, memory leaks, inefficient algorithms, unclear variable names, and missing edge case handling.' }, { title: 'Giving Feedback', content: 'Be constructive and specific. Explain why something should change. Suggest alternatives. Praise good code. Focus on the code, not the person. Use "we" instead of "you".' }, { title: 'Best Practices', content: 'Review small chunks frequently. Use automated tools first. Check tests run and pass. Verify documentation is updated. Ensure code follows team standards. Approve only when confident.' }], quiz: [{ question: 'Why do code reviews?', options: ['Improve quality', 'Waste time', 'Blame developers', 'Slow down'], correct: 0 }, { question: 'What to check in review?', options: ['Only syntax', 'Logic, security, style', 'Just comments', 'Nothing'], correct: 1 }, { question: 'How to give feedback?', options: ['Be rude', 'Be constructive', 'Ignore issues', 'Auto-approve'], correct: 1 }] },
      { time: '1:30 PM', lesson: 'Testing Basics', duration: '20 min', type: 'Micro', icon: 'bi-bug', color: '#E67E22', stages: [{ title: 'Stage 1', content: 'Testing intro' }, { title: 'Stage 2', content: 'Unit tests' }, { title: 'Stage 3', content: 'Integration tests' }, { title: 'Stage 4', content: 'Test coverage' }, { title: 'Stage 5', content: 'Best practices' }], quiz: [{ question: 'What is unit test?', options: ['Test single unit', 'Test all code', 'Test UI', 'Test database'], correct: 0 }] },
      { time: '8:00 PM', lesson: 'Project Work', duration: '35 min', type: 'Quick', icon: 'bi-folder', color: '#2ECC71', stages: [{ title: 'Stage 1', content: 'Project planning' }, { title: 'Stage 2', content: 'Implementation' }, { title: 'Stage 3', content: 'Testing' }, { title: 'Stage 4', content: 'Deployment' }, { title: 'Stage 5', content: 'Maintenance' }], quiz: [{ question: 'First step in project?', options: ['Code', 'Plan', 'Test', 'Deploy'], correct: 1 }] }
    ],
    'Friday': [
      { time: '7:00 AM', lesson: 'Weekly Review', duration: '20 min', type: 'Micro', icon: 'bi-journal-check', color: '#3498DB', stages: [{ title: 'Progress Assessment', content: 'Review what you learned this week. List completed topics, projects, and exercises. Identify your strongest areas and topics that need more practice. Celebrate small wins and progress made.' }, { title: 'Knowledge Gaps', content: 'Identify concepts that are still unclear. Note questions that arose during learning. Mark topics for deeper study. Recognize patterns in mistakes. Plan targeted review sessions for weak areas.' }, { title: 'Practical Application', content: 'How did you apply new knowledge? What projects did you build? Which problems did you solve? Connect theory to practice. Document real-world use cases you encountered.' }, { title: 'Learning Effectiveness', content: 'Evaluate your study methods. What worked well? What didn\'t? Adjust your schedule if needed. Consider different learning resources. Optimize your study environment and habits.' }, { title: 'Next Week Planning', content: 'Set specific goals for next week. Choose 2-3 main topics to focus on. Schedule dedicated learning time. Prepare resources in advance. Balance new topics with review of current material.' }], quiz: [{ question: 'Why weekly review?', options: ['Track progress', 'Waste time', 'No reason', 'Procrastinate'], correct: 0 }, { question: 'What to identify?', options: ['Only strengths', 'Knowledge gaps', 'Nothing', 'Excuses'], correct: 1 }, { question: 'Next step after review?', options: ['Give up', 'Plan ahead', 'Forget it', 'Sleep'], correct: 1 }] },
      { time: '12:30 PM', lesson: 'Quick Quiz', duration: '15 min', type: 'Micro', icon: 'bi-patch-question', color: '#1ABC9C', stages: [{ title: 'Quiz Preparation', content: 'Review key concepts from the week. Skim through notes and code examples. Identify main topics likely to appear. Practice explaining concepts in your own words. Get in the right mindset.' }, { title: 'Question Types', content: 'Multiple choice tests recall. True/false checks understanding. Fill-in-blank tests memory. Code output predicts execution. Debugging finds errors. Each type requires different strategies.' }, { title: 'Test-Taking Strategy', content: 'Read questions carefully. Eliminate wrong answers first. Watch for keywords like "always", "never", "only". Manage your time. Skip hard questions, return later. Trust your first instinct unless you find an error.' }, { title: 'Common Mistakes', content: 'Rushing through questions. Not reading all options. Overthinking simple questions. Changing correct answers. Ignoring edge cases. Not checking work. Learn from past quiz mistakes.' }, { title: 'After the Quiz', content: 'Review incorrect answers immediately. Understand why you got them wrong. Note topics needing more study. Don\'t just memorize answers, understand concepts. Use mistakes as learning opportunities.' }], quiz: [{ question: 'Quiz purpose?', options: ['Test knowledge', 'Waste time', 'Punishment', 'Entertainment'], correct: 0 }, { question: 'Best strategy?', options: ['Rush through', 'Read carefully', 'Random guess', 'Skip all'], correct: 1 }, { question: 'After wrong answer?', options: ['Ignore it', 'Understand why', 'Get angry', 'Give up'], correct: 1 }] },
      { time: '7:00 PM', lesson: 'Weekend Prep', duration: '25 min', type: 'Quick', icon: 'bi-calendar-event', color: '#34495E', stages: [{ title: 'Weekend Goals', content: 'Set 2-3 specific learning goals for the weekend. Choose one major project to work on. Plan deep dive sessions for complex topics. Balance learning with rest. Make goals measurable and achievable.' }, { title: 'Resource Gathering', content: 'Collect tutorials, documentation, and videos you\'ll need. Download datasets or starter code. Bookmark relevant articles. Prepare your development environment. Ensure all tools are installed and working.' }, { title: 'Time Blocking', content: 'Schedule specific time slots for learning. Morning for complex topics when fresh. Afternoon for projects and practice. Evening for review and planning. Include breaks every 50 minutes. Protect your learning time.' }, { title: 'Project Planning', content: 'Break weekend project into small tasks. Define clear milestones. Estimate time for each task. Prepare backup plan if stuck. Identify resources for help. Set up version control and backups.' }, { title: 'Motivation & Mindset', content: 'Visualize completing your goals. Remember why you\'re learning. Prepare rewards for achievements. Join study groups or communities. Share your goals for accountability. Stay positive and patient with yourself.' }], quiz: [{ question: 'Why plan weekend?', options: ['Stay organized', 'Waste time', 'Avoid learning', 'Procrastinate'], correct: 0 }, { question: 'How many goals?', options: ['100 goals', '2-3 specific goals', 'No goals', 'Vague goals'], correct: 1 }, { question: 'Best time for complex topics?', options: ['When tired', 'Morning when fresh', 'Never', 'While sleeping'], correct: 1 }] }
    ]
  };

  const weekendSchedules = {
    'Saturday': [
      { time: '9:00 AM', lesson: 'Machine Learning Deep Dive', duration: '2 hours', type: 'Deep', icon: 'bi-robot', color: '#8E44AD', stages: [{ title: 'Stage 1', content: 'ML introduction' }, { title: 'Stage 2', content: 'Algorithms' }, { title: 'Stage 3', content: 'Training models' }, { title: 'Stage 4', content: 'Evaluation' }, { title: 'Stage 5', content: 'Deployment' }], quiz: [{ question: 'What is ML?', options: ['Machine Learning', 'Manual Learning', 'Math Learning', 'Memory Learning'], correct: 0 }] },
      { time: '2:00 PM', lesson: 'Build ML Model Project', duration: '3 hours', type: 'Project', icon: 'bi-hammer', color: '#C0392B', stages: [{ title: 'Stage 1', content: 'Project setup' }, { title: 'Stage 2', content: 'Data collection' }, { title: 'Stage 3', content: 'Model building' }, { title: 'Stage 4', content: 'Testing' }, { title: 'Stage 5', content: 'Optimization' }], quiz: [{ question: 'First step in ML project?', options: ['Code', 'Data', 'Deploy', 'Test'], correct: 1 }] },
      { time: '7:00 PM', lesson: 'Code Review & Refactor', duration: '1 hour', type: 'Review', icon: 'bi-arrow-repeat', color: '#27AE60', stages: [{ title: 'Stage 1', content: 'Review code' }, { title: 'Stage 2', content: 'Find issues' }, { title: 'Stage 3', content: 'Refactor' }, { title: 'Stage 4', content: 'Test changes' }, { title: 'Stage 5', content: 'Document' }], quiz: [{ question: 'Why refactor?', options: ['Improve code', 'Break code', 'Delete code', 'Copy code'], correct: 0 }] }
    ],
    'Sunday': [
      { time: '10:00 AM', lesson: 'Full Stack Project', duration: '2.5 hours', type: 'Project', icon: 'bi-stack', color: '#2980B9', stages: [{ title: 'Stage 1', content: 'Project planning' }, { title: 'Stage 2', content: 'Frontend' }, { title: 'Stage 3', content: 'Backend' }, { title: 'Stage 4', content: 'Integration' }, { title: 'Stage 5', content: 'Deployment' }], quiz: [{ question: 'What is full stack?', options: ['Frontend + Backend', 'Only frontend', 'Only backend', 'Only database'], correct: 0 }] },
      { time: '3:00 PM', lesson: 'Advanced Algorithms', duration: '2 hours', type: 'Deep', icon: 'bi-bezier2', color: '#D35400', stages: [{ title: 'Stage 1', content: 'Algorithm types' }, { title: 'Stage 2', content: 'Complexity' }, { title: 'Stage 3', content: 'Optimization' }, { title: 'Stage 4', content: 'Practice' }, { title: 'Stage 5', content: 'Applications' }], quiz: [{ question: 'Best sorting algorithm?', options: ['Depends on data', 'Bubble sort', 'Sleep sort', 'Random sort'], correct: 0 }] },
      { time: '6:00 PM', lesson: 'Weekly Summary & Planning', duration: '1 hour', type: 'Review', icon: 'bi-clipboard-check', color: '#7F8C8D', stages: [{ title: 'Stage 1', content: 'Week review' }, { title: 'Stage 2', content: 'Achievements' }, { title: 'Stage 3', content: 'Challenges' }, { title: 'Stage 4', content: 'Next week goals' }, { title: 'Stage 5', content: 'Action plan' }], quiz: [{ question: 'Why plan ahead?', options: ['Stay organized', 'Waste time', 'Procrastinate', 'Avoid work'], correct: 0 }] }
    ]
  };

  const currentSchedule = isWeekend ? weekendSchedules[selectedDay] : weekdaySchedules[selectedDay];
  const days = isWeekend ? weekendDays : weekdays;

  const totalMinutes = currentSchedule?.reduce((sum, block) => {
    const mins = block.duration.includes('hour') ? parseFloat(block.duration) * 60 : parseInt(block.duration);
    return sum + mins;
  }, 0) || 0;

  const completedToday = currentSchedule?.filter((_, i) => isCompleted(selectedDay, i)).length || 0;
  const progressPercent = currentSchedule ? Math.round((completedToday / currentSchedule.length) * 100) : 0;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-clock me-2"></i>Time-Adaptive Learning Path</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={() => setShowCalendar(!showCalendar)}>
            <i className="bi bi-calendar3 me-2"></i>Calendar View
          </button>
          <span className="badge bg-warning align-self-center">
            <i className="bi bi-fire me-1"></i>{streak} Day Streak
          </span>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <motion.div className="card p-3 text-center h-100" style={{ backgroundColor: 'var(--primary)' }} whileHover={{ scale: 1.05 }}>
            <i className="bi bi-clock" style={{ fontSize: '2rem' }}></i>
            <h3 className="mb-0 mt-2">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</h3>
            <small>Today's Time</small>
          </motion.div>
        </div>
        <div className="col-md-3">
          <motion.div className="card p-3 text-center h-100" style={{ backgroundColor: 'var(--secondary)' }} whileHover={{ scale: 1.05 }}>
            <i className="bi bi-grid-3x3" style={{ fontSize: '2rem' }}></i>
            <h3 className="mb-0 mt-2">{currentSchedule?.length || 0}</h3>
            <small>Learning Blocks</small>
          </motion.div>
        </div>
        <div className="col-md-3">
          <motion.div className="card p-3 text-center h-100" style={{ backgroundColor: 'var(--accent-lavender)' }} whileHover={{ scale: 1.05 }}>
            <i className="bi bi-check-circle" style={{ fontSize: '2rem' }}></i>
            <h3 className="mb-0 mt-2">{completedToday}/{currentSchedule?.length || 0}</h3>
            <small>Completed</small>
          </motion.div>
        </div>
        <div className="col-md-3">
          <motion.div className="card p-3 text-center h-100" style={{ backgroundColor: 'var(--accent-vanilla)' }} whileHover={{ scale: 1.05 }}>
            <i className="bi bi-graph-up" style={{ fontSize: '2rem' }}></i>
            <h3 className="mb-0 mt-2">{progressPercent}%</h3>
            <small>Progress</small>
          </motion.div>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <div className="row align-items-center g-3">
          <div className="col-md-3">
            <h6 className="mb-2">Schedule Type</h6>
            <div className="btn-group w-100">
              <button className={`btn ${!isWeekend ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => { setIsWeekend(false); setSelectedDay('Monday'); }}>
                <i className="bi bi-briefcase me-1"></i>Weekday
              </button>
              <button className={`btn ${isWeekend ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => { setIsWeekend(true); setSelectedDay('Saturday'); }}>
                <i className="bi bi-house me-1"></i>Weekend
              </button>
            </div>
          </div>
          <div className="col-md-3">
            <h6 className="mb-2">Select Day</h6>
            <select className="form-select" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
              {days.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <h6 className="mb-2">Available Time: {timeAvailable} hours/day</h6>
            <input type="range" className="form-range" min="1" max="8" value={timeAvailable} onChange={(e) => setTimeAvailable(e.target.value)} />
            <div className="d-flex justify-content-between">
              <small className="text-muted">1h</small>
              <small className="text-muted">8h</small>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={selectedDay} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="card p-4 mb-4" style={{ background: `linear-gradient(135deg, ${currentSchedule?.[0]?.color || 'var(--primary)'} 0%, var(--secondary) 100%)` }}>
            <div className="text-white">
              <h4 className="mb-2">{selectedDay} Learning Schedule</h4>
              <div className="progress" style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.3)' }}>
                <div className="progress-bar bg-white" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <small className="mt-2 d-block">{completedToday} of {currentSchedule?.length} blocks completed</small>
            </div>
          </div>

          <div className="row g-3 mb-4">
            {currentSchedule?.map((block, i) => (
              <div key={i} className="col-md-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.03 }}>
                  <div className={`card p-4 h-100 ${isCompleted(selectedDay, i) ? 'border-success border-2' : ''}`}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="rounded-circle p-2" style={{ backgroundColor: block.color + '20' }}>
                        <i className={`${block.icon}`} style={{ fontSize: '1.5rem', color: block.color }}></i>
                      </div>
                      <span className={`badge ${block.type === 'Micro' ? 'bg-success' : block.type === 'Deep' ? 'bg-primary' : block.type === 'Project' ? 'bg-danger' : 'bg-warning'}`}>
                        {block.type}
                      </span>
                    </div>
                    <h6 className="mb-2">{block.lesson}</h6>
                    <div className="d-flex justify-content-between mb-3">
                      <small className="text-muted"><i className="bi bi-clock me-1"></i>{block.time}</small>
                      <small className="text-muted"><i className="bi bi-hourglass me-1"></i>{block.duration}</small>
                    </div>
                    {isCompleted(selectedDay, i) ? (
                      <button className="btn btn-success w-100" disabled>
                        <i className="bi bi-check-circle-fill me-2"></i>Completed
                      </button>
                    ) : (
                      <button className="btn btn-primary w-100" onClick={() => handleStartLearning(selectedDay, i, block)}>
                        <i className="bi bi-play-circle me-2"></i>Start Learning
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="card p-4">
            <h6 className="mb-3"><i className="bi bi-calendar-week me-2"></i>Weekly Overview</h6>
            <div className="row g-3">
              {[...weekdays, ...weekendDays].map((day, i) => {
                const daySchedule = weekdays.includes(day) ? weekdaySchedules[day] : weekendSchedules[day];
                const dayCompleted = daySchedule.filter((_, idx) => isCompleted(day, idx)).length;
                const dayPercent = Math.round((dayCompleted / daySchedule.length) * 100);
                
                return (
                  <div key={i} className="col" style={{ cursor: 'pointer' }} onClick={() => { setSelectedDay(day); setIsWeekend(weekendDays.includes(day)); }}>
                    <div className={`text-center p-3 rounded ${selectedDay === day ? 'bg-primary text-white' : 'bg-light'}`}>
                      <div className="mb-2">
                        <strong>{day.substring(0, 3)}</strong>
                      </div>
                      <div className="progress mb-2" style={{ height: '6px' }}>
                        <div className="progress-bar bg-success" style={{ width: `${dayPercent}%` }}></div>
                      </div>
                      <small>{dayCompleted}/{daySchedule.length}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4">
            <h6 className="mb-3"><i className="bi bi-bell me-2"></i>Upcoming Sessions</h6>
            {currentSchedule?.filter((_, i) => !isCompleted(selectedDay, i)).slice(0, 3).map((block, i) => (
              <div key={i} className="p-2 mb-2 rounded bg-light">
                <div className="d-flex justify-content-between">
                  <strong>{block.time}</strong>
                  <span className="badge bg-primary">{block.duration}</span>
                </div>
                <small className="text-muted">{block.lesson}</small>
              </div>
            ))}
            {currentSchedule?.every((_, i) => isCompleted(selectedDay, i)) && (
              <p className="text-success text-center">
                <i className="bi bi-check-circle-fill me-2"></i>
                All done for today! 🎉
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Learning Modal */}
      <AnimatePresence>
        {activeLearning && (
          <motion.div 
            className="modal show d-block" 
            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: activeLearning.block.color }}>
                  <div className="text-white">
                    <h5 className="modal-title">
                      <i className={`${activeLearning.block.icon} me-2`}></i>
                      {activeLearning.block.lesson}
                    </h5>
                    <small>Stage {currentStage + 1} of {currentStage < 5 ? '5' : '6 (Quiz)'}</small>
                  </div>
                  <button className="btn-close btn-close-white" onClick={() => setActiveLearning(null)}></button>
                </div>
                
                <div className="modal-body" style={{ minHeight: '300px' }}>
                  {currentStage < 5 ? (
                    <motion.div key={currentStage} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <div className="mb-3">
                        <div className="progress" style={{ height: '8px' }}>
                          <div className="progress-bar" style={{ width: `${((currentStage + 1) / 5) * 100}%`, backgroundColor: activeLearning.block.color }}></div>
                        </div>
                      </div>
                      <h4 className="mb-3">{activeLearning.block.stages[currentStage].title}</h4>
                      <p className="lead">{activeLearning.block.stages[currentStage].content}</p>
                      {activeLearning.block.link && currentStage === 0 && (
                        <a href={activeLearning.block.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                          <i className="bi bi-play-circle me-2"></i>Watch Video Tutorial
                        </a>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h4 className="mb-4">Quiz Time! 📝</h4>
                      {activeLearning.block.quiz.map((q, qIndex) => (
                        <div key={qIndex} className="mb-4 p-3 rounded bg-light">
                          <h6 className="mb-3">Q{qIndex + 1}. {q.question}</h6>
                          <div className="d-flex flex-column gap-2">
                            {q.options.map((option, oIndex) => (
                              <button
                                key={oIndex}
                                className={`btn text-start ${
                                  quizAnswers[qIndex] !== undefined
                                    ? oIndex === q.correct
                                      ? 'btn-success'
                                      : 'btn-outline-secondary'
                                    : 'btn-outline-primary'
                                }`}
                                onClick={() => handleQuizAnswer(qIndex, oIndex, oIndex === q.correct)}
                                disabled={quizAnswers[qIndex] !== undefined}
                              >
                                {option}
                                {quizAnswers[qIndex] !== undefined && oIndex === q.correct && (
                                  <i className="bi bi-check-circle-fill ms-2"></i>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
                
                <div className="modal-footer">
                  {currentStage < 5 ? (
                    <button className="btn btn-primary" onClick={handleNextStage}>
                      {currentStage < 4 ? 'Next Stage' : 'Take Quiz'} <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  ) : (
                    <button 
                      className="btn btn-success" 
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < activeLearning.block.quiz.length}
                    >
                      Submit Quiz <i className="bi bi-check-circle ms-2"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

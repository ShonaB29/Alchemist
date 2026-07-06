// Comprehensive Learning Schedules Data
// Enhanced with detailed content, code examples, and resources

export const LEARNING_TOPICS = {
  python: {
    name: 'Python Programming',
    icon: 'bi-code-slash',
    color: '#3776AB',
    difficulty: 'Beginner',
    estimatedHours: 40,
    prerequisites: [],
    skills: ['Variables & Types', 'Functions', 'OOP', 'Data Structures', 'File I/O'],
    careerPaths: ['Backend Developer', 'Data Scientist', 'ML Engineer', 'Automation Engineer']
  },
  javascript: {
    name: 'JavaScript',
    icon: 'bi-braces',
    color: '#F7DF1E',
    difficulty: 'Beginner',
    estimatedHours: 35,
    prerequisites: ['HTML', 'CSS'],
    skills: ['ES6+ Features', 'Async Programming', 'DOM Manipulation', 'APIs', 'Modules'],
    careerPaths: ['Frontend Developer', 'Full Stack Developer', 'Node.js Developer']
  },
  react: {
    name: 'React.js',
    icon: 'bi-layers',
    color: '#61DAFB',
    difficulty: 'Intermediate',
    estimatedHours: 30,
    prerequisites: ['JavaScript', 'HTML', 'CSS'],
    skills: ['Components', 'Hooks', 'State Management', 'Props', 'Context API', 'React Router'],
    careerPaths: ['Frontend Developer', 'Full Stack Developer', 'UI Engineer']
  },
  algorithms: {
    name: 'Algorithms & Data Structures',
    icon: 'bi-cpu',
    color: '#FF6B6B',
    difficulty: 'Intermediate',
    estimatedHours: 60,
    prerequisites: ['Programming Basics'],
    skills: ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Sorting', 'Dynamic Programming'],
    careerPaths: ['Software Engineer', 'Backend Developer', 'Systems Engineer']
  },
  sql: {
    name: 'SQL & Databases',
    icon: 'bi-database',
    color: '#F7B731',
    difficulty: 'Beginner',
    estimatedHours: 25,
    prerequisites: [],
    skills: ['SELECT Queries', 'Joins', 'Aggregations', 'Indexes', 'Query Optimization', 'Transactions'],
    careerPaths: ['Backend Developer', 'Data Analyst', 'Database Administrator', 'Full Stack Developer']
  },
  ml: {
    name: 'Machine Learning',
    icon: 'bi-robot',
    color: '#8E44AD',
    difficulty: 'Advanced',
    estimatedHours: 80,
    prerequisites: ['Python', 'Math', 'Statistics'],
    skills: ['Regression', 'Classification', 'Clustering', 'Neural Networks', 'Deep Learning', 'NLP'],
    careerPaths: ['ML Engineer', 'Data Scientist', 'AI Researcher', 'AI Engineer']
  },
  webdev: {
    name: 'Web Development',
    icon: 'bi-globe',
    color: '#5F27CD',
    difficulty: 'Beginner',
    estimatedHours: 45,
    prerequisites: [],
    skills: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox/Grid', 'JavaScript Basics'],
    careerPaths: ['Frontend Developer', 'Web Designer', 'Full Stack Developer']
  },
  nodejs: {
    name: 'Node.js & Backend',
    icon: 'bi-server',
    color: '#68A063',
    difficulty: 'Intermediate',
    estimatedHours: 40,
    prerequisites: ['JavaScript'],
    skills: ['Express.js', 'REST APIs', 'Authentication', 'Database Integration', 'Middleware'],
    careerPaths: ['Backend Developer', 'Full Stack Developer', 'API Developer']
  },
  devops: {
    name: 'DevOps & Cloud',
    icon: 'bi-cloud',
    color: '#FF9900',
    difficulty: 'Advanced',
    estimatedHours: 70,
    prerequisites: ['Linux', 'Networking'],
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS/Azure', 'Monitoring', 'Infrastructure as Code'],
    careerPaths: ['DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer']
  },
  testing: {
    name: 'Software Testing',
    icon: 'bi-bug',
    color: '#E67E22',
    difficulty: 'Intermediate',
    estimatedHours: 30,
    prerequisites: ['Programming Basics'],
    skills: ['Unit Testing', 'Integration Testing', 'E2E Testing', 'TDD', 'Test Automation'],
    careerPaths: ['QA Engineer', 'Test Automation Engineer', 'SDET']
  }
};

export const LEARNING_STATS = {
  totalTopics: Object.keys(LEARNING_TOPICS).length,
  totalHours: Object.values(LEARNING_TOPICS).reduce((sum, topic) => sum + topic.estimatedHours, 0),
  difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
  careerPaths: [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'ML Engineer',
    'DevOps Engineer',
    'Mobile Developer',
    'QA Engineer'
  ]
};

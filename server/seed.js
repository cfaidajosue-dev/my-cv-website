const Profile = require('./models/Profile');

async function seedProfile() {
  await Profile.deleteMany();
  const profile = new Profile({
    name: 'Cyiza Faida Josue',
    title: 'Full-Stack Software Development Student',
    about: "Hi! I'm Cyiza Faida Josue, a passionate and driven high school student in S5 specializing in Software Development. I'm committed to building innovative solutions through clean, efficient code. With a strong foundation in both frontend and backend technologies, I'm eager to tackle challenging projects and continuously expand my technical expertise. I believe in the power of technology to solve real-world problems and create meaningful impact.",
    email: 'cfaidajosue@gmail.com',
    location: 'Rwanda',
    github: 'https://github.com/cyizafaida',
    linkedin: 'https://linkedin.com/in/cyizafaida',
    skills: [
      { name: 'HTML5',          category: 'Frontend',     level: 85, description: 'Semantic HTML5 markup', experience: 'Built multiple responsive websites with proper semantic structure and accessibility standards.' },
      { name: 'CSS3',           category: 'Frontend',     level: 80, description: 'Modern CSS with animations', experience: 'Created responsive designs with Flexbox, Grid, and CSS animations. Experienced with dark mode and theme switching.' },
      { name: 'JavaScript',     category: 'Frontend',     level: 75, description: 'ES6+ and DOM manipulation', experience: 'Proficient in vanilla JavaScript, async/await, and DOM APIs. Built interactive web applications and animations.' },
      { name: 'React',          category: 'Frontend',     level: 70, description: 'Component-based UI library', experience: 'Experience with functional components, hooks, and state management. Built reusable component libraries.' },
      { name: 'Python',         category: 'Programming',  level: 80, description: 'General-purpose programming', experience: 'Strong foundation in Python for scripting, data analysis, and backend development. Familiar with popular libraries.' },
      { name: 'Node.js',        category: 'Backend',      level: 75, description: 'JavaScript runtime for servers', experience: 'Built RESTful APIs and server applications. Experienced with Express.js and middleware development.' },
      { name: 'Express.js',     category: 'Backend',      level: 72, description: 'Web application framework', experience: 'Created robust backend services with routing, middleware, and error handling. Implemented authentication systems.' },
      { name: 'MongoDB',        category: 'Database',     level: 70, description: 'NoSQL document database', experience: 'Designed and implemented MongoDB schemas. Experienced with aggregation pipelines and indexing.' },
      { name: 'SQL',            category: 'Database',     level: 68, description: 'Relational database queries', experience: 'Proficient in writing complex SQL queries, joins, and database optimization techniques.' },
      { name: 'Git & GitHub',   category: 'Tools',        level: 78, description: 'Version control system', experience: 'Daily use of Git for version control. Experienced with branching, merging, and collaborative workflows.' },
      { name: 'REST APIs',      category: 'Backend',      level: 72, description: 'API design and development', experience: 'Designed and implemented RESTful APIs following best practices. Experienced with API documentation and testing.' },
      { name: 'Responsive Design', category: 'Frontend',  level: 80, description: 'Mobile-first design approach', experience: 'Created fully responsive websites that work seamlessly across all devices and screen sizes.' }
    ],
    education: [
      {
        level: 'S5 — Current',
        field: 'Software Development',
        school: 'High School',
        status: 'In Progress',
        description: 'Advanced coursework in full-stack web development, database design, software architecture, and modern development practices. Currently building real-world applications with Node.js, Express, and MongoDB.'
      },
      {
        level: 'S4 — Completed',
        field: 'Software Development',
        school: 'High School',
        status: 'Completed',
        description: 'Completed foundational courses in programming fundamentals, object-oriented programming, web development basics, and computer science principles.'
      },
      {
        level: 'S3 — Completed',
        field: 'Computer Science',
        school: 'High School',
        status: 'Completed',
        description: 'Introduction to computer science, algorithms, data structures, and basic programming concepts.'
      }
    ],
    projects: [
      {
        title: 'Personal CV Website',
        description: 'A fully responsive personal portfolio website showcasing my skills, projects, and experience. Built with HTML5, CSS3, and vanilla JavaScript with a modern, clean design. Features include smooth animations, dark mode support, and mobile optimization.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
        link: 'http://localhost:3000'
      }
    ],
    interests: [
      {
        category: 'Music',
        items: ['Listening to diverse music genres', 'Exploring new artists', 'Music production', 'Concert experiences']
      },
      {
        category: 'Entertainment',
        items: ['Watching movies and series', 'Film analysis', 'Documentaries', 'Streaming platforms']
      },
      {
        category: 'Sports',
        items: ['Football/Soccer', 'Champions League Finals', 'FIFA World Cup', 'Sports analytics']
      },
      {
        category: 'Technology',
        items: ['Web development trends', 'Open source contributions', 'Tech conferences', 'Innovation and startups']
      },
      {
        category: 'Learning',
        items: ['Online courses', 'Technical blogs', 'Programming tutorials', 'Continuous skill development']
      },
      {
        category: 'Creative',
        items: ['UI/UX Design', 'Problem solving', 'Building side projects', 'Coding challenges']
      }
    ],
    family: [
      {
        name: 'Fayida Jean Bosco',
        relationship: 'Father',
        description: 'A supportive and inspiring figure who has encouraged me to pursue my passion for technology and software development. His guidance and wisdom have been instrumental in shaping my values and ambitions.'
      },
      {
        name: 'Manzifaidajosue',
        relationship: 'Brother',
        description: 'My brother who shares my passion for learning and growth. Together we explore new technologies and support each other in our respective journeys of personal and professional development.'
      }
    ]
  });

  await profile.save();
  console.log('✅ Profile seeded successfully');
}

module.exports = seedProfile;

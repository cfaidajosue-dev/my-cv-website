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
      { name: 'HTML5',          category: 'Frontend',     level: 85 },
      { name: 'CSS3',           category: 'Frontend',     level: 80 },
      { name: 'JavaScript',     category: 'Frontend',     level: 75 },
      { name: 'React',          category: 'Frontend',     level: 70 },
      { name: 'Python',         category: 'Programming',  level: 80 },
      { name: 'Node.js',        category: 'Backend',      level: 75 },
      { name: 'Express.js',     category: 'Backend',      level: 72 },
      { name: 'MongoDB',        category: 'Database',     level: 70 },
      { name: 'SQL',            category: 'Database',     level: 68 },
      { name: 'Git & GitHub',   category: 'Tools',        level: 78 },
      { name: 'REST APIs',      category: 'Backend',      level: 72 },
      { name: 'Responsive Design', category: 'Frontend',  level: 80 }
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

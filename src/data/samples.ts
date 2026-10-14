export interface SampleResume {
  id: string;
  title: string;
  role: string;
  content: string;
}

export interface SampleJobDescription {
  id: string;
  title: string;
  company: string;
  content: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'fresher-india',
    title: 'Aarav Sharma - Fresher (Indian Academic Standards)',
    role: 'B.Tech Graduate / Fresher (SIH Hackathon & CGPA 8.8)',
    content: `Aarav Sharma
aarav.sharma@email.com | +91 98765 43210
Bengaluru, Karnataka | linkedin.com/in/aarav-sharma | github.com/aarav-dev

OBJECTIVE
Passionate Computer Science graduate seeking a Software Development Engineer (SDE) or Data Analyst Internship. Solid foundation in Data Structures, Algorithms, Python, and Full-Stack Development with proven academic capstone projects and hackathon wins.

EDUCATION
B.Tech in Computer Science and Engineering
Vellore Institute of Technology (VIT), Vellore (2021 – 2025)
CGPA: 8.85 / 10.0 (Top 5% of cohort)
Relevant Coursework: Data Structures, Object-Oriented Programming, Database Management Systems, Operating Systems, Machine Learning

TECHNICAL SKILLS
Languages: Python, Java, C++, SQL, JavaScript, HTML5, CSS3
Frameworks & Libraries: React, Node.js, Express, Pandas, NumPy, Matplotlib, Tailwind CSS
Databases & Cloud: PostgreSQL, MongoDB, MySQL, Firebase, Git, GitHub
Tools: VS Code, Postman, PowerBI, Jupyter Notebook

ACADEMIC & CAPSTONE PROJECTS
• Smart Campus Facility Management System — React, Node.js, PostgreSQL
Designed and deployed a full-stack facility reservation portal utilized by 2,000+ campus students, reducing manual request backlogs by 65%. Implemented role-based authentication and real-time room availability status.
• AI Resume Keyword Matcher & Classifier — Python, Pandas, Scikit-Learn
Trained TF-IDF and Cosine Similarity models across 500+ job descriptions achieving 91% parsing accuracy. Built interactive Streamlit demo for student career cell mock interviews.
• Automated IoT Water Quality Prober — C++, Arduino, MQTT
Architected low-power IoT telemetry node tracking turbidity and pH levels with cloud dashboard alerts.

CO-CURRICULAR & ACHIEVEMENTS
• Winner (Top 10 National Finalist) — Smart India Hackathon (SIH 2024): Built an automated citizen grievance triage pipeline in a 36-hour sprint.
• Technical Lead — Google Developer Student Club (GDSC VIT): Conducted hands-on web development workshops for 150+ sophomore peers.
• Competitive Programming: Solved 350+ problems on LeetCode (Rating 1750+); 4-Star coder on CodeChef.
`,
  },
  {
    id: 'swe-fullstack',
    title: 'Alex Johnson - Full Stack Engineer',
    role: 'Experienced Full Stack Engineer (5+ Yrs)',
    content: `Alex Johnson
alex.johnson@email.com | +1 (555) 234-5678
San Francisco, CA | linkedin.com/in/alexjohnson-dev | github.com/alexj-code

PROFESSIONAL SUMMARY
Senior Full-Stack Engineer with 5+ years of experience designing and deploying high-scale web applications. Proficient in React, TypeScript, Node.js, and AWS cloud architecture. Passionate about automated testing, microservices, and optimizing API latency.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML, CSS
Frameworks: React, Next.js, Node.js, Express, Tailwind CSS, FastAPI
Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, Kubernetes, Git, CI/CD, GitHub Actions
Databases: PostgreSQL, MongoDB, Redis

EXPERIENCE
Senior Software Engineer — TechNova Solutions (Mar 2022 – Present)
• Architected and shipped a customer dashboard using React, TypeScript, and Tailwind, serving 45,000+ active monthly users.
• Reduced API response times by 42% through Redis caching and PostgreSQL query optimization.
• Automated deployment pipelines with GitHub Actions and Docker, cutting deployment cycle from 45 minutes to 8 minutes.
• Mentored 4 junior engineers on unit testing and clean code principles.

Full Stack Developer — CloudScale Inc. (Jun 2019 – Feb 2022)
• Developed responsive user interfaces with React and Redux, improving user retention by 28%.
• Engineered REST APIs with Node.js and Express handling 12,000 requests per minute with 99.9% uptime.
• Integrated Stripe payment checkout system, processing over $2.5M in transaction volume annually.
• Collaborated in an agile scrum team of 8 engineers across 2-week sprint cycles.

PROJECTS
• Real-Time Collaborative Whiteboard — React, WebSockets, Node.js, Redis
Built a multiplayer whiteboard application supporting real-time cursor sync for up to 50 concurrent users. Implemented canvas drawing algorithms and deployed to AWS.
• E-Commerce Inventory Microservice — FastAPI, PostgreSQL, Docker
Engineered an event-driven inventory service with automated order reconciliation, handling 1,500+ order events daily.

EDUCATION
B.S. in Computer Science — University of California, Berkeley (2015 – 2019)
GPA: 3.8/4.0 | Dean's Honor List
`,
  },
  {
    id: 'junior-dev',
    title: 'Sam Rivera - Junior Developer',
    role: 'Junior Developer (Needs Improvements)',
    content: `Sam Rivera
sam.rivera@email.com
142 Elm Street, Apt 3B, Austin, TX 78701
github.com/samrivera

SKILLS
Python, JavaScript, React, HTML, CSS, Git, MongoDB, Django, Docker, Machine Learning, AWS, Linux

EXPERIENCE
Web Developer Intern — Apex Systems (Summer 2024)
Responsible for helping build frontend screens. Worked with senior engineers on web pages.
Assisted in bug fixing and testing features. Participated in team standups.

EDUCATION
B.S. in Information Technology — Texas State University (2020 – 2024)
`,
  },
];

export const SAMPLE_JOB_DESCRIPTIONS: SampleJobDescription[] = [
  {
    id: 'jd-fullstack',
    title: 'Software Development Engineer / Intern (React & Python)',
    company: 'NextGen Cloud',
    content: `Job Title: Software Development Engineer (SDE)
Company: NextGen Cloud
Location: Bengaluru / Remote

About the Role:
We are looking for a proactive Software Engineer to build scalable web applications and data services. You will collaborate with engineering leads to deliver robust features.

Requirements:
• Strong programming fundamentals in Python, JavaScript, or Java.
• Hands-on experience with modern frontend frameworks like React.
• Practical knowledge of relational databases such as PostgreSQL or MySQL.
• Experience building or consuming REST APIs.
• Good grasp of Data Structures, Algorithms, and Object-Oriented design.
• Familiarity with Git version control and collaborative workflows.

Preferred Qualifications:
• Participation in coding hackathons or open-source repositories.
• Familiarity with Docker, Cloud computing (AWS/GCP), or CI/CD.
• Strong written and verbal communication skills.
`,
  },
];

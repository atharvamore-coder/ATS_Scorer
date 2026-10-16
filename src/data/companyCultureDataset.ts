import { CompanyCultureProfile } from '../types/ats';

export const COMPANY_CULTURE_DATASET: CompanyCultureProfile[] = [
  {
    id: 'nextgen-cloud',
    name: 'NextGen Cloud',
    logo_initials: 'NC',
    theme_color: 'indigo',
    domain: 'Cloud Platforms & Developer Tools',
    category: 'High-Growth',
    location_mode: 'Hybrid (2-3 days)',
    headquarters: 'Bengaluru / San Francisco',
    team_size: '250 - 500 team members',
    mission:
      'Building next-generation cloud infrastructure and microservices tools that make software deployment effortless for engineering teams worldwide.',
    work_life_balance: {
      rating: 4.5,
      status_label: 'Great Work-Life Balance',
      typical_hours: '40 hours / week (Mon–Fri, 10:00 AM – 6:00 PM)',
      weekend_policy: 'Strict no-weekend work policy; Slack notifications auto-muted after 7 PM.',
      flexibility_perks: 'Flexible core hours (11 AM – 4 PM), work from anywhere 4 weeks a year, mental wellness recharge days.',
      stress_level: 'Balanced & Predictable',
    },
    work_style:
      'Collaborative, engineering-led team with 2-week agile sprints. Teams keep meetings minimal (< 4 hours a week) so engineers can focus on uninterrupted deep coding and building features.',
    core_values: [
      {
        name: 'Proactive Ownership',
        plain_meaning: 'Taking responsibility for your projects from start to finish without waiting for someone to tell you what to do.',
        what_recruiters_look_for: 'Stories about spotting a bug or improvement on your own and building the solution.',
      },
      {
        name: 'Customer Empathy',
        plain_meaning: 'Building software that solves real user headaches, not just writing code for the sake of code.',
        what_recruiters_look_for: 'Explaining who used your college capstone or project and how it made their work easier.',
      },
      {
        name: 'Open Collaboration',
        plain_meaning: 'Pair programming, friendly code reviews, and helping teammates when they get stuck.',
        what_recruiters_look_for: 'How you worked in team hackathons, academic groups, or club technical teams.',
      },
      {
        name: 'Continuous Learning',
        plain_meaning: 'Curiosity to learn new languages, frameworks, and modern cloud technologies.',
        what_recruiters_look_for: 'Self-taught tools, side projects, or certifications you completed outside of required coursework.',
      },
    ],
    perks: [
      'Comprehensive health insurance for self and family',
      '$1,200 annual learning stipend for courses and certifications',
      'Ergonomic home office setup allowance ($600)',
      'Flexible work-from-home options with catered campus lunches',
      'Regular team hackathons with prototype prize funding',
      'Dedicated mentor paired with every new joiner and intern',
    ],
    interview_tips: [
      'Highlight real projects where you used Python, React, or cloud services, explaining why you chose those tools.',
      'Mention any team hackathon (like Smart India Hackathon or college hack nights) to prove your collaboration speed.',
      'Show that you know how to break down an ambiguous task into clean, testable steps.',
      'Prepare 1 question about how their engineering team organizes code reviews and CI/CD pipelines.',
    ],
    sample_interview_questions: [
      'Tell me about a project where you had to learn a new framework or technology quickly on your own.',
      'Describe a situation in a team project where you disagreed with a teammate and how you resolved it amicably.',
      'How do you balance writing fast working prototypes with making sure your code is clean and reliable?',
    ],
    target_keywords: [
      'react', 'python', 'cloud', 'postgresql', 'apis', 'hackathon', 'team', 'deployed', 'testing', 'full-stack',
    ],
  },
  {
    id: 'google',
    name: 'Google',
    logo_initials: 'G',
    theme_color: 'blue',
    domain: 'Planetary Scale & AI Systems',
    category: 'Big Tech',
    location_mode: 'Hybrid (2-3 days)',
    headquarters: 'Mountain View, CA / Bengaluru & Hyderabad',
    team_size: '180,000+ Googlers',
    mission:
      'Organize the world’s information and make it universally accessible and useful for billions of people.',
    work_life_balance: {
      rating: 4.6,
      status_label: 'Exceptional Work-Life Balance',
      typical_hours: '40 hours / week (Mon–Fri, flexible arrival times)',
      weekend_policy: 'Strictly protected weekends; strong corporate culture against after-hours work communications.',
      flexibility_perks: 'Generous paid time off, 20% innovation time, paternity/maternity leave up to 24 weeks, on-site wellness centers.',
      stress_level: 'Low / Very Sustainable',
    },
    work_style:
      'Consensus-driven and research-oriented. High emphasis on written design documents (RFCs), peer code reviews, blameless post-mortems, and building systems that reliably handle millions of requests without breaking.',
    core_values: [
      {
        name: 'Googliness & Respect',
        plain_meaning: 'Being humble, doing the right thing for users, and treating everyone with respect and kindness.',
        what_recruiters_look_for: 'How you navigate feedback, support diverse teammates, and put community welfare first.',
      },
      {
        name: 'Planetary Scalability',
        plain_meaning: 'Thinking about what happens when millions or billions of people use your software simultaneously.',
        what_recruiters_look_for: 'Knowledge of efficiency, algorithmic time complexity, and data structures.',
      },
      {
        name: 'Data-Driven Decisions',
        plain_meaning: 'Backing up decisions with facts, benchmarks, and metrics rather than just opinions.',
        what_recruiters_look_for: 'Adding numbers and metrics to your resume (e.g. reduced load time by 30%, handled 5,000 records).',
      },
      {
        name: 'Blameless Learning',
        plain_meaning: 'Viewing mistakes as learning opportunities to make systems stronger, rather than pointing fingers.',
        what_recruiters_look_for: 'A time you broke something or failed a test, learned the root cause, and put a preventative test in place.',
      },
    ],
    perks: [
      'World-famous free campus gourmet meals and micro-kitchens',
      '20% project time to experiment with new ideas and open-source software',
      'On-site medical centers, massage therapy, and fitness classes',
      'Extensive parental leave with child bonding stipends',
      'Full tuition reimbursement and internal Google Tech University courses',
      'Complete 401(k) / Provident Fund matching and equity grants',
    ],
    interview_tips: [
      'Master Data Structures & Algorithms: clearly articulate your thought process out loud before writing any code.',
      'Frame answers using the STAR method (Situation, Task, Action, Result) with specific quantifiable outcomes.',
      'Demonstrate Googliness by sharing how you helped peer students or contributed to open communities like GDSC.',
      'Show intellectual humility: if you make a mistake on the whiteboard or live coding, smile, adapt, and refine.',
    ],
    sample_interview_questions: [
      'Walk me through a time when you received tough feedback on your code. How did you react and what did you change?',
      'If you noticed a project was failing to meet its performance goal, how would you systematically diagnose the problem?',
      'Tell me about an initiative you led outside of your official coursework or assignments.',
    ],
    target_keywords: [
      'algorithms', 'data structures', 'scalability', 'leetcode', 'metrics', 'benchmarked', 'gdsc', 'mentored', 'clean code',
    ],
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo_initials: 'MS',
    theme_color: 'sky',
    domain: 'Enterprise Cloud, Productivity & AI',
    category: 'Big Tech',
    location_mode: 'Hybrid (2-3 days)',
    headquarters: 'Redmond, WA / Bengaluru, Hyderabad & Noida',
    team_size: '220,000+ employees',
    mission:
      'Empower every person and every organization on the planet to achieve more.',
    work_life_balance: {
      rating: 4.7,
      status_label: 'Industry-Leading Work-Life Balance',
      typical_hours: '38 - 40 hours / week (Predictable schedule with high personal flexibility)',
      weekend_policy: 'Strong boundary culture; weekend work is actively discouraged by team managers.',
      flexibility_perks: 'Work from home flexibility, annual wellness allowance ($1,500), subsidized childcare, paid volunteer time off.',
      stress_level: 'Low / Very Sustainable',
    },
    work_style:
      'Growth mindset culture focused on empathy, customer trust, and steady cross-team engineering. High stability with predictable release cycles and extensive engineering guardrails.',
    core_values: [
      {
        name: 'Growth Mindset',
        plain_meaning: 'Believing that skills and intelligence can be developed through dedication and hard work (be a "learn-it-all", not a "know-it-all").',
        what_recruiters_look_for: 'How you bounce back from setbacks, learn new tech stacks, and seek out challenges.',
      },
      {
        name: 'Customer Obsession & Empathy',
        plain_meaning: 'Listening deeply to understand what users need and delivering software that makes their daily work seamless.',
        what_recruiters_look_for: 'Designing accessible, inclusive interfaces that anyone can use easily.',
      },
      {
        name: 'Diverse & Inclusive Collaboration',
        plain_meaning: 'Welcoming different perspectives and helping everyone on the team feel valued.',
        what_recruiters_look_for: 'Examples of collaborating across different departments or study disciplines.',
      },
      {
        name: 'One Microsoft (Shared Leverage)',
        plain_meaning: 'Reusing components and collaborating across teams instead of reinventing the wheel in isolation.',
        what_recruiters_look_for: 'Using established open-source libraries, frameworks, and design systems.',
      },
    ],
    perks: [
      '$1,500 annual "Stay Fit" wellness reimbursement for gym, hobbies, or equipment',
      'Subsidized transport and commuter shuttles across campuses',
      'Comprehensive medical coverage including mental health and dental care',
      'Global hackathon week (one of the largest private company hackathons in the world)',
      'Subsidized software, hardware discounts, and Xbox Game Pass memberships',
      'Flexible hybrid schedules with manager agreement',
    ],
    interview_tips: [
      'Emphasize your "Growth Mindset": talk about a topic you found difficult at first and how you practiced until you mastered it.',
      'Show that you understand software testing and writing unit tests to protect enterprise users.',
      'Mention accessibility (like WCAG standards or keyboard navigation) if you built web apps.',
      'Ask thoughtful questions about their cloud (Azure) or AI initiatives.',
    ],
    sample_interview_questions: [
      'Tell me about a time you had to learn a technology from scratch with very little documentation.',
      'How do you ensure the applications you build are accessible and intuitive for people with different abilities?',
      'Give an example of a project where you partnered with non-technical peers or clients.',
    ],
    target_keywords: [
      'azure', 'typescript', 'react', 'growth mindset', 'accessible', 'collaboration', 'unit tests', 'inclusive', 'sql',
    ],
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo_initials: 'AMZ',
    theme_color: 'amber',
    domain: 'E-Commerce, AWS Cloud & Logistics',
    category: 'Big Tech',
    location_mode: 'In-Office Flexible',
    headquarters: 'Seattle, WA / Hyderabad & Bengaluru',
    team_size: '1.5M+ employees worldwide',
    mission:
      'To be Earth’s most customer-centric company, where customers can find and discover anything they might want to buy online.',
    work_life_balance: {
      rating: 3.8,
      status_label: 'Fast-Paced Sprint Culture',
      typical_hours: '42 - 48 hours / week (Varies during peak sales and major release cycles)',
      weekend_policy: 'Occasional on-call rotations for production systems; rotational compensatory time off.',
      flexibility_perks: 'Structured career growth ladders, internal role transfers, generous stock vesting.',
      stress_level: 'Dynamic / Sprint-Driven',
    },
    work_style:
      'High-velocity, results-driven engineering. Decisions are made through 6-page written narrative documents instead of PowerPoint slides. Engineers own their microservices from development to production monitoring (You build it, you run it).',
    core_values: [
      {
        name: 'Customer Obsession',
        plain_meaning: 'Starting with the customer and working backwards, putting their satisfaction above all else.',
        what_recruiters_look_for: 'Clear examples where customer feedback directly shaped your application features.',
      },
      {
        name: 'Bias for Action',
        plain_meaning: 'Speed matters in business. Taking calculated risks rather than waiting for endless consensus.',
        what_recruiters_look_for: 'How fast you built and shipped an MVP or working prototype under tight deadlines.',
      },
      {
        name: 'Ownership & Accountability',
        plain_meaning: 'Leaders never say "that’s not my job." Thinking long-term and fixing broken things proactively.',
        what_recruiters_look_for: 'Taking responsibility when a project failed or resolving a problem outside your assignment.',
      },
      {
        name: 'Frugality & Delivering Results',
        plain_meaning: 'Accomplishing more with less resource waste and delivering measurable business outcomes.',
        what_recruiters_look_for: 'Optimizing database queries, reducing hosting costs, or writing lightweight code.',
      },
    ],
    perks: [
      'Amazon Restricted Stock Units (RSUs) with high upside potential',
      'Comprehensive healthcare coverage from day one of employment',
      'Career Choice educational assistance programs',
      'Employee discounts across Amazon retail platforms',
      'Internal Mobility: ability to transfer between AWS, Prime Video, and Alexa teams easily',
      'Extensive leadership and operational excellence bootcamps',
    ],
    interview_tips: [
      'Memorize Amazon’s 16 Leadership Principles and have 2 STAR stories prepared for each principle.',
      'Always include measurable numbers in your answers (e.g. "improved speed by 25%", "processed 10k items").',
      'Avoid passive answers like "we did this" — Amazon interviewers want to hear specifically what "I" did.',
      'Show how you prioritize tasks when you have limited time and competing deadlines.',
    ],
    sample_interview_questions: [
      'Tell me about a time you took a calculated risk and made a decision with incomplete information.',
      'Describe a time you saw a problem that was not your direct responsibility and chose to fix it anyway.',
      'Give an example of a time you simplified a complex system to deliver working results faster.',
    ],
    target_keywords: [
      'aws', 'leadership principles', 'bias for action', 'ownership', 'customer obsession', 'frugality', 'metrics', 'mvp',
    ],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo_initials: 'S',
    theme_color: 'purple',
    domain: 'Financial Infrastructure & Internet Commerce',
    category: 'High-Growth',
    location_mode: 'Remote-First',
    headquarters: 'San Francisco & Dublin / Global Remote Hubs',
    team_size: '7,000+ Stripers',
    mission:
      'Increase the GDP of the internet by building economic infrastructure that enables companies to accept payments and manage finances.',
    work_life_balance: {
      rating: 4.3,
      status_label: 'Balanced Async Culture',
      typical_hours: '40 hours / week (Self-managed schedule with high trust)',
      weekend_policy: 'Weekends are completely off; asynchronous written updates eliminate urgent late-night calls.',
      flexibility_perks: 'Work from anywhere in your designated country, home office stipend ($1,000), monthly wellness allowance ($300).',
      stress_level: 'Balanced & Predictable',
    },
    work_style:
      'Written-first culture. Decisions, proposals, and code architecture are written in concise documents. High standards for developer craftsmanship, API elegance, and clear documentation.',
    core_values: [
      {
        name: 'Macro Optimism, Micro Ambition',
        plain_meaning: 'Believing the internet economy has huge potential, while executing today’s tasks with meticulous care.',
        what_recruiters_look_for: 'Care for small details like clean API error messages and intuitive variable names.',
      },
      {
        name: 'Clear Written Communication',
        plain_meaning: 'Explaining complex technical ideas in simple, well-structured sentences that anyone can read asynchronously.',
        what_recruiters_look_for: 'Well-written project READMEs, clear commits, and clean code comments.',
      },
      {
        name: 'Deep Craftsmanship',
        plain_meaning: 'Taking pride in building software that is elegant, durable, and reliable for financial transactions.',
        what_recruiters_look_for: 'Writing automated tests and handling edge cases like network drops or invalid inputs.',
      },
      {
        name: 'Move with Urgency',
        plain_meaning: 'Polishing details quickly without getting paralyzed by perfectionism.',
        what_recruiters_look_for: 'Delivering incremental updates rather than waiting months to ship one big release.',
      },
    ],
    perks: [
      'Competitive remote salary benchmarks regardless of city tiers',
      '$1,000 home office setup budget and top-of-the-line MacBooks',
      '$300 monthly wellness and fitness stipend',
      'Generous parental leave and comprehensive healthcare plans',
      'Annual in-person team offsites in beautiful global destinations',
      'Learning & development book allowance with no spending cap',
    ],
    interview_tips: [
      'Focus heavily on code readability, naming conventions, and edge-case validation during live coding.',
      'Explain your thought process with calm, clear logic — Stripe values written and verbal clarity above rush.',
      'Show your GitHub profile or personal projects that have clean README files and automated tests.',
      'Be ready to discuss API design principles (like idempotency and meaningful HTTP status codes).',
    ],
    sample_interview_questions: [
      'Walk me through an API or function you designed. How did you make sure it was easy for other developers to use?',
      'Tell me about a time you spotted an edge-case bug before it reached production. How did you catch it?',
      'How do you keep yourself organized and accountable when working remotely or autonomously?',
    ],
    target_keywords: [
      'api', 'documentation', 'clean code', 'async', 'remote', 'craftsmanship', 'tests', 'financial', 'readme',
    ],
  },
  {
    id: 'tcs-infosys',
    name: 'TCS & Global IT Services',
    logo_initials: 'IT',
    theme_color: 'emerald',
    domain: 'Enterprise Transformation & Consulting',
    category: 'Enterprise',
    location_mode: 'Hybrid (2-3 days)',
    headquarters: 'Mumbai & Bengaluru / Global Delivery Centers',
    team_size: '600,000+ professionals',
    mission:
      'Partnering with the world’s leading enterprises to build resilient digital systems, cloud migrations, and scalable enterprise applications.',
    work_life_balance: {
      rating: 4.4,
      status_label: 'Stable & Structured Balance',
      typical_hours: '40 - 45 hours / week (Standard 9-hour shift including breaks)',
      weekend_policy: 'Standard 5-day work week; weekends are free with no client contact outside of rostered operations.',
      flexibility_perks: 'Comprehensive job security, campus transport facilities, corporate insurance, structured leave allowances.',
      stress_level: 'Balanced & Predictable',
    },
    work_style:
      'Structured enterprise processes (ITIL, Agile Scrum, ISO standards). Great foundation for freshers with world-renowned initial learning programs (ILP), clear hierarchies, and multi-year project stability.',
    core_values: [
      {
        name: 'Process Rigor & Reliability',
        plain_meaning: 'Following standard coding standards, verification checklists, and client documentation strictly.',
        what_recruiters_look_for: 'Discipline in version control, testing methodologies, and requirement adherence.',
      },
      {
        name: 'Integrity & Client Trust',
        plain_meaning: 'Protecting client data, honoring deadlines, and maintaining professional corporate ethics.',
        what_recruiters_look_for: 'Professional attitude, academic consistency, and clear communication skills.',
      },
      {
        name: 'Continuous Upskilling',
        plain_meaning: 'Earning certifications in cloud, full-stack, and AI through company learning portals.',
        what_recruiters_look_for: 'Academic certifications, coursework excellence, and willingness to learn new domains.',
      },
      {
        name: 'Team Cohesion',
        plain_meaning: 'Working harmoniously within structured delivery teams to deliver client milestones.',
        what_recruiters_look_for: 'Respect for team hierarchy, prompt status reporting, and positive collaboration.',
      },
    ],
    perks: [
      'World-class Initial Learning Program (ILP) with paid training for freshers',
      'Extensive corporate health insurance covering parents and dependents',
      'Company transport / bus services across major IT parks and tech hubs',
      'High job stability and clear annual promotion cycles',
      'Higher education sponsorship (like executive M.Tech or MBA programs)',
      'Subsidized corporate cafeteria meals and recreational facilities',
    ],
    interview_tips: [
      'Brush up on core Computer Science fundamentals: OOP concepts, DBMS / SQL queries, and basic DSA.',
      'Maintain clear, polite, and confident communication throughout the Technical and HR rounds.',
      'Highlight academic projects with clean documentation and database design.',
      'Show enthusiasm for learning whatever technology stack or cloud client the company assigns you to.',
    ],
    sample_interview_questions: [
      'Explain the four pillars of Object-Oriented Programming with real-world examples.',
      'How would you manage your time if you had to balance client project deliverables with training assessments?',
      'Are you open to working with different technologies and adapting to client project requirements?',
    ],
    target_keywords: [
      'java', 'sql', 'dbms', 'oop', 'python', 'certifications', 'teamwork', 'documentation', 'fresher', 'b.tech',
    ],
  },
  {
    id: 'swiggy-zomato',
    name: 'Swiggy & Consumer Tech',
    logo_initials: 'SW',
    theme_color: 'rose',
    domain: 'Hyper-Local Delivery & Real-Time Commerce',
    category: 'Fast Startup',
    location_mode: 'Remote-First',
    headquarters: 'Bengaluru / Gurugram',
    team_size: '6,000+ employees',
    mission:
      'Delivering unparalleled convenience to urban consumers by connecting them with local food, groceries, and instant commerce in minutes.',
    work_life_balance: {
      rating: 4.1,
      status_label: 'High-Energy Sprint Culture',
      typical_hours: '40 - 45 hours / week with high day-to-day flexibility',
      weekend_policy: 'Flexible time off; occasional weekend support during national festival sales or app launches.',
      flexibility_perks: 'Remote-first policy with quarterly team meetups, food meal vouchers, generous sick & mental health leave.',
      stress_level: 'Dynamic / Sprint-Driven',
    },
    work_style:
      'Fast-paced, product-first environment. Engineers work in nimble squads with product managers and UX designers. Features go from sketch to real-world app deployment in weeks, testing live user engagement immediately.',
    core_values: [
      {
        name: 'Customer Delight in Minutes',
        plain_meaning: 'Obsessing over milliseconds in app response time and delivering delightful, friction-free consumer experiences.',
        what_recruiters_look_for: 'Speed of mobile/web interfaces, caching, and clean user experience.',
      },
      {
        name: 'Scrappy Innovation',
        plain_meaning: 'Finding creative ways to solve hard technical problems fast with limited resources.',
        what_recruiters_look_for: 'Side projects, college hackathon apps, or building tools that your friends actually used.',
      },
      {
        name: 'Data-Driven Experimentation',
        plain_meaning: 'A/B testing features with real users and letting metrics guide product decisions.',
        what_recruiters_look_for: 'Experience with analytics, user feedback, or conversion metrics.',
      },
      {
        name: 'Extreme Ownership & Speed',
        plain_meaning: 'Deploying working code without waiting for lengthy sign-offs, and monitoring live telemetry.',
        what_recruiters_look_for: 'Hands-on full-stack development experience from frontend to backend deployment.',
      },
    ],
    perks: [
      'Remote-first work flexibility with home office reimbursement',
      'Daily food delivery credits and grocery discount vouchers',
      'Generous parental leave and comprehensive family health cover',
      'Rapid internal promotion tracks for high-performing individual contributors',
      'Regular product hackathons with leadership mentorship',
      'Full mental wellness sessions and confidential counseling support',
    ],
    interview_tips: [
      'Focus on full-stack responsiveness: explain how you optimize React state, API payload sizes, and mobile viewports.',
      'Share a project where you solved a real problem in your college, city, or community.',
      'Show that you understand how real-time services work (like WebSockets, status polling, or caching).',
      'Be energetic and show passion for consumer apps that touch everyday lives.',
    ],
    sample_interview_questions: [
      'How would you design a real-time order tracking status component in React?',
      'Tell me about a time you optimized a website or query that was loading too slowly.',
      'How do you prioritize between fixing technical debt and shipping a new user-facing feature quickly?',
    ],
    target_keywords: [
      'react', 'real-time', 'full-stack', 'websockets', 'performance', 'mobile', 'hackathon', 'fast', 'caching',
    ],
  },
  {
    id: 'meta',
    name: 'Meta',
    logo_initials: 'M',
    theme_color: 'indigo',
    domain: 'Social Tech, AI & Open Source',
    category: 'Big Tech',
    location_mode: 'Hybrid (2-3 days)',
    headquarters: 'Menlo Park, CA / Bengaluru & Hyderabad',
    team_size: '67,000+ employees',
    mission:
      'Give people the power to build community and bring the world closer together.',
    work_life_balance: {
      rating: 4.2,
      status_label: 'Balanced High-Impact Culture',
      typical_hours: '40 hours / week (High autonomy over when and where you work)',
      weekend_policy: 'Strictly respected weekends; asynchronous Workplace groups keep communication clear.',
      flexibility_perks: 'Work from home flexibility, $3,000 annual wellness perk, 30-day work-from-anywhere perk globally.',
      stress_level: 'Balanced & Predictable',
    },
    work_style:
      'High autonomy with the famous "Move Fast" ethos. Engineers can ship code to billions of users starting within their first few weeks. Heavy investment in open-source libraries (React, PyTorch, Llama).',
    core_values: [
      {
        name: 'Move Fast & Ship Boldly',
        plain_meaning: 'Building and iterating quickly to learn from real feedback rather than hesitating.',
        what_recruiters_look_for: 'Fast prototyping, releasing MVP features, and rapid iteration loops.',
      },
      {
        name: 'Focus on Long-Term Impact',
        plain_meaning: 'Solving the most important problem that will move the needle, rather than busywork.',
        what_recruiters_look_for: 'Explaining why a project was important and who benefited most from it.',
      },
      {
        name: 'Be Open & Direct',
        plain_meaning: 'Sharing code openly, giving constructive direct feedback, and communicating transparently.',
        what_recruiters_look_for: 'Experience with open-source tools (like React, Git) and team code reviews.',
      },
      {
        name: 'Build Awesome Things',
        plain_meaning: 'Taking pride in consumer-facing polish and smooth interaction design.',
        what_recruiters_look_for: 'Attention to responsive design, smooth UI animations, and clean components.',
      },
    ],
    perks: [
      'Creator of React, PyTorch, and Llama — work with world leaders in open source',
      '$3,000 annual lifestyle stipend for personal development and wellness',
      'Free campus gourmet meals, snacks, and specialty coffee bars',
      'Comprehensive 4-week engineer onboarding bootcamp with hands-on mentors',
      'Generous fertility, family planning, and parental leave benefits',
      'High-tier equity grants (RSUs) with quarterly vesting',
    ],
    interview_tips: [
      'Master React fundamentals if applying for frontend: hooks, performance re-renders, component modularity.',
      'Practice coding clean solutions fast: Meta interviews test problem-solving speed and bug-free implementation.',
      'Talk about open-source projects or libraries you have used or contributed to.',
      'Show confidence in taking ownership of a feature from UI to backend integration.',
    ],
    sample_interview_questions: [
      'Walk me through how you optimize the rendering performance of a large list in React.',
      'Tell me about a time you had to pivot a project direction because user feedback was different than expected.',
      'How do you approach testing when you need to deploy a feature quickly?',
    ],
    target_keywords: [
      'react', 'open source', 'move fast', 'ui', 'performance', 'components', 'typescript', 'impact', 'mvp',
    ],
  },
];

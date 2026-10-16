import { SkillRoadmap, SkillWorkaround } from '../types/ats';

// Map of related technologies: key -> [array of adjacent technologies]
export const SKILL_ADJACENCY_MAP: Record<string, { adjacent: string[]; domain: string }> = {
  tableau: { adjacent: ['powerbi', 'looker', 'metabase', 'excel', 'data studio'], domain: 'Data Visualization' },
  powerbi: { adjacent: ['tableau', 'looker', 'metabase', 'excel', 'dax'], domain: 'Data Visualization' },
  react: { adjacent: ['vue', 'angular', 'next.js', 'svelte', 'javascript'], domain: 'Frontend Frameworks' },
  vue: { adjacent: ['react', 'angular', 'svelte', 'javascript'], domain: 'Frontend Frameworks' },
  angular: { adjacent: ['react', 'vue', 'typescript', 'rxjs'], domain: 'Frontend Frameworks' },
  aws: { adjacent: ['gcp', 'azure', 'cloud computing', 'docker', 'terraform'], domain: 'Cloud Infrastructure' },
  gcp: { adjacent: ['aws', 'azure', 'google cloud', 'kubernetes'], domain: 'Cloud Infrastructure' },
  azure: { adjacent: ['aws', 'gcp', 'active directory', 'devops'], domain: 'Cloud Infrastructure' },
  docker: { adjacent: ['kubernetes', 'containerization', 'ci/cd', 'linux'], domain: 'DevOps & Containers' },
  kubernetes: { adjacent: ['docker', 'k8s', 'helm', 'cloud computing'], domain: 'DevOps & Containers' },
  fastapi: { adjacent: ['flask', 'django', 'express', 'rest api', 'python'], domain: 'Backend Web APIs' },
  django: { adjacent: ['flask', 'fastapi', 'spring boot', 'express', 'sql'], domain: 'Backend Frameworks' },
  flask: { adjacent: ['fastapi', 'django', 'express', 'rest api'], domain: 'Backend Frameworks' },
  postgresql: { adjacent: ['mysql', 'sqlite', 'mongodb', 'sql', 'oracle'], domain: 'Relational Databases' },
  mysql: { adjacent: ['postgresql', 'sqlite', 'sql', 'mariadb'], domain: 'Relational Databases' },
  mongodb: { adjacent: ['postgresql', 'redis', 'nosql', 'firebase', 'dynamodb'], domain: 'NoSQL Databases' },
  pytorch: { adjacent: ['tensorflow', 'keras', 'scikit-learn', 'deep learning'], domain: 'Machine Learning' },
  tensorflow: { adjacent: ['pytorch', 'keras', 'scikit-learn', 'machine learning'], domain: 'Machine Learning' },
  'scikit-learn': { adjacent: ['pandas', 'numpy', 'machine learning', 'python'], domain: 'Data Science' },
  pandas: { adjacent: ['numpy', 'sql', 'excel', 'pyspark'], domain: 'Data Manipulation' },
  figma: { adjacent: ['adobe xd', 'sketch', 'canva', 'ui/ux'], domain: 'Product Design' },
  jira: { adjacent: ['trello', 'linear', 'asana', 'agile', 'scrum'], domain: 'Project Management' },
  'github actions': { adjacent: ['jenkins', 'gitlab ci', 'circleci', 'ci/cd'], domain: 'CI/CD Pipelines' },
  jenkins: { adjacent: ['github actions', 'gitlab ci', 'docker', 'devops'], domain: 'CI/CD Automation' },
  graphql: { adjacent: ['rest api', 'apollo', 'json', 'postman'], domain: 'API Architecture' },
  tailwind: { adjacent: ['css', 'bootstrap', 'sass', 'styled-components'], domain: 'CSS Architecture' },
  redis: { adjacent: ['memcached', 'mongodb', 'caching', 'postgresql'], domain: 'In-Memory Stores' },
};

export const FREE_LEARNING_RESOURCES: Record<string, {
  fundamentals: string;
  practice: string;
  project: string;
  resource_name: string;
  resource_url: string;
}> = {
  tableau: {
    fundamentals: 'Understand Tableau Public workspace, data blending, calculated fields, and interactive dashboard parameters.',
    practice: 'Connect Tableau Public to a Kaggle Superstore sales dataset and create 3 linked drill-down views.',
    project: 'Publish a multi-tab Executive KPI Dashboard on Tableau Public showcasing sales trends, regional profit margins, and forecast overlays.',
    resource_name: 'Tableau Official Free Starter Kit & Tutorials',
    resource_url: 'https://www.tableau.com/learn/training',
  },
  powerbi: {
    fundamentals: 'Learn Power Query ETL data transformation, dimensional star-schema modeling, and core DAX measures (CALCULATE, SUMX, DATESYTD).',
    practice: 'Model a multi-table e-commerce relational schema and write 5 dynamic measure calculations.',
    project: 'Build an interactive Financial Performance PowerBI dashboard with custom tooltips, slicers, and mobile layout.',
    resource_name: 'Microsoft Learn: Power BI Fundamentals (Free)',
    resource_url: 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi',
  },
  docker: {
    fundamentals: 'Master containerization concepts: images vs containers, Dockerfiles, multi-stage builds, and layer caching.',
    practice: 'Containerize a two-tier full-stack application (React frontend + Node/Python backend) using Docker Compose.',
    project: 'Create an automated Docker microservices environment with volume mounts, environment secrets, and non-root user execution.',
    resource_name: 'Docker Official Getting Started Guide & Labs',
    resource_url: 'https://docs.docker.com/get-started/',
  },
  kubernetes: {
    fundamentals: 'Understand Pods, Deployments, ReplicaSets, Services (ClusterIP vs NodePort), and ConfigMaps/Secrets.',
    practice: 'Set up Minikube or Kind locally and deploy a load-balanced web service with rolling update capabilities.',
    project: 'Deploy a multi-pod stateful application with ingress routing, liveness/readiness probes, and horizontal pod autoscaling (HPA).',
    resource_name: 'Kubernetes Official Interactive Tutorials (Free)',
    resource_url: 'https://kubernetes.io/docs/tutorials/',
  },
  aws: {
    fundamentals: 'Learn foundational core AWS primitives: IAM policies, EC2 compute instances, S3 object storage, and VPC networking.',
    practice: 'Host a secure static SPA on Amazon S3 with CloudFront CDN distribution and custom SSL certificate.',
    project: 'Deploy a serverless REST API using AWS Lambda, API Gateway, DynamoDB, and CloudWatch metrics monitoring.',
    resource_name: 'AWS Skill Builder: Cloud Practitioner Free Essentials',
    resource_url: 'https://explore.skillbuilder.aws/',
  },
  react: {
    fundamentals: 'Master modern React: JSX, component lifecycle, useState/useEffect, custom hooks, and memoization patterns.',
    practice: 'Build a debounce search input component with abortable fetch controller and error boundary recovery.',
    project: 'Develop a complete real-time collaborative kanban board with drag-and-drop state persistence and responsive drawer UI.',
    resource_name: 'React.dev: Official Interactive Documentation',
    resource_url: 'https://react.dev/learn',
  },
  postgresql: {
    fundamentals: 'Relational database fundamentals: ACID transactions, foreign keys, indexes (B-Tree, GIN), and query execution plans (EXPLAIN ANALYZE).',
    practice: 'Write complex JOINs, window functions (ROW_NUMBER, RANK), and Common Table Expressions (CTEs) on a sample database.',
    project: 'Design and optimize an inventory database schema handling high-concurrency order placement with transactional locks.',
    resource_name: 'PostgreSQL Tutorial & Official Free Documentation',
    resource_url: 'https://www.postgresqltutorial.com/',
  },
  python: {
    fundamentals: 'Core syntax, object-oriented programming, data structures (lists, dicts, sets), list comprehensions, and generators.',
    practice: 'Solve 10 algorithm problems focusing on data manipulation and write clean modular functions with type hints.',
    project: 'Build an automated web scraping and data cleansing script that outputs structured JSON and validates schemas.',
    resource_name: 'Python Official Tutorial & freeCodeCamp Python Course',
    resource_url: 'https://docs.python.org/3/tutorial/',
  },
};

export function findSkillWorkarounds(
  missingKeywords: string[],
  resumeSkills: string[]
): SkillWorkaround[] {
  const workarounds: SkillWorkaround[] = [];
  const normalizedResumeSkills = resumeSkills.map((s) => s.toLowerCase().trim());

  for (const missing of missingKeywords) {
    const missingLower = missing.toLowerCase().trim();
    const entry = SKILL_ADJACENCY_MAP[missingLower];

    if (entry) {
      // Find which adjacent skills the candidate possesses
      const ownedAdjacent = entry.adjacent.filter((adj) =>
        normalizedResumeSkills.some((rs) => rs.includes(adj) || adj.includes(rs))
      );

      if (ownedAdjacent.length > 0) {
        const topMatch = ownedAdjacent[0];
        const capitalizedMissing = missing.charAt(0).toUpperCase() + missing.slice(1);
        const capitalizedOwned = topMatch.charAt(0).toUpperCase() + topMatch.slice(1);

        workarounds.push({
          missing_skill: capitalizedMissing,
          adjacent_skill: capitalizedOwned,
          workaround_strategy: `You lack '${capitalizedMissing}', but you have '${capitalizedOwned}' (${entry.domain}). Highlight your ${capitalizedOwned} experience and add a line about cross-platform adaptability.`,
          suggested_bullet: `Leveraged ${capitalizedOwned} to architect interactive analytical dashboards, with rapid adaptability to enterprise BI counterparts including ${capitalizedMissing}.`,
        });
      }
    }
  }

  return workarounds.slice(0, 5);
}

export function generateSkillRoadmaps(missingSkills: string[]): SkillRoadmap[] {
  const roadmaps: SkillRoadmap[] = [];

  for (const skill of missingSkills.slice(0, 4)) {
    const skillLower = skill.toLowerCase().trim();
    const resource = FREE_LEARNING_RESOURCES[skillLower];

    if (resource) {
      roadmaps.push({
        skill: skill.charAt(0).toUpperCase() + skill.slice(1),
        category: 'Target Job Requirement',
        difficulty: 'Intermediate',
        estimated_time: '1–2 weeks',
        milestones: [
          {
            phase: 'Fundamentals',
            title: 'Foundational Theory & Architecture',
            description: resource.fundamentals,
          },
          {
            phase: 'Practice Exercise',
            title: 'Hands-on Drill & Implementation',
            description: resource.practice,
          },
          {
            phase: 'Portfolio Project',
            title: 'Showcase Proof-of-Skill Project',
            description: resource.project,
          },
          {
            phase: 'Free Resources',
            title: resource.resource_name,
            description: 'Free, verified learning course and documentation track.',
            resource_name: resource.resource_name,
            resource_url: resource.resource_url,
          },
        ],
      });
    } else {
      const capitalized = skill.charAt(0).toUpperCase() + skill.slice(1);
      roadmaps.push({
        skill: capitalized,
        category: 'Target Job Requirement',
        difficulty: 'Beginner',
        estimated_time: '1 week',
        milestones: [
          {
            phase: 'Fundamentals',
            title: `Core Principles of ${capitalized}`,
            description: `Study the official ${capitalized} documentation, core CLI/API usage, and industry design patterns.`,
          },
          {
            phase: 'Practice Exercise',
            title: 'Hands-On Mini Exercise',
            description: `Build a small isolated sandbox exercising key ${capitalized} operations and testing edge cases.`,
          },
          {
            phase: 'Portfolio Project',
            title: 'Resume-Ready Portfolio Demo',
            description: `Integrate ${capitalized} into an open-source GitHub repository with a clear README, setup guide, and live demo.`,
          },
          {
            phase: 'Free Resources',
            title: `${capitalized} Official Documentation & freeCodeCamp`,
            description: 'Comprehensive free guides and community tutorials.',
            resource_name: `${capitalized} Documentation`,
            resource_url: `https://www.google.com/search?q=${encodeURIComponent(capitalized + ' tutorial freeCodeCamp documentation')}`,
          },
        ],
      });
    }
  }

  return roadmaps;
}

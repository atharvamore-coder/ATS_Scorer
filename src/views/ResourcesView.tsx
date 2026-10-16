import React, { useState } from 'react';
import { BookOpen, CheckCircle, XCircle, Code, Briefcase, Palette, FileText } from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tech' | 'business' | 'creative'>('tech');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-indigo-600" />
          <span>📚 Resources & Tips</span>
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Learn how to optimize your resume for Applicant Tracking Systems and recruiter scanning.
        </p>
      </div>

      {/* Do's and Don'ts */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-900">🎯 ATS Optimization Tips</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Do's */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
            <h3 className="font-bold text-emerald-900 flex items-center gap-2 text-base">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>✅ Do's</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                Use standard section headings (Experience, Education, Skills, Projects).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                Include relevant keywords directly from the target job description.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                Use clean, single-column formatting with consistent bullet points.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                List skills explicitly in a dedicated technical skills section.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                Quantify achievements with concrete numbers and percentages.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                Use standard web-safe fonts (Arial, Calibri, Helvetica, Times New Roman).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                Save and upload as selectable text PDF or DOCX format.
              </li>
            </ul>
          </div>

          {/* Don'ts */}
          <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-3">
            <h3 className="font-bold text-rose-900 flex items-center gap-2 text-base">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>❌ Don'ts</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                Avoid tables, text boxes, and complex graphical grids.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                Don't put critical contact information in header/footer zones.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                Avoid embedded charts, rating bars, and photo icons.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                Avoid multi-column magazine layouts that confuse parser reading order.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                Don't keyword stuff with hidden white text (ATS detects this).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                Avoid obscure acronyms without writing out the full title once.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                Don't include full home addresses or zip codes for privacy reasons.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Common ATS Keywords by Industry */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-900">🔑 Common ATS Keywords by Industry</h2>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('tech')}
            className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 transition border-b-2 -mb-px ${
              activeTab === 'tech'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>💻 Tech & Engineering</span>
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 transition border-b-2 -mb-px ${
              activeTab === 'business'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>💼 Business & Management</span>
          </button>
          <button
            onClick={() => setActiveTab('creative')}
            className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 transition border-b-2 -mb-px ${
              activeTab === 'creative'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>🎨 Creative & Design</span>
          </button>
        </div>

        <div className="pt-2">
          {activeTab === 'tech' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Languages & Frameworks</h4>
                <p className="text-xs text-gray-600">
                  Python, JavaScript, TypeScript, React, Next.js, Node.js, Express, Java, Spring Boot, Go, C++, SQL, PostgreSQL, MongoDB, GraphQL, REST API
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">DevOps & Cloud Tools</h4>
                <p className="text-xs text-gray-600">
                  Docker, Kubernetes, AWS (EC2, S3, Lambda), Azure, GCP, CI/CD, Git, GitHub Actions, Terraform, Linux, Microservices, Agile, Scrum
                </p>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Strategy & Execution</h4>
                <p className="text-xs text-gray-600">
                  Project Management, Stakeholder Engagement, Strategic Planning, Cross-Functional Leadership, Budget Management, Risk Mitigation, OKRs, KPIs
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Analysis & Operations</h4>
                <p className="text-xs text-gray-600">
                  Data-Driven Decision Making, Process Optimization, Financial Modeling, Market Research, Client Retention, Vendor Management, CRM, Salesforce
                </p>
              </div>
            </div>
          )}

          {activeTab === 'creative' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Design & Tools</h4>
                <p className="text-xs text-gray-600">
                  Figma, Adobe Creative Suite (Photoshop, Illustrator, InDesign, Premiere), UI/UX Design, Wireframing, Prototyping, Design Systems
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Communication & Visuals</h4>
                <p className="text-xs text-gray-600">
                  User Research, Usability Testing, Visual Identity, Brand Strategy, Typography, Motion Graphics, Responsive Design, Design Thinking
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resume Templates Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>📄 ATS-Friendly Resume Structure Guidelines</span>
        </h2>
        <p className="text-sm text-gray-600">
          The highest-scoring ATS resume architecture follows this clean chronological sequence:
        </p>

        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 font-mono text-xs text-gray-800 space-y-1">
          <div>1. <strong>CONTACT HEADER:</strong> Name | Email | Phone | City, State | LinkedIn | GitHub</div>
          <div>2. <strong>PROFESSIONAL SUMMARY:</strong> 2-3 lines highlighting core impact and specialization</div>
          <div>3. <strong>TECHNICAL SKILLS:</strong> Categorized list (Languages, Frameworks, Tools, Databases)</div>
          <div>4. <strong>EXPERIENCE:</strong> Reverse-chronological roles with 3-5 quantified bullet points</div>
          <div>5. <strong>PROJECTS:</strong> 2-3 key technical projects with tech stack and measurable metrics</div>
          <div>6. <strong>EDUCATION:</strong> Degree, Major, Institution, Graduation Year, GPA (if &gt;3.5)</div>
        </div>
      </div>
    </div>
  );
};

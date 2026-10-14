import { jsPDF } from 'jspdf';
import { AnalysisResponse } from '../types/ats';

export function exportAnalysisPDF(analysis: AnalysisResponse, filename: string = 'resume.pdf'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 18;

  // ---------------- PAGE 1: EXECUTIVE SUMMARY & SCORE BREAKDOWN ----------------

  // Header Banner
  doc.setFillColor(79, 70, 229); // Primary Indigo #4F46E5
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ATS Resume Optimization & Diagnostic Report', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const modeLabel = analysis.mode === 'fresher' ? 'Fresher / Internship (Indian Academic Standards)' : 'Standard (Professional Experience)';
  doc.text(`File: ${filename}  |  Mode: ${modeLabel}  |  Date: ${new Date().toLocaleDateString()}`, 14, 20);

  y = 36;
  doc.setTextColor(31, 41, 55);

  // Overall Score Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 26, 3, 3, 'FD');

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('OVERALL ATS COMPATIBILITY SCORE', 20, y + 8);

  const score = analysis.ats_score;
  if (score >= 80) doc.setTextColor(16, 185, 129);
  else if (score >= 60) doc.setTextColor(217, 119, 6);
  else doc.setTextColor(220, 38, 38);

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`${score.toFixed(0)} / 100`, 20, y + 19);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(analysis.interpretation || '', 75, y + 12, { maxWidth: pageWidth - 95 });

  if (analysis.academic_details?.cgpa) {
    doc.setFontSize(8);
    doc.setTextColor(99, 102, 241);
    doc.text(`Academic Metric: CGPA ${analysis.academic_details.cgpa}/10 verified (Tier Recognition: ${analysis.academic_details.institution_type || 'Accredited'})`, 75, y + 21);
  }

  y += 34;

  // 5-Dimension Score Breakdown
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. Five-Dimension Score Breakdown', 14, y);
  y += 6;

  const comps = [
    { label: 'Formatting & Layout Structure', score: analysis.component_scores.formatting, max: 20 },
    { label: 'Keywords & Target Skill Density', score: analysis.component_scores.keywords, max: 25 },
    { label: 'Content Quality & Quantifiable Impact', score: analysis.component_scores.content, max: 25 },
    { label: 'Skill Validation & Project Evidence', score: analysis.component_scores.skill_validation, max: 15 },
    { label: 'ATS Parser Compatibility & Privacy', score: analysis.component_scores.ats_compatibility, max: 15 },
  ];

  comps.forEach((c) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`${c.label}: ${c.score.toFixed(1)} / ${c.max}`, 16, y);

    // Progress bar bg
    doc.setFillColor(226, 232, 240);
    doc.rect(100, y - 3, 90, 3, 'F');

    // Progress bar fill
    const pct = Math.min(1, Math.max(0, c.score / c.max));
    doc.setFillColor(79, 70, 229);
    doc.rect(100, y - 3, 90 * pct, 3, 'F');

    y += 6.5;
  });

  y += 4;

  // Key Strengths
  if (analysis.strengths && analysis.strengths.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('2. Verified Resume Strengths', 14, y);
    y += 5.5;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    analysis.strengths.slice(0, 4).forEach((s) => {
      doc.setTextColor(16, 185, 129);
      doc.text('✓', 16, y);
      doc.setTextColor(51, 65, 85);
      doc.text(s, 22, y, { maxWidth: pageWidth - 36 });
      y += 4.5;
    });
    y += 3;
  }

  // Critical Blockers
  if (analysis.critical_issues && analysis.critical_issues.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('3. Critical ATS Blockers (Address First)', 14, y);
    y += 5.5;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    analysis.critical_issues.slice(0, 3).forEach((iss) => {
      doc.setTextColor(220, 38, 38);
      doc.text('!', 16, y);
      doc.setTextColor(51, 65, 85);
      doc.text(iss, 22, y, { maxWidth: pageWidth - 36 });
      y += 4.5;
    });
  }

  // Footer Page 1
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Page 1 of 3 — Confidential ATS Diagnostic Review', pageWidth / 2, pageHeight - 8, { align: 'center' });

  // ---------------- PAGE 2: EXPLAINABLE DIAGNOSTICS & SKILL BRIDGES ----------------
  doc.addPage();
  y = 18;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('4. Explainable Scoring & Copy-Paste Corrections', 14, y);
  y += 7;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Every issue below connects your exact resume text to the target job requirement with an instant copy-paste fix.', 14, y);
  y += 7;

  const explainables = analysis.explainable_issues || [];
  explainables.slice(0, 3).forEach((item) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, y, pageWidth - 28, 36, 2, 2, 'FD');

    // Title & Impact
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28);
    doc.text(`[${item.severity}] ${item.issue_title} (+${item.score_impact} pts)`, 18, y + 6);

    // Exact text
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Original Text: "${item.exact_resume_text.slice(0, 85)}"`, 18, y + 11);

    // Requirement & Why it matters
    doc.text(`Requirement: ${item.job_requirement}`, 18, y + 16);
    doc.text(`Why It Matters: ${item.why_it_matters.slice(0, 110)}...`, 18, y + 21, { maxWidth: pageWidth - 36 });

    // Copy-paste correction
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text('Suggested Copy-Paste Correction:', 18, y + 27);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(`"${item.suggested_correction.slice(0, 120)}"`, 18, y + 32, { maxWidth: pageWidth - 36 });

    y += 40;
  });

  // Skill Bridge & Workarounds
  if (analysis.skill_workarounds && analysis.skill_workarounds.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('5. Skill Bridge Workarounds (Framing Adjacent Skills)', 14, y);
    y += 6;

    analysis.skill_workarounds.slice(0, 2).forEach((w) => {
      doc.setFillColor(254, 243, 199); // amber-100
      doc.setDrawColor(251, 191, 36);
      doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'FD');

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(146, 64, 14);
      doc.text(`Lacking '${w.missing_skill}'? Leverage your '${w.adjacent_skill}' experience!`, 18, y + 6);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 53, 15);
      doc.text(w.workaround_strategy, 18, y + 11, { maxWidth: pageWidth - 36 });

      doc.setFont('helvetica', 'bold');
      doc.text(`Suggested Phrasing: "${w.suggested_bullet}"`, 18, y + 17, { maxWidth: pageWidth - 36 });

      y += 25;
    });
  }

  // Footer Page 2
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Page 2 of 3 — Confidential ATS Diagnostic Review', pageWidth / 2, pageHeight - 8, { align: 'center' });

  // ---------------- PAGE 3: SKILL ROADMAPS & MENTOR CHECKLIST ----------------
  doc.addPage();
  y = 18;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('6. Skill-Gap Learning Roadmap & Free Resources', 14, y);
  y += 7;

  const roadmaps = analysis.skill_roadmaps || [];
  roadmaps.slice(0, 2).forEach((rm) => {
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, y, pageWidth - 28, 38, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text(`Roadmap: ${rm.skill} (${rm.difficulty} · ~${rm.estimated_time})`, 18, y + 6);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    let ry = y + 12;
    rm.milestones.forEach((m) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`[${m.phase}]:`, 18, ry);
      doc.setFont('helvetica', 'normal');
      doc.text(`${m.description.slice(0, 85)}`, 45, ry, { maxWidth: pageWidth - 65 });
      ry += 5.5;
    });

    y += 42;
  });

  // Action Checklist for Student or Mentor Review
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('7. Offline Action Plan & Mentor Revision Checklist', 14, y);
  y += 6;

  const checklistItems = [
    'Apply copy-paste leadership and data analysis improvements in the in-browser editor.',
    'Add missing target keywords directly to the skills section and link to projects.',
    'Ensure all metrics adhere to the XYZ formula (Accomplished X, measured by Y, doing Z).',
    'Remove full street addresses and pin codes; retain clean "City, State" header format.',
    'For freshers: verify CGPA is stated and semester capstone project links are clickable.',
    'Have a career mentor or peer conduct a final pass against this diagnostic checklist.',
  ];

  doc.setFontSize(8);
  checklistItems.forEach((item) => {
    doc.setDrawColor(148, 163, 184);
    doc.rect(16, y - 2.5, 3, 3); // check box
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(item, 23, y);
    y += 5.5;
  });

  // Footer Page 3
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Page 3 of 3 — Confidential ATS Diagnostic Review · ATS Resume Scorer', pageWidth / 2, pageHeight - 8, { align: 'center' });

  doc.save(`ats_comprehensive_report_${filename.replace(/\.[^/.]+$/, '')}.pdf`);
}

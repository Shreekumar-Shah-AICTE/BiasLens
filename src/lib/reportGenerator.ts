import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { BiasAnalysis } from '../types';

export async function generateReport(
  analysis: BiasAnalysis,
  scenarioTitle: string,
  scenarioIcon: string,
): Promise<void> {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ─── Helper functions ───
  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (y + requiredSpace > pdf.internal.pageSize.getHeight() - 20) {
      pdf.addPage();
      y = margin;
    }
  };

  const drawLine = () => {
    pdf.setDrawColor(200);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  // ─── HEADER ───
  pdf.setFillColor(5, 5, 10);
  pdf.rect(0, 0, pageWidth, 45, 'F');

  pdf.setTextColor(0, 229, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${scenarioIcon} BiasLens`, margin, 20);

  pdf.setFontSize(10);
  pdf.setTextColor(200);
  pdf.setFont('helvetica', 'normal');
  pdf.text('AI-Powered Bias Audit Report', margin, 28);

  pdf.setFontSize(8);
  pdf.setTextColor(150);
  pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, margin, 35);
  pdf.text('Powered by Google Gemini • UN SDG 10: Reduced Inequalities', pageWidth - margin - 80, 35);

  y = 55;

  // ─── EXECUTIVE SUMMARY ───
  pdf.setTextColor(40);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${scenarioTitle} — Audit Report`, margin, y);
  y += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(80);
  const summaryLines = pdf.splitTextToSize(analysis.summary, contentWidth);
  pdf.text(summaryLines, margin, y);
  y += summaryLines.length * 5 + 8;

  // ─── OVERALL SCORE ───
  pdf.setFillColor(245, 245, 250);
  pdf.roundedRect(margin, y, contentWidth, 25, 3, 3, 'F');

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  const scoreColor = analysis.overallFairnessScore <= 30 ? [255, 51, 102] :
    analysis.overallFairnessScore <= 50 ? [255, 100, 50] :
    analysis.overallFairnessScore <= 70 ? [255, 170, 0] : [0, 230, 118];
  pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  pdf.text(`Fairness Score: ${analysis.overallFairnessScore}/100`, margin + 5, y + 10);

  const severityColors: Record<string, number[]> = {
    CRITICAL: [255, 51, 102],
    HIGH: [255, 100, 50],
    MODERATE: [255, 170, 0],
    LOW: [0, 230, 118],
  };
  const sevColor = severityColors[analysis.severityLevel] || [150, 150, 150];
  pdf.setTextColor(sevColor[0], sevColor[1], sevColor[2]);
  pdf.text(`Severity: ${analysis.severityLevel}`, margin + 100, y + 10);

  pdf.setTextColor(100);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(
    `Statistical Parity: ${analysis.fairnessMetrics.statisticalParity}%  |  Equal Opportunity: ${analysis.fairnessMetrics.equalOpportunity}%  |  Predictive Parity: ${analysis.fairnessMetrics.predictiveParity}%  |  Individual: ${analysis.fairnessMetrics.individualFairness}%`,
    margin + 5,
    y + 18
  );
  y += 33;

  drawLine();

  // ─── BIASES DETECTED ───
  addNewPageIfNeeded(40);
  pdf.setTextColor(40);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Biases Detected', margin, y);
  y += 8;

  for (const bias of analysis.biasesDetected) {
    addNewPageIfNeeded(20);
    const bColor = severityColors[bias.severity] || [150, 150, 150];
    pdf.setFillColor(bColor[0], bColor[1], bColor[2]);
    pdf.circle(margin + 2, y + 1, 1.5, 'F');

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(40);
    pdf.text(`${bias.type} Bias`, margin + 7, y + 2);

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(bColor[0], bColor[1], bColor[2]);
    pdf.text(`[${bias.severity}]`, margin + 50, y + 2);

    pdf.setTextColor(100);
    pdf.text(`Confidence: ${bias.confidence}% | Affected: ${bias.affectedGroup}`, margin + 7, y + 8);

    const metricLines = pdf.splitTextToSize(bias.metric, contentWidth - 10);
    pdf.text(metricLines, margin + 7, y + 13);
    y += 13 + metricLines.length * 4 + 4;
  }

  drawLine();

  // ─── HIDDEN PROXY VARIABLES ───
  if (analysis.hiddenProxies && analysis.hiddenProxies.length > 0) {
    addNewPageIfNeeded(40);
    pdf.setTextColor(255, 51, 102);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('⚠ Hidden Proxy Variables', margin, y);
    y += 8;

    for (const proxy of analysis.hiddenProxies) {
      addNewPageIfNeeded(25);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40);
      pdf.text(`"${proxy.variable}" → correlates with "${proxy.correlatesWith}"`, margin + 5, y);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(255, 51, 102);
      pdf.text(`Correlation: ${proxy.correlationStrength}%`, margin + 5, y + 5);

      pdf.setTextColor(100);
      const explLines = pdf.splitTextToSize(proxy.explanation, contentWidth - 10);
      pdf.text(explLines, margin + 5, y + 10);
      y += 10 + explLines.length * 4 + 6;
    }

    drawLine();
  }

  // ─── DEMOGRAPHIC IMPACT ───
  if (analysis.demographicImpact && analysis.demographicImpact.length > 0) {
    addNewPageIfNeeded(40);
    pdf.setTextColor(40);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Demographic Impact', margin, y);
    y += 8;

    // Table header
    pdf.setFillColor(240, 240, 245);
    pdf.rect(margin, y, contentWidth, 7, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(80);
    pdf.text('Group', margin + 3, y + 5);
    pdf.text('Approval Rate', margin + 80, y + 5);
    pdf.text('vs. Average', margin + 120, y + 5);
    y += 9;

    for (const demo of analysis.demographicImpact) {
      addNewPageIfNeeded(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60);
      pdf.text(demo.group, margin + 3, y + 4);
      pdf.text(`${demo.approvalRate}%`, margin + 80, y + 4);

      const isNeg = demo.comparedToAverage.startsWith('-');
      pdf.setTextColor(isNeg ? 255 : 0, isNeg ? 51 : 180, isNeg ? 102 : 80);
      pdf.text(demo.comparedToAverage, margin + 120, y + 4);
      y += 7;
    }
    y += 5;
    drawLine();
  }

  // ─── RECOMMENDATIONS ───
  if (analysis.recommendations && analysis.recommendations.length > 0) {
    addNewPageIfNeeded(40);
    pdf.setTextColor(40);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Recommendations', margin, y);
    y += 8;

    const sorted = [...analysis.recommendations].sort((a, b) => a.priority - b.priority);
    for (const rec of sorted) {
      addNewPageIfNeeded(20);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 150, 200);
      pdf.text(`#${rec.priority}`, margin + 3, y + 2);

      pdf.setTextColor(40);
      const actionLines = pdf.splitTextToSize(rec.action, contentWidth - 25);
      pdf.text(actionLines, margin + 15, y + 2);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      const nextLineY = y + 2 + actionLines.length * 5;
      pdf.text(`Impact: ${rec.impact} | Effort: ${rec.effort}`, margin + 15, nextLineY);
      y = nextLineY + 7;
    }
  }

  // ─── FOOTER ───
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    const pageH = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(7);
    pdf.setTextColor(180);
    pdf.text(`BiasLens Audit Report — Page ${i} of ${pageCount}`, margin, pageH - 8);
    pdf.text('Powered by Google Gemini • Team O(1) • Google Solution Challenge 2026', pageWidth - margin - 80, pageH - 8);
  }

  // ─── CAPTURE CHARTS ───
  try {
    const dashboardEl = document.getElementById('bias-dashboard');
    if (dashboardEl) {
      const canvas = await html2canvas(dashboardEl, {
        backgroundColor: '#05050a',
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      pdf.addPage();
      pdf.setTextColor(40);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Visual Dashboard Capture', margin, 20);

      const imgWidth = contentWidth;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      pdf.addImage(imgData, 'PNG', margin, 28, imgWidth, Math.min(imgHeight, 240));
    }
  } catch (e) {
    console.warn('[BiasLens] Could not capture dashboard screenshot for PDF:', e);
  }

  // ─── SAVE ───
  pdf.save(`BiasLens_Audit_${scenarioTitle.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
}

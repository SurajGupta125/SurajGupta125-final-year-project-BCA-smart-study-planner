import React from 'react';
import jsPDF from 'jspdf';

function ExportReport({ totalStudyHours, completedTasks, streakDays, goalProgressPercent }) {
  const handleDownload = () => {
    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const marginX = 48;
      let cursorY = 72;

      const title = 'Smart Study Planner - Study Report';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, cursorY);

      cursorY += 24;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const dateStr = new Date().toLocaleString();
      doc.text(`Generated on: ${dateStr}`, marginX, cursorY);

      cursorY += 28;
      doc.setDrawColor(200);
      doc.line(marginX, cursorY, pageWidth - marginX, cursorY);

      cursorY += 28;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Summary', marginX, cursorY);

      cursorY += 20;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);

      const lines = [
        `Total Study Hours: ${Number(totalStudyHours || 0).toFixed(1)} hrs`,
        `Completed Tasks: ${Number(completedTasks || 0)}`,
        `Current Study Streak: ${Number(streakDays || 0)} day${Number(streakDays || 0) === 1 ? '' : 's'}`,
        `Goal Progress: ${Math.round(Number(goalProgressPercent || 0))}%`,
      ];

      const lineGap = 18;
      lines.forEach((line) => {
        doc.text(line, marginX, cursorY);
        cursorY += lineGap;
      });

      cursorY += 10;
      const note =
        'Keep showing up consistently. Even small, focused sessions add up over time towards your goals.';
      const wrappedNote = doc.splitTextToSize(note, pageWidth - marginX * 2);
      doc.setFontSize(11);
      doc.text(wrappedNote, marginX, cursorY);

      doc.save('smart-study-report.pdf');
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Unable to generate report. Please try again.');
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <button type="button" className="dash-open-btn" onClick={handleDownload}>
      Download Study Report
    </button>
  );
}

export default ExportReport;


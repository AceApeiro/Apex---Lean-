import fs from 'fs';
import { parse } from 'csv-parse/sync';

async function processCSV() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTpNwubfBnETNUlfzzFn1PVjj6whCy9QgUMZ74dhmpMFJ-KN3kUeFGX-5AVLM8jn9wDEwzX-3wcOxHo/pub?gid=0&single=true&output=csv');
  const text = await res.text();
  
  const records = parse(text, {
    skip_empty_lines: true
  });

  const headers = records[0];
  const minutes = [];

  for (let col = 0; col < headers.length; col += 2) {
    const dateStr = headers[col];
    if (!dateStr || dateStr.toLowerCase() === 'action items') continue;

    // Format date if needed, assuming it's YYYY-MM-DD or MM/DD/YYYY
    // But let's just use it as is if it's a valid string
    
    const discussionPoints = [];
    const actionItems = [];

    for (let row = 1; row < records.length; row++) {
      const discussionText = records[row][col];
      const actionText = records[row][col + 1];

      if (discussionText && discussionText.trim()) {
        discussionPoints.push(discussionText.trim());
      }

      if (actionText && actionText.trim()) {
        // Parse status from action text if it contains " - completed" or " - in progress"
        let status = 'Pending';
        let cleanText = actionText.trim();
        const lowerText = cleanText.toLowerCase();
        
        if (lowerText.includes('- completed') || lowerText.includes('-- completed')) {
          status = 'Completed';
          cleanText = cleanText.replace(/\s*-{1,2}\s*completed/i, '').trim();
        } else if (lowerText.includes('- in progress') || lowerText.includes('- in progess') || lowerText.includes('- in progereaa')) {
          status = 'In Progress';
          cleanText = cleanText.replace(/\s*-{1,2}\s*in\s*prog(ress|ess|ereaa)/i, '').trim();
        } else if (lowerText.includes('- task')) {
          cleanText = cleanText.replace(/\s*-{1,2}\s*task/i, '').trim();
        }

        actionItems.push({
          id: `csv-${col}-${row}`,
          text: cleanText,
          status: status
        });
      }
    }

    if (discussionPoints.length > 0 || actionItems.length > 0) {
      minutes.push({
        date: dateStr,
        time: '09:00', // Default time
        attendees: 'Team', // Default attendees
        discussion: discussionPoints.map((p, i) => `${i + 1}. ${p}`).join('\n'),
        actionItems: actionItems
      });
    }
  }

  console.log(JSON.stringify(minutes, null, 2));
}

processCSV().catch(console.error);

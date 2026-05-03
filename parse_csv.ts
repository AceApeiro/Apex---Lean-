import fs from 'fs';

async function processCSV() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTpNwubfBnETNUlfzzFn1PVjj6whCy9QgUMZ74dhmpMFJ-KN3kUeFGX-5AVLM8jn9wDEwzX-3wcOxHo/pub?gid=0&single=true&output=csv');
  const text = await res.text();
  
  // Simple CSV parser
  const rows = text.split('\n').map(row => {
    const cols = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        if (inQuotes && row[i+1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        cols.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    cols.push(current);
    return cols;
  });

  const headers = rows[0];
  const minutes = [];

  for (let col = 0; col < headers.length; col += 2) {
    let dateStr = headers[col]?.trim();
    if (!dateStr || dateStr.toLowerCase() === 'action items') continue;

    // Convert MM/DD/YYYY to YYYY-MM-DD if needed
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        dateStr = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
      }
    }

    const discussionPoints = [];
    const actionItems = [];

    for (let row = 1; row < rows.length; row++) {
      const discussionText = rows[row][col];
      const actionText = rows[row][col + 1];

      if (discussionText && discussionText.trim()) {
        discussionPoints.push(discussionText.trim());
      }

      if (actionText && actionText.trim()) {
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
        time: '09:00',
        attendees: 'Team',
        discussion: discussionPoints.map((p, i) => `${i + 1}. ${p}`).join('\n'),
        actionItems: actionItems
      });
    }
  }

  console.log(JSON.stringify(minutes, null, 2));
}

processCSV().catch(console.error);

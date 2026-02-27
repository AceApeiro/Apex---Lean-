import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';

const db = new Database('app.db');

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS minutes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    attendees TEXT NOT NULL,
    discussion TEXT NOT NULL,
    actionItems TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const INITIAL_MINUTES = [
  {
    date: '2025-02-16',
    time: '10:00 AM',
    attendees: 'Team Apex',
    discussion: '1. Discussed the 5 stage holders.\n2. A Lean Steering Team was appointed. (Steve - Leader, Nelusha - Facilitator, Buveendra & Namal - Advisors)\n3. An activity on the Kindergarten of Problem Solving was assigned.\n4. Roles were assigned for that activity. (Uthpala - Team Leader, Sumudu - Facilitator, Heshani - Communicator)\n5. Started by cleaning the HR department and the conference room.\n6. Conducted a 5S walk in the HR department and the conference room, identified the existing issues, and documented them.',
    actionItems: [
      { id: '2-0', text: 'Complete assigned Kindergarten of Problem Solving activity.', status: 'Pending' },
      { id: '2-1', text: 'Document existing issues from 5S walk.', status: 'Pending' }
    ]
  },
  {
    date: '2025-02-09',
    time: '10:00 AM',
    attendees: 'Team Apex',
    discussion: '1. Discussed matters related to Operations, the Middle Team, and Top Management.\n2. Reviewed key points from the previous meeting. An activity was assigned to document the discussed points.\n3. Presented gifts to Uthpala and Steve.\n4. Discussed overall productivity and performance matters.\n5. Assigned an activity to Mr. Nelusha.\n6. Steve was instructed to brief the members who were absent last week on the matters discussed during the meeting.\n7. Documented the discussion points from the last meeting.',
    actionItems: [
      { id: '1-0', text: '1. Mr. Nelusha to handle the assigned activity.', status: 'Pending' },
      { id: '1-1', text: '2. Steve to update the absent members.', status: 'Pending' }
    ]
  }
];

const count = db.prepare('SELECT COUNT(*) as count FROM minutes').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO minutes (date, time, attendees, discussion, actionItems) VALUES (?, ?, ?, ?, ?)');
  for (const min of INITIAL_MINUTES) {
    insert.run(min.date, min.time, min.attendees, min.discussion, JSON.stringify(min.actionItems));
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes for Images
  app.get('/api/images', (req, res) => {
    const images = db.prepare('SELECT * FROM images ORDER BY created_at DESC').all();
    res.json(images);
  });

  app.post('/api/images', (req, res) => {
    const { url, title } = req.body;
    const stmt = db.prepare('INSERT INTO images (url, title) VALUES (?, ?)');
    const info = stmt.run(url, title);
    res.json({ id: info.lastInsertRowid, url, title });
  });

  app.delete('/api/images/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.prepare('DELETE FROM images WHERE id = ?').run(id);
    res.json({ success: true });
  });

  // API Routes for Minutes
  app.get('/api/minutes', (req, res) => {
    const minutes = db.prepare('SELECT * FROM minutes ORDER BY date DESC, created_at DESC').all();
    res.json(minutes);
  });

  app.post('/api/minutes', (req, res) => {
    const { date, time, attendees, discussion, actionItems } = req.body;
    const stmt = db.prepare('INSERT INTO minutes (date, time, attendees, discussion, actionItems) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(date, time, attendees, discussion, JSON.stringify(actionItems));
    res.json({ id: info.lastInsertRowid, date, time, attendees, discussion, actionItems });
  });

  app.put('/api/minutes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { actionItems } = req.body;
    const stmt = db.prepare('UPDATE minutes SET actionItems = ? WHERE id = ?');
    stmt.run(JSON.stringify(actionItems), id);
    res.json({ success: true });
  });

  app.delete('/api/minutes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.prepare('DELETE FROM minutes WHERE id = ?').run(id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

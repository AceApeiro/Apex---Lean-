import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import twilio from 'twilio';
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import path from 'path';

const dbPath = process.env.NODE_ENV === 'production' ? '/tmp/apex_app.db' : 'apex_app.db';
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Initialize Twilio client lazily
let twilioClient: twilio.Twilio | null = null;
function getTwilioClient() {
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (accountSid && authToken) {
      twilioClient = twilio(accountSid, authToken);
    }
  }
  return twilioClient;
}

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS folders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    folder_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(folder_id) REFERENCES folders(id) ON DELETE CASCADE
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

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blog_comments (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blog_reactions (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    thumbsUp INTEGER DEFAULT 0,
    heart INTEGER DEFAULT 0,
    award INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS blog_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS blog_post_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    edited_by TEXT NOT NULL,
    edited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts (id) ON DELETE CASCADE
  );
`);

// Initialize blog reactions and tasks if empty
try {
  const reactionCount = db.prepare('SELECT COUNT(*) as count FROM blog_reactions').get() as { count: number };
  if (reactionCount.count === 0) {
    db.prepare('INSERT INTO blog_reactions (id, thumbsUp, heart, award) VALUES (1, 0, 0, 0)').run();
  }

  const taskCount = db.prepare('SELECT COUNT(*) as count FROM blog_tasks').get() as { count: number };
  if (taskCount.count === 0) {
    const insertTask = db.prepare('INSERT INTO blog_tasks (text, completed) VALUES (?, ?)');
    insertTask.run('Quantify progress of the work completed', 0);
    insertTask.run('Ensure continuous growth for smooth transition', 0);
    insertTask.run('Identify loopholes and strategies to overcome them', 0);
    insertTask.run('Devise an execution plan to reach the next goal', 0);
  }

  const postCount = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get() as { count: number };
  if (postCount.count === 0) {
    const defaultContent = `Great teamwork and coordination!

Nimmi was annoyed she didn't get the opportunity to sing at the Seiri day. Ravira was prepared too with his tabla... he says we missed a treat. Better luck next time guys!

> Sumudu has recovered from Dengue, at least he says so... Some say it was a miracle and the platelet increase was a result of the fright of the catheter... this could definitely be looked at as a cure... wonder if Mr. Namal will consider this a KPI. Way to go APEX!`;
    db.prepare('INSERT INTO blog_posts (id, title, content, date) VALUES (1, ?, ?, ?)').run('Second Seiri Day Completed', defaultContent, 'March 20, 2026');
  }
} catch (e) {
  console.error('Failed to initialize blog data:', e);
}

// Insert default admin user if not exists
try {
  const adminExists = db.prepare('SELECT * FROM users WHERE email = ?').get('info@acestool.com');
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync('Admin', saltRounds);
  
  if (!adminExists) {
    db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run('info@acestool.com', hashedPassword, 'admin');
  } else {
    // Update password to hashed version if it's currently plain text
    const user = adminExists as any;
    if (user.password === 'Admin') {
      db.prepare('UPDATE users SET password = ? WHERE email = ?').run(hashedPassword, 'info@acestool.com');
    }
  }
} catch (e) {
  console.error('Failed to create default admin:', e);
}

function logAudit(action: string, details: string = '') {
  try {
    const stmt = db.prepare('INSERT INTO audit_logs (action, details) VALUES (?, ?)');
    stmt.run(action, details);
  } catch (e) {
    console.error('Failed to log audit:', e);
  }
}

const INITIAL_MINUTES = [
  {
    date: '2026-03-23',
    time: '09:00',
    attendees: 'Team',
    discussion: `1. Review of previous action items.
2. Discussion on AOS dashboard implementation.
3. Safety and 5S updates.`,
    actionItems: []
  },
  {
    date: '2026-03-16',
    time: '09:00',
    attendees: 'Team',
    discussion: `1. Mr. Namal gave instructions to Steve. Heshani about future plans and operation procedures. Nimmi to be updated by Steve - task
2. Also Heshani to prepare presentation on DOWNTIME, everyone else to research and learn one attribute of it - completed presentation 
3. Theva to do 5S presentation and Geeth to act as backup
4. Also Mr. Namal gave strict instructions to use one dashboard as a data source for all tasks
5. Also pointed out changes required to presentations etc.
6. A poll to be done Sunday evening for attendance
7. Theva to do safety first aid and X guard orientation/app with the assistance of Steve
8. Future db and systems and processes to be part of the AOS - operating system`,
    actionItems: []
  },
  {
    date: '2025-03-09',
    time: '09:00',
    attendees: 'Team',
    discussion: `1. Discussed a value addition point.
2. Held a discussion regarding the CCP.
3. Discussed Steve's website, which was developed for Lean purposes.
4. Reviewed monitoring team KPIs along with individual team members.
5. Assigned Heshani as the communicator for the Lean Steering Team.
6. Conducted Prabhashi's meeting and completed a related activity.`,
    actionItems: []
  },
  {
    date: '2025-03-03',
    time: '09:00',
    attendees: 'Team',
    discussion: `1. An overview of the orientation program was discussed.
2. The Key Performance Indicators (KPI) and performance expectations were explained and discussed.
3. The team discussed what is most essential among the Middle Team, Management, and Operations Team. After the discussion, everyone agreed to...
4. The concept of WIIFM (What's In It For Me) was explained to the team.`,
    actionItems: []
  }
];

const count = db.prepare('SELECT COUNT(*) as count FROM minutes').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO minutes (date, time, attendees, discussion, actionItems) VALUES (?, ?, ?, ?, ?)');
  for (const min of INITIAL_MINUTES) {
    insert.run(min.date, min.time, min.attendees, min.discussion, JSON.stringify(min.actionItems));
  }
}

const imageCount = db.prepare('SELECT COUNT(*) as count FROM images').get() as { count: number };
if (imageCount.count === 0) {
  const insert = db.prepare('INSERT INTO images (url, title) VALUES (?, ?)');
  insert.run('https://picsum.photos/seed/5s1/800/600', 'Before: HR Room');
  insert.run('https://picsum.photos/seed/5s2/800/600', 'After: HR Room Organized');
  insert.run('https://picsum.photos/seed/5s3/800/600', 'Before: Conference Room');
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  // WebSocket connection handling
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    // Send existing messages to the new client
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at ASC LIMIT 100').all();
    ws.send(JSON.stringify({ type: 'init', messages }));

    ws.on('message', (data: string) => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'message') {
          const { email, content } = parsed;
          
          // Save to database
          const stmt = db.prepare('INSERT INTO messages (email, content) VALUES (?, ?)');
          const info = stmt.run(email, content);
          
          logAudit('SEND_CHAT_MESSAGE', `From: ${email}`);
          
          const newMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(info.lastInsertRowid);
          
          // Broadcast to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'new_message', message: newMessage }));
            }
          });
        }
      } catch (e) {
        console.error('Error processing message', e);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  app.use(express.json({ limit: '50mb' }));

  // API Route for Login
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          logAudit('USER_LOGIN', `Email: ${email}`);
          res.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error during login' });
    }
  });

  // API Routes for Folders
  app.get('/api/folders', (req, res) => {
    const folders = db.prepare(`
      SELECT f.*, 
             (SELECT url FROM images i WHERE i.folder_id = f.id ORDER BY created_at DESC LIMIT 1) as thumbnail
      FROM folders f 
      ORDER BY f.created_at DESC
    `).all();
    res.json(folders);
  });

  app.post('/api/folders', (req, res) => {
    const { name } = req.body;
    const stmt = db.prepare('INSERT INTO folders (name) VALUES (?)');
    const info = stmt.run(name);
    logAudit('CREATE_FOLDER', `Folder name: ${name}`);
    res.json({ id: info.lastInsertRowid, name });
  });

  app.put('/api/folders/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Folder name is required' });
    }
    db.prepare('UPDATE folders SET name = ? WHERE id = ?').run(name.trim(), id);
    logAudit('UPDATE_FOLDER', `Folder ID: ${id}, New Name: ${name}`);
    res.json({ success: true, id, name: name.trim() });
  });

  app.delete('/api/folders/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.prepare('DELETE FROM folders WHERE id = ?').run(id);
    logAudit('DELETE_FOLDER', `Folder ID: ${id}`);
    res.json({ success: true });
  });

  // API Routes for Images
  app.get('/api/images', (req, res) => {
    const folderId = req.query.folderId;
    let images;
    if (folderId) {
      images = db.prepare('SELECT * FROM images WHERE folder_id = ? ORDER BY created_at DESC').all(parseInt(folderId as string, 10));
    } else {
      images = db.prepare('SELECT * FROM images WHERE folder_id IS NULL ORDER BY created_at DESC').all();
    }
    res.json(images);
  });

  app.post('/api/images', (req, res) => {
    const { url, title, folder_id } = req.body;
    const stmt = db.prepare('INSERT INTO images (url, title, folder_id) VALUES (?, ?, ?)');
    const info = stmt.run(url, title, folder_id || null);
    logAudit('UPLOAD_IMAGE', `Title: ${title}, Folder ID: ${folder_id || 'None'}`);
    res.json({ id: info.lastInsertRowid, url, title, folder_id: folder_id || null });
  });

  app.delete('/api/images/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.prepare('DELETE FROM images WHERE id = ?').run(id);
    logAudit('DELETE_IMAGE', `Image ID: ${id}`);
    res.json({ success: true });
  });

  // API Routes for Minutes
  app.get('/api/minutes', (req, res) => {
    try {
      const minutes = db.prepare('SELECT * FROM minutes ORDER BY date DESC, created_at DESC').all();
      res.json(minutes);
    } catch (error: any) {
      console.error('Error fetching minutes:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch minutes' });
    }
  });

  app.post('/api/minutes', (req, res) => {
    try {
      const { date, time, attendees, discussion, actionItems } = req.body;
      const stmt = db.prepare('INSERT INTO minutes (date, time, attendees, discussion, actionItems) VALUES (?, ?, ?, ?, ?)');
      const info = stmt.run(date, time, attendees, discussion, JSON.stringify(actionItems));
      logAudit('CREATE_MINUTES', `Date: ${date}, Attendees: ${attendees}`);
      res.json({ id: info.lastInsertRowid, date, time, attendees, discussion, actionItems });
    } catch (error: any) {
      console.error('Error creating minutes:', error);
      res.status(500).json({ error: error.message || 'Failed to create minutes' });
    }
  });

  app.put('/api/minutes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { date, time, attendees, discussion, actionItems } = req.body;
    
    if (date !== undefined && discussion !== undefined) {
      const stmt = db.prepare('UPDATE minutes SET date = ?, time = ?, attendees = ?, discussion = ?, actionItems = ? WHERE id = ?');
      stmt.run(date, time, attendees, discussion, JSON.stringify(actionItems), id);
      logAudit('UPDATE_MINUTES', `Minutes ID: ${id}, Date: ${date}`);
      res.json({ id, date, time, attendees, discussion, actionItems });
    } else {
      // Fallback for just updating action items
      const stmt = db.prepare('UPDATE minutes SET actionItems = ? WHERE id = ?');
      stmt.run(JSON.stringify(actionItems), id);
      logAudit('UPDATE_MINUTES_ACTIONS', `Minutes ID: ${id}`);
      res.json({ success: true });
    }
  });

  app.delete('/api/minutes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.prepare('DELETE FROM minutes WHERE id = ?').run(id);
    logAudit('DELETE_MINUTES', `Minutes ID: ${id}`);
    res.json({ success: true });
  });

  // API Routes for Blog
  app.get('/api/blog/comments', (req, res) => {
    const comments = db.prepare('SELECT * FROM blog_comments ORDER BY created_at ASC').all();
    res.json(comments);
  });

  app.post('/api/blog/comments', (req, res) => {
    const { id, author, text, timestamp } = req.body;
    const stmt = db.prepare('INSERT INTO blog_comments (id, author, text, timestamp) VALUES (?, ?, ?, ?)');
    stmt.run(id, author, text, timestamp);
    res.json({ success: true });
  });

  app.get('/api/blog/reactions', (req, res) => {
    const reactions = db.prepare('SELECT * FROM blog_reactions WHERE id = 1').get();
    res.json(reactions);
  });

  app.post('/api/blog/reactions', (req, res) => {
    const { thumbsUp, heart, award } = req.body;
    const stmt = db.prepare('UPDATE blog_reactions SET thumbsUp = ?, heart = ?, award = ? WHERE id = 1');
    stmt.run(thumbsUp, heart, award);
    res.json({ success: true });
  });

  app.get('/api/blog/tasks', (req, res) => {
    const tasks = db.prepare('SELECT * FROM blog_tasks ORDER BY id ASC').all();
    res.json(tasks.map((t: any) => ({ ...t, completed: Boolean(t.completed) })));
  });

  app.put('/api/blog/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { completed } = req.body;
    const stmt = db.prepare('UPDATE blog_tasks SET completed = ? WHERE id = ?');
    stmt.run(completed ? 1 : 0, id);
    res.json({ success: true });
  });

  app.get('/api/blog/post', (req, res) => {
    const post = db.prepare('SELECT * FROM blog_posts WHERE id = 1').get();
    res.json(post);
  });

  app.put('/api/blog/post', (req, res) => {
    const { title, content, editedBy } = req.body;
    
    // Get current post to save to history
    const currentPost = db.prepare('SELECT * FROM blog_posts WHERE id = 1').get() as any;
    
    // Save to history
    const historyStmt = db.prepare('INSERT INTO blog_post_history (post_id, title, content, edited_by) VALUES (1, ?, ?, ?)');
    historyStmt.run(currentPost.title, currentPost.content, editedBy || 'Unknown');
    
    // Update post
    const updateStmt = db.prepare('UPDATE blog_posts SET title = ?, content = ? WHERE id = 1');
    updateStmt.run(title, content);
    
    logAudit('UPDATE_BLOG_POST', `Edited by: ${editedBy}`);
    res.json({ success: true });
  });

  app.get('/api/blog/history', (req, res) => {
    const history = db.prepare('SELECT * FROM blog_post_history WHERE post_id = 1 ORDER BY edited_at DESC').all();
    res.json(history);
  });

  // API Route for sending SMS
  app.post('/api/sms', async (req, res) => {
    try {
      const { to, message } = req.body;
      
      if (!to || !message) {
        return res.status(400).json({ error: 'Phone number and message are required' });
      }

      // Format Sri Lankan number if needed (e.g., 0771234567 -> +94771234567)
      let formattedNumber = to.replace(/\s+/g, '');
      if (formattedNumber.startsWith('0')) {
        formattedNumber = '+94' + formattedNumber.substring(1);
      } else if (!formattedNumber.startsWith('+')) {
        formattedNumber = '+' + formattedNumber;
      }

      const client = getTwilioClient();
      if (!client) {
        return res.status(500).json({ 
          error: 'Twilio is not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in environment variables.' 
        });
      }

      const fromNumber = process.env.TWILIO_PHONE_NUMBER;
      if (!fromNumber) {
        return res.status(500).json({ error: 'TWILIO_PHONE_NUMBER is not configured.' });
      }

      const result = await client.messages.create({
        body: message,
        from: fromNumber,
        to: formattedNumber
      });

      logAudit('SEND_SMS', `To: ${formattedNumber}, Message ID: ${result.sid}`);
      res.json({ success: true, messageId: result.sid });
    } catch (error: any) {
      console.error('Error sending SMS:', error);
      res.status(500).json({ error: error.message || 'Failed to send SMS' });
    }
  });

  // API Route for Audit Logs
  app.get('/api/audit-logs', (req, res) => {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 500').all();
    res.json(logs);
  });

  // Schedule weekly email (Runs every Sunday at 00:00)
  cron.schedule('0 0 * * 0', async () => {
    console.log('Running weekly audit log email task...');
    try {
      const logs = db.prepare("SELECT * FROM audit_logs WHERE created_at >= datetime('now', '-7 days') ORDER BY created_at DESC").all() as any[];
      
      if (logs.length === 0) {
        console.log('No audit logs to send this week.');
        return;
      }

      let textContent = 'Weekly Audit Trail Report - Team Apex\n\n';
      logs.forEach((log) => {
        textContent += `[${log.created_at}] ${log.action}: ${log.details}\n`;
      });

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Team Apex System" <noreply@acestool.com>',
        to: 'info@acestool.com',
        subject: 'Weekly Audit Trail Report - Team Apex',
        text: textContent,
      });
      
      console.log('Weekly audit log email sent successfully.');
    } catch (error) {
      console.error('Error sending weekly audit log email:', error);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handler for API routes
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith('/api/')) {
      console.error('API Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      next(err);
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

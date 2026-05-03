import Database from 'better-sqlite3';
const dbPath = process.env.NODE_ENV === 'production' ? '/tmp/apex_app.db' : 'apex_app.db';
const db = new Database(dbPath);
const minutes = db.prepare('SELECT * FROM minutes').all();
console.log(JSON.stringify(minutes, null, 2));

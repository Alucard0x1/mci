import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../../data/mci.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initDb() {
  const db = getDb();

  db.exec(`
    -- Users (admin/staff login)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Instructors
    CREATE TABLE IF NOT EXISTS instructors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      bio TEXT NOT NULL DEFAULT '',
      image_url TEXT
    );

    -- Courses (aligned with MCI Prospectus structure)
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      program TEXT NOT NULL,
      level TEXT NOT NULL,
      duration TEXT NOT NULL,
      format TEXT NOT NULL DEFAULT 'Classroom',
      price REAL NOT NULL DEFAULT 0,
      overview TEXT NOT NULL DEFAULT '',
      instructor_id TEXT,
      is_published INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE SET NULL
    );

    -- Course audiences
    CREATE TABLE IF NOT EXISTS course_audiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id TEXT NOT NULL,
      audience TEXT NOT NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- Course objectives
    CREATE TABLE IF NOT EXISTS course_objectives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id TEXT NOT NULL,
      objective TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- Course prerequisites
    CREATE TABLE IF NOT EXISTS course_prerequisites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id TEXT NOT NULL,
      prerequisite TEXT NOT NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- Schedules
    CREATE TABLE IF NOT EXISTS schedules (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'Classroom',
      status TEXT NOT NULL DEFAULT 'Open',
      capacity INTEGER DEFAULT 30,
      enrolled INTEGER DEFAULT 0,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- Curriculum days
    CREATE TABLE IF NOT EXISTS curriculum_days (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id TEXT NOT NULL,
      day_title TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- Curriculum modules
    CREATE TABLE IF NOT EXISTS curriculum_modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      duration TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (day_id) REFERENCES curriculum_days(id) ON DELETE CASCADE
    );

    -- Module topics
    CREATE TABLE IF NOT EXISTS module_topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER NOT NULL,
      topic TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (module_id) REFERENCES curriculum_modules(id) ON DELETE CASCADE
    );

    -- Reviews
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      author TEXT NOT NULL,
      role TEXT NOT NULL,
      date TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      text TEXT NOT NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- Related courses (many-to-many)
    CREATE TABLE IF NOT EXISTS related_courses (
      course_id TEXT NOT NULL,
      related_course_id TEXT NOT NULL,
      PRIMARY KEY (course_id, related_course_id),
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
      FOREIGN KEY (related_course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- Contact enquiries
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Syllabus download leads
    CREATE TABLE IF NOT EXISTS syllabus_leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (course_id) REFERENCES courses(id)
    );

    -- Waitlist
    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id TEXT NOT NULL,
      email TEXT NOT NULL,
      schedule_info TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (course_id) REFERENCES courses(id)
    );

    -- Resources / articles
    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      summary TEXT NOT NULL,
      image_url TEXT
    );

    -- Testimonials
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      author TEXT NOT NULL,
      company TEXT NOT NULL
    );

    -- Partners (Supported By logos)
    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo_url TEXT,
      website_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_visible INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Legacy alias
    CREATE TABLE IF NOT EXISTS alumni_logos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL
    );
  `);

  return db;
}

import Database from 'better-sqlite3';
import path from 'path';
import { app, ipcMain } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'polyglot.db');
const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT,
    apiKey TEXT,
    modelLabel TEXT,
    sourceLang TEXT,
    targetLang TEXT,
    note TEXT,
    createdAt TEXT
  );
`);

function getConfig() {
  const rows = db.prepare('SELECT key, value FROM config').all();
  const config: any = {};
  rows.forEach((r: any) => config[r.key] = JSON.parse(r.value));
  return config;
}

function saveConfig(config: any) {
  const insert = db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)');
  for (const [key, value] of Object.entries(config)) {
    insert.run(key, JSON.stringify(value));
  }
}

function listProjects() {
  return db.prepare('SELECT * FROM projects ORDER BY createdAt DESC').all();
}

function createProject(data: any) {
  const id = Date.now().toString();
  db.prepare(`INSERT INTO projects (id, name, apiKey, modelLabel, sourceLang, targetLang, note, createdAt)
    VALUES (?,?,?,?,?,?,?,?)`).run(id, data.name, data.apiKey, data.modelLabel, data.sourceLang, data.targetLang, data.note || '', new Date().toISOString());
  return { id, ...data };
}

function deleteProject(id: string) {
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
}

export function registerStorageHandlers() {
  ipcMain.handle('storage:get-config', getConfig);
  ipcMain.handle('storage:save-config', (_, config) => saveConfig(config));
  ipcMain.handle('storage:project:list', listProjects);
  ipcMain.handle('storage:project:create', (_, data) => createProject(data));
  ipcMain.handle('storage:project:delete', (_, id) => deleteProject(id));
}
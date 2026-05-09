import Database from 'better-sqlite3';
import path from 'path';
import { app, ipcMain } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'polyglot.db');
const db = new Database(dbPath);

// 初始化数据库表
db.exec(`
  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    apiProvider TEXT NOT NULL DEFAULT '',
    apiKey TEXT NOT NULL DEFAULT '',
    modelTag TEXT NOT NULL DEFAULT '',
    sourceLang TEXT NOT NULL DEFAULT 'auto',
    targetLang TEXT NOT NULL DEFAULT 'zh-CN',
    note TEXT NOT NULL DEFAULT '',
    createdAt TEXT NOT NULL
  );
`);

// ---- 配置操作 ----
function getConfig(): Record<string, string> {
  const rows = db.prepare('SELECT key, value FROM config').all() as { key: string; value: string }[];
  const config: Record<string, string> = {};
  for (const r of rows) {
    try { config[r.key] = JSON.parse(r.value); } catch { config[r.key] = r.value; }
  }
  return config;
}

function saveConfig(config: Record<string, string>) {
  const upsert = db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)');
  const tx = db.transaction(() => {
    for (const [key, value] of Object.entries(config)) {
      upsert.run(key, JSON.stringify(value));
    }
  });
  tx();
}

// ---- 项目操作 ----
function listProjects() {
  return db.prepare('SELECT * FROM projects ORDER BY createdAt DESC').all();
}

function createProject(data: any) {
  const id = `proj_${Date.now()}`;
  db.prepare(`
    INSERT INTO projects (id, name, apiProvider, apiKey, modelTag, sourceLang, targetLang, note, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.name, data.apiProvider || '', data.apiKey || '', data.modelTag || '', data.sourceLang || 'auto', data.targetLang || 'zh-CN', data.note || '', new Date().toISOString());
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
}

function updateProject(id: string, data: any) {
  const fields: string[] = [];
  const values: any[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (['name', 'apiProvider', 'apiKey', 'modelTag', 'sourceLang', 'targetLang', 'note'].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }
  if (fields.length === 0) return;
  values.push(id);
  db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

function deleteProject(id: string) {
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
}

function getProject(id: string) {
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
}

// ---- 注册IPC ----
export function registerStorageHandlers() {
  ipcMain.handle('storage:get-config', () => getConfig());
  ipcMain.handle('storage:save-config', (_, config) => saveConfig(config));
  ipcMain.handle('storage:project:list', () => listProjects());
  ipcMain.handle('storage:project:create', (_, data) => createProject(data));
  ipcMain.handle('storage:project:get', (_, id) => getProject(id));
  ipcMain.handle('storage:project:update', (_, id, data) => updateProject(id, data));
  ipcMain.handle('storage:project:delete', (_, id) => deleteProject(id));
}

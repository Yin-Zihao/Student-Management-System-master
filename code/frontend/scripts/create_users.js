const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const users = [
  { username: 'admin', password: 'admin123', role: 'admin', name: '系统管理员' },
  { username: 'tzhang', password: 'teacher123', role: 'teacher', name: '张老师' },
  { username: 'szhang', password: 'student123', role: 'student', name: '张三' }
];

const out = users.map(u => ({
  username: u.username,
  password: crypto.createHash('sha256').update(u.password).digest('hex'),
  role: u.role,
  name: u.name
}));

const dir = path.join(__dirname, '..', 'data');
if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'users.json'), JSON.stringify(out, null, 2), 'utf8');
console.log('users.json created at', path.join(dir, 'users.json'));

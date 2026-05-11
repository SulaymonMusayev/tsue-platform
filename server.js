const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ========== RAM DATABASE (Supabase o'rniga) ==========
let users = [];
let nextId = 1;

// ========== TASKS DATA (SENING TO'LIQ MA'LUMOTLARING) ==========
const TASKS = {
  ai: {
    learn: [
      { id: 'ai-l1', level: 'basic', title: 'Python asoslari', theory: 'Python - dasturlash tili', task: 'Hello World', solution_check: 'print', starter_code: 'print("Hello")' },
      { id: 'ai-l2', level: 'basic', title: 'NumPy', theory: 'NumPy - raqamli hisoblar', task: 'O\'rtacha toping', solution_check: 'mean', starter_code: 'import numpy as np\narr = np.array([1,2,3])\nprint(arr.mean())' }
    ],
    weekly: {
      tests: [
        { q: 'Machine Learning nima?', options: ['Odamlarni o\'qitish', 'Kompyuterga ma\'lumotlardan o\'rganishni o\'rgatish', 'Dastur yozish', 'Internet tarmog\'i'], answer: 1 },
        { q: 'Python da list yaratish?', options: ['(1,2,3)', '{1,2,3}', '[1,2,3]', '<1,2,3>'], answer: 2 },
        { q: 'NumPy da massiv o\'rtachasi?', options: ['np.avg()', 'np.mean()', 'np.average()', 'np.sum()/len()'], answer: 1 }
      ],
      logic: [
        { q: '2 + 2 * 2 = ?', answer: '6' },
        { q: '10 // 3 = ?', answer: '3' }
      ],
      coding: [
        { q: 'Fibonacci ketma-ketligi', check: 'fib', starter: 'def fib(n):\n    if n<=1: return n\n    return fib(n-1)+fib(n-2)\nprint(fib(10))' }
      ]
    }
  },
  security: {
    learn: [
      { id: 'sec-l1', level: 'basic', title: 'Kriptografiya', theory: 'Ma\'lumotni shifrlash', task: 'Hash hisoblash', solution_check: 'hashlib', starter_code: 'import hashlib\nprint(hashlib.sha256(b"test").hexdigest())' }
    ],
    weekly: {
      tests: [
        { q: 'SQL Injection nima?', options: ['Ma\'lumot bazasiga hujum', 'Virus', 'Tarmoq hujumi', 'Phishing'], answer: 0 },
        { q: 'HTTPS da S nima?', options: ['Secure', 'Speed', 'Server', 'System'], answer: 0 }
      ],
      logic: [
        { q: 'HTTP port?', answer: '80' },
        { q: 'HTTPS port?', answer: '443' }
      ],
      coding: [
        { q: 'SHA256 hash', check: 'hashlib', starter: 'import hashlib\nprint(hashlib.sha256(b"TSUE").hexdigest())' }
      ]
    }
  },
  statistics: {
    learn: [
      { id: 'stat-l1', level: 'basic', title: 'Statistika', theory: 'O\'rtacha, mediana, moda', task: 'O\'rtacha toping', solution_check: 'mean', starter_code: 'import statistics\ndata = [10,20,30]\nprint(statistics.mean(data))' }
    ],
    weekly: {
      tests: [
        { q: 'O\'rtacha qanday topiladi?', options: ['Sum/n', 'Max-min', 'O\'rtadagi', 'Eng ko\'p'], answer: 0 },
        { q: 'Mediana nima?', options: ['O\'rtacha', 'O\'rtadagi qiymat', 'Eng katta', 'Eng kichik'], answer: 1 }
      ],
      logic: [
        { q: '[1,2,3,4,5] o\'rtachasi?', answer: '3' }
      ],
      coding: [
        { q: 'statistics.mean()', check: 'mean', starter: 'import statistics\ndata = [5,10,15]\nprint(statistics.mean(data))' }
      ]
    }
  }
};

// ========== AUTH ROUTES (Supabase o'rniga RAM) ==========
app.post('/api/register', async (req, res) => {
  try {
    const { name, surname, password } = req.body;
    if (!name || !surname || !password) return res.status(400).json({ error: 'Barcha maydonlarni toldiring' });
    if (password.length < 6) return res.status(400).json({ error: 'Parol kamida 6 belgi' });
    if (users.find(u => u.name === name && u.surname === surname)) return res.status(400).json({ error: 'Foydalanuvchi mavjud' });
    
    const hashed = await bcrypt.hash(password, 10);
    const newUser = { id: nextId++, name, surname, password: hashed, icon: '😊', direction: null, scores: {} };
    users.push(newUser);
    res.json({ success: true, user: { id: newUser.id, name, surname, icon: newUser.icon, direction: newUser.direction, scores: newUser.scores } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/login', async (req, res) => {
  try {
    const { name, surname, password } = req.body;
    const user = users.find(u => u.name === name && u.surname === surname);
    if (!user) return res.status(401).json({ error: 'Foydalanuvchi topilmadi' });
    if (!(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Parol notogri' });
    res.json({ success: true, user: { id: user.id, name, surname, icon: user.icon, direction: user.direction, scores: user.scores } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/user/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: 'Topilmadi' });
  res.json({ id: user.id, name: user.name, surname: user.surname, icon: user.icon, direction: user.direction, scores: user.scores });
});

app.post('/api/update-profile', (req, res) => {
  const { userId, icon, direction } = req.body;
  const user = users.find(u => u.id == userId);
  if (!user) return res.status(404).json({ error: 'Topilmadi' });
  if (icon) user.icon = icon;
  if (direction) user.direction = direction;
  res.json({ success: true, user });
});

app.post('/api/save-score', (req, res) => {
  const { userId, scoreType, score, week } = req.body;
  const user = users.find(u => u.id == userId);
  if (!user) return res.status(404).json({ error: 'Topilmadi' });
  if (!user.scores) user.scores = {};
  const key = week ? `${scoreType}_week${week}` : scoreType;
  user.scores[key] = Math.max(user.scores[key] || 0, score || 0);
  res.json({ success: true });
});

// ========== TASKS ROUTES ==========
app.get('/api/tasks/:direction', (req, res) => {
  const dir = req.params.direction;
  res.json(TASKS[dir] || { learn: [], weekly: { tests: [], logic: [], coding: [] } });
});

app.post('/api/submit-code', (req, res) => {
  const { code, check } = req.body;
  const passed = code && code.includes(check);
  res.json({ success: passed, message: passed ? '✅ Togri' : '❌ Xato' });
});

app.get('/api/ranking', (req, res) => {
  const week = parseInt(req.query.week) || 1;
  const ranking = users.map(u => ({ ...u, weeklyScore: (u.scores?.[`test_week${week}`] || 0) + (u.scores?.[`logic_week${week}`] || 0) + (u.scores?.[`code_week${week}`] || 0) })).filter(u => u.weeklyScore > 0).sort((a, b) => b.weeklyScore - a.weeklyScore);
  res.json(ranking);
});

// ========== AI CHAT ==========
app.post('/api/ai-chat', (req, res) => {
  res.json({ reply: 'AI chat hozircha faqat frontend orqali ishlaydi. Tez orada qoshamiz.' });
});

// ========== HEALTH ==========
app.get('/health', (_, res) => res.json({ status: 'ok', users: users.length }));
app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard', (_, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT} da ishlayapti, ${users.length} foydalanuvchi`));

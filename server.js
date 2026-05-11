const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// RAM DATABASE (Supabase kerak emas)
let users = [];
let nextId = 1;

// ========== AUTH ==========
app.post('/api/register', async (req, res) => {
  try {
    const { name, surname, password } = req.body;
    if (!name || !surname || !password) return res.status(400).json({ error: 'Barcha maydonlarni toldiring' });
    if (password.length < 6) return res.status(400).json({ error: 'Parol kamida 6 belgi' });
    if (users.find(u => u.name === name && u.surname === surname)) return res.status(400).json({ error: 'Foydalanuvchi mavjud' });
    
    const hashed = await bcrypt.hash(password, 10);
    const newUser = { id: nextId++, name, surname, password: hashed, icon: '😊', direction: null, scores: {} };
    users.push(newUser);
    res.json({ success: true, user: { id: newUser.id, name, surname, icon: '😊', direction: null, scores: {} } });
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

// ========== TASKS (avvalgi TASKS ma'lumotlaringizni shu yerga qaytaring) ==========
const TASKS = {
  ai: {
    learn: [
      { id: 'ai-l1', level: 'basic', title: 'Python asoslari', theory: 'Python dasturlash tili', task: 'Hello World', solution_check: 'print', starter_code: 'print("Hello")' }
    ],
    weekly: {
      tests: [{ q: 'Python ozgaruvchi', options: ['var', 'let', 'hech narsa', 'dim'], answer: 2 }],
      logic: [{ q: '2+2', answer: '4' }],
      coding: [{ q: 'print', check: 'print', starter: '# kod' }]
    }
  },
  security: { learn: [], weekly: { tests: [], logic: [], coding: [] } },
  statistics: { learn: [], weekly: { tests: [], logic: [], coding: [] } }
};

app.get('/api/tasks/:direction', (req, res) => {
  res.json(TASKS[req.params.direction] || { learn: [], weekly: { tests: [], logic: [], coding: [] } });
});

app.post('/api/submit-code', (req, res) => {
  const { code, check } = req.body;
  res.json({ success: code && code.includes(check), message: code && code.includes(check) ? '✅ Togri' : '❌ Xato' });
});

app.get('/api/ranking', (req, res) => {
  const week = parseInt(req.query.week) || 1;
  const ranking = users.map(u => ({ ...u, weeklyScore: (u.scores?.[`test_week${week}`] || 0) + (u.scores?.[`logic_week${week}`] || 0) + (u.scores?.[`code_week${week}`] || 0) })).filter(u => u.weeklyScore > 0).sort((a, b) => b.weeklyScore - a.weeklyScore);
  res.json(ranking);
});

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard', (_, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT} da ishlayapti`));

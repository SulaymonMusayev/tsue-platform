const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static('public'));

let users = [];
let nextId = 1;

// ========== USERS ==========
app.post('/api/register', (req, res) => {
    const { name, surname, password } = req.body;
    if (!name || !surname || !password) 
        return res.status(400).json({ error: "Hamma maydonni to'ldir" });
    if (users.find(u => u.name === name && u.surname === surname))
        return res.status(400).json({ error: "Bu foydalanuvchi bor" });
    users.push({ id: nextId++, name, surname, password, icon: '😊', direction: null, scores: {} });
    res.json({ success: true, user: { id: nextId-1, name, surname } });
});

app.post('/api/login', (req, res) => {
    const { name, surname, password } = req.body;
    const user = users.find(u => u.name === name && u.surname === surname);
    if (!user) return res.status(400).json({ error: "Topilmadi" });
    if (user.password !== password) return res.status(400).json({ error: "Parol xato" });
    res.json({ success: true, user: { id: user.id, name, surname, icon: user.icon, direction: user.direction } });
});

app.get('/api/user/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) return res.status(400).json({ error: "Topilmadi" });
    res.json({ success: true, user });
});

app.post('/api/update-profile', (req, res) => {
    const { userId, icon, direction } = req.body;
    const user = users.find(u => u.id == userId);
    if (!user) return res.status(400).json({ error: "Topilmadi" });
    if (icon) user.icon = icon;
    if (direction) user.direction = direction;
    res.json({ success: true, user });
});

app.post('/api/save-score', (req, res) => {
    const { userId, taskId, score } = req.body;
    const user = users.find(u => u.id == userId);
    if (!user) return res.status(400).json({ error: "Topilmadi" });
    if (!user.scores) user.scores = {};
    user.scores[taskId] = score;
    res.json({ success: true });
});

app.get('/api/ranking', (req, res) => {
    const ranking = users.map(u => ({
        id: u.id,
        name: `${u.name} ${u.surname}`,
        icon: u.icon,
        total: Object.values(u.scores || {}).reduce((a,b) => a + b, 0)
    })).sort((a,b) => b.total - a.total);
    res.json(ranking);
});

// ========== SUBMIT CODE API (MUHIM) ==========
app.post('/api/submit-code', (req, res) => {
    const { userId, taskId, userCode, expectedKeyword, points } = req.body;
    const user = users.find(u => u.id == userId);
    if (!user) return res.status(400).json({ error: "Foydalanuvchi topilmadi" });
    
    const isCorrect = userCode.toLowerCase().includes(expectedKeyword.toLowerCase());
    
    if (isCorrect) {
        if (!user.scores) user.scores = {};
        if (!user.scores[taskId] || user.scores[taskId] < points) {
            user.scores[taskId] = points;
        }
        return res.json({ success: true, message: `✅ To‘g‘ri! +${points} ball`, points: points });
    } else {
        return res.json({ success: false, message: `❌ Xato! To‘g‘ri javobda: "${expectedKeyword}" bo‘lishi kerak` });
    }
});

// ========== TASKS ==========
const tasksData = {
    'suniy intellekt': {
        name: 'Suniy Intellekt',
        tasks: [
            { id: 'ai1', type: 'test', title: 'Python o\'zgaruvchi', question: 'Python da o\'zgaruvchi e\'lon qilish uchun?', options: ['var', 'let', 'hech qanday', 'dim'], answer: 'hech qanday', points: 10 },
            { id: 'ai2', type: 'code', title: 'Faktorial', question: 'n faktorial hisoblaydigan funksiya yozing', solution: 'return n * factorial(n-1)', points: 20 },
            { id: 'ai3', type: 'code', title: 'Fibonacci', question: 'Fibonacci sonlarini qaytaruvchi funksiya', solution: 'fibonacci', points: 20 },
            { id: 'ai4', type: 'code', title: 'List teskari', question: 'List ni teskari qaytaruvchi funksiya', solution: 'reverse', points: 20 }
        ]
    },
    'axborot xavfsizligi': {
        name: 'Axborot Xavfsizligi',
        tasks: [
            { id: 'sec1', type: 'test', title: 'Kali Linux', question: 'Kali Linux qaysi asosda?', options: ['Ubuntu', 'Debian', 'RedHat'], answer: 'Debian', points: 10 },
            { id: 'sec2', type: 'code', title: 'Caesar shifri', question: 'Caesar shifri uchun kod', solution: 'chr(ord(c)+3)', points: 20 }
        ]
    },
    'statistika': {
        name: 'Statistika',
        tasks: [
            { id: 'stat1', type: 'test', title: 'O\'rtacha', question: 'O\'rtacha qanday topiladi?', options: ['Sum/n', 'Max-min'], answer: 'Sum/n', points: 10 },
            { id: 'stat2', type: 'code', title: 'O\'rtacha', question: 'Listning o\'rtacha qiymatini hisoblang', solution: 'sum(lst)/len(lst)', points: 20 }
        ]
    }
};

app.get('/api/tasks/:direction', (req, res) => {
    const dir = req.params.direction;
    if (tasksData[dir]) res.json(tasksData[dir].tasks);
    else res.json([]);
});

app.listen(PORT, () => console.log(`Server ${PORT} da ishga tushdi`));

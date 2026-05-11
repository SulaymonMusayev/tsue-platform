const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// RAM database
let users = [];
let nextId = 1;

// ========== TO'LIQ TASKS (AI, SECURITY, STATISTICS) ==========
const TASKS = {
  ai: {
    learn: [
      { id: 'ai-l1', level: 'basic', title: 'Python asoslari', theory: 'Python - sun\'iy intellektda eng ko\'p ishlatiladigan til.', task: '1 dan 10 gacha yig\'indini hisoblang', solution_check: 'sum', starter_code: 'def hisoblash():\n    return sum(range(1,11))\n\nprint(hisoblash())' },
      { id: 'ai-l2', level: 'basic', title: 'NumPy bilan ishlash', theory: 'NumPy - raqamli hisoblashlar uchun kutubxona.', task: '[10,20,30,40,50] o\'rtachasini toping', solution_check: 'mean', starter_code: 'import numpy as np\nmas = np.array([10,20,30,40,50])\nprint(mas.mean())' },
      { id: 'ai-l3', level: 'junior', title: 'Linear Regression', theory: 'Eng oddiy ML algoritmi.', task: 'sklearn bilan bashorat qiling', solution_check: 'predict', starter_code: 'from sklearn.linear_model import LinearRegression\nimport numpy as np\nX = np.array([[1],[2],[3],[4],[5]])\ny = np.array([3,6,9,12,15])\nmodel = LinearRegression()\nmodel.fit(X,y)\nprint(model.predict([[6]]))' }
    ],
    weekly: {
      tests: [
        { q: 'Machine Learning nima?', options: ['Odamlarni o\'qitish', 'Kompyuterga ma\'lumotlardan o\'rganishni o\'rgatish', 'Dastur yozish', 'Internet tarmog\'i'], answer: 1 },
        { q: 'Supervised Learning da nima kerak?', options: ['Faqat X', 'X va y (label)', 'Faqat y', 'Hech narsa'], answer: 1 },
        { q: 'Overfitting nima?', options: ['Model yaxshi ishlaydi', 'Model train dataga moslashib, yangi datada yomon', 'Model ishlamaydi', 'Data ko\'p'], answer: 1 },
        { q: 'CNN qayerda ishlatiladi?', options: ['Matn tahlili', 'Tasvirni aniqlash', 'Audio tahlil', 'Reyting'], answer: 1 },
        { q: 'Python da list yaratish:', options: ['(1,2,3)', '{1,2,3}', '[1,2,3]', '<1,2,3>'], answer: 2 },
        { q: 'NumPy da o\'rtacha:', options: ['np.avg()', 'np.mean()', 'np.average()', 'np.sum()/len()'], answer: 1 },
        { q: 'Random Forest nima?', options: ['Bitta decision tree', 'Ko\'p decision tree lardan iborat ensemble', 'Neural network', 'Clustering'], answer: 1 },
        { q: 'Gradient Descent maqsadi?', options: ['Data tozalash', 'Loss minimallashtirish', 'Model tezligi', 'Data augmentation'], answer: 1 },
        { q: 'NLP nima?', options: ['Natural Language Processing', 'Neural Learning Protocol', 'Numeric Linear Programming', 'Network Layer Protocol'], answer: 0 },
        { q: 'Keras qaysi ustida ishlaydi?', options: ['PyTorch', 'TensorFlow', 'NumPy', 'Scikit-learn'], answer: 1 },
        { q: 'Classification va Regression farqi?', options: ['Farqi yo\'q', 'Classification kategoric, Regression sonli', 'Regression tezroq', 'Classification unsupervised'], answer: 1 },
        { q: 'Cross-validation nima uchun?', options: ['Modelni tezlashtirish', 'Bias kamaytirish', 'Data ko\'paytirish', 'GPU dan foydalanish'], answer: 1 },
        { q: 'Activation function vazifasi?', options: ['Data saqlash', 'Chiziqsizlik kiritish', 'Learning rate', 'Weights init'], answer: 1 },
        { q: 'Confusion matrix nima?', options: ['Model arxitekturasi', 'Klasifikatsiya natijalari jadvali', 'Loss funksiyasi', 'Optimizer'], answer: 1 },
        { q: 'Feature scaling nima uchun?', options: ['Data tozalash', 'Xususiyatlarni normallashtirish', 'Model saqlash', 'Grafik chizish'], answer: 1 },
        { q: 'LSTM qayerda ishlatiladi?', options: ['Tasvirda', 'Ketma-ket ma\'lumot', 'Audio', 'Video'], answer: 1 },
        { q: 'Dropout nima?', options: ['Data o\'chirish', 'Neyronlarni tasodifiy o\'chirish (overfitting oldini olish)', 'Model kompressiya', 'Batch norm'], answer: 1 },
        { q: 'Transfer Learning nima?', options: ['Data uzatish', 'Oldindan o\'qitilgan modelni moslashtirish', 'Cloud computing', 'Model export'], answer: 1 },
        { q: 'K-means nima?', options: ['Supervised', 'Unsupervised clustering', 'Regression', 'Neural network'], answer: 1 },
        { q: 'Precision va Recall farqi?', options: ['Bir xil', 'Precision to\'g\'ri pozitivlar, Recall haqiqiy pozitivlar', 'Binary uchun', 'Loss funksiyasi'], answer: 1 }
      ],
      logic: [
        { q: 'Agar model 95% train accuracy va 60% test accuracy ko\'rsatsa, muammo nima?', answer: 'overfitting' },
        { q: '1000 ta ma\'lumotdan 800 ta train, 200 ta test?', answer: '80/20' },
        { q: 'Learning rate juda katta bo\'lsa?', answer: 'converge' },
        { q: 'Feature importance nima uchun?', answer: 'muhim' },
        { q: 'Bias-variance tradeoff optimal nuqta?', answer: 'muvozanat' }
      ],
      coding: [
        { q: 'Fibonacci (n=10) hisoblang', check: 'fib', starter: 'def fibonacci(n):\n    if n<=1: return n\n    return fibonacci(n-1)+fibonacci(n-2)\nprint(fibonacci(10))' },
        { q: 'Juft sonlarni filtrlang: [1..10]', check: 'filter', starter: 'numbers = [1,2,3,4,5,6,7,8,9,10]\njuft = [x for x in numbers if x%2==0]\nprint(juft)' },
        { q: 'Dictionary yarating (3 ta talaba)', check: 'dict', starter: 'students = {"Ali":85, "Vali":92, "Hasan":78}\nprint(students)' },
        { q: 'Matnni teskari aylantiring', check: 'reverse', starter: 'def teskari(matn):\n    return matn[::-1]\nprint(teskari("TSUE"))' },
        { q: 'Bubble sort yozing', check: 'sort', starter: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\nprint(bubble_sort([5,3,8,1,9,2]))' }
      ]
    }
  },
  security: {
    learn: [
      { id: 'sec-l1', level: 'basic', title: 'Kriptografiya asoslari', theory: 'Ma\'lumotni himoya qilish fani.', task: 'SHA-256 hash hisoblang', solution_check: 'hashlib', starter_code: 'import hashlib\ntext = "TSUE2024"\nhash_val = hashlib.sha256(text.encode()).hexdigest()\nprint(hash_val)' },
      { id: 'sec-l2', level: 'basic', title: 'SQL Injection', theory: 'Eng keng tarqalgan web hujum.', task: 'Zaif so\'rovni himoyalang', solution_check: '%s', starter_code: '# Zaif: query = f"SELECT * FROM users WHERE name={user}"\n# Himoyalangan: query = "SELECT * FROM users WHERE name=%s"' }
    ],
    weekly: {
      tests: [
        { q: 'CIA Triad?', options: ['Confidentiality,Integrity,Availability', 'Control,Inspect,Audit', 'Cyber,Internet,Application', 'Certificate,Identity,Auth'], answer: 0 },
        { q: 'Phishing nima?', options: ['Virus', 'Aldov orqali ma\'lumot o\'g\'irlash', 'Tarmoq hujumi', 'DDoS'], answer: 1 },
        { q: 'HTTPS da "S"?', options: ['Speed', 'Secure', 'Server', 'System'], answer: 1 },
        { q: 'Firewall vazifasi?', options: ['Tezlashtirish', 'Trafik filtrlash', 'Parol saqlash', 'Email'], answer: 1 },
        { q: 'DDoS nima?', options: ['Parol buzish', 'Serverga katta trafik yuborish', 'Virus', 'Data o\'chirish'], answer: 1 },
        { q: 'Encryption vs Hashing?', options: ['Farqi yo\'q', 'Encryption qaytariladi, Hashing bir tomonlama', 'Hashing tezroq', 'Encryption bepul'], answer: 1 },
        { q: 'Zero-day zaiflik?', options: ['Yangi topilgan, yamalmagan', 'Eski zaiflik', 'Foydalanuvchi xatosi', 'Server muammosi'], answer: 0 },
        { q: 'VPN nima uchun?', options: ['Tezlashtirish', 'Xavfsiz va shifrlangan ulanish', 'Virus tozalash', 'Parol yaratish'], answer: 1 },
        { q: 'Man-in-the-Middle?', options: ['Serverga hujum', 'Ikki tomon orasiga kirib ma\'lumot o\'g\'irlash', 'Parol buzish', 'DDoS'], answer: 1 },
        { q: 'SHA-256 nima?', options: ['Shifrlash', 'Hash funksiyasi', 'Parol generatori', 'SSL'], answer: 1 }
      ],
      logic: [
        { q: 'Parol "password123" zaifligi?', answer: 'keng' },
        { q: 'HTTP vs HTTPS farqi?', answer: 'shifrlash' },
        { q: 'USB ga ma\'lumot ko\'chirish?', answer: 'insider' },
        { q: 'Server 500 xato?', answer: 'ma\'lumot' },
        { q: '2FA necha omil?', answer: '2' }
      ],
      coding: [
        { q: 'Parol kuchliligini tekshirish', check: 'len', starter: 'def check_password(p):\n    return len(p)>=8 and any(c.isdigit() for c in p) and any(c.isalpha() for c in p)\nprint(check_password("Test@123"))' },
        { q: 'Base64 encode/decode', check: 'base64', starter: 'import base64\ntext = "Hello TSUE"\nencoded = base64.b64encode(text.encode())\nprint(encoded)\ndecoded = base64.b64decode(encoded)\nprint(decoded.decode())' }
      ]
    }
  },
  statistics: {
    learn: [
      { id: 'stat-l1', level: 'basic', title: 'Statistika asoslari', theory: 'Ma\'lumotlarni tahlil qilish.', task: 'O\'rtacha, mediana, moda', solution_check: 'statistics', starter_code: 'import statistics\ndata = [10,20,30,40,50,20,30]\nprint("O\'rtacha:", statistics.mean(data))\nprint("Mediana:", statistics.median(data))\nprint("Moda:", statistics.mode(data))' }
    ],
    weekly: {
      tests: [
        { q: 'O\'rtacha qanday hisoblanadi?', options: ['Sum/n', 'Max-min', 'O\'rtadagi', 'Eng ko\'p'], answer: 0 },
        { q: 'Mediana nima?', options: ['O\'rtacha', 'Saralangan qatordagi o\'rtadagi qiymat', 'Eng katta', 'Eng kichik'], answer: 1 },
        { q: 'Standart og\'ish nimani ko\'rsatadi?', options: ['O\'rtacha', 'Tarqoqlik', 'Maksimal', 'Minimal'], answer: 1 },
        { q: 'Korrelyatsiya oralig\'i?', options: ['0 dan 1', '-1 dan 1', '-∞ dan +∞', '0 dan 100'], answer: 1 },
        { q: 'Normal taqsimot grafigi?', options: ['To\'g\'ri chiziq', 'Qo\'ng\'iroq shakli', 'U shakli', 'Zig-zag'], answer: 1 }
      ],
      logic: [
        { q: 'O\'rtacha 70, mediana 65?', answer: 'o\'ng' },
        { q: 'Korrelyatsiya 0.95?', answer: 'kuchli' },
        { q: 'Standart og\'ish 0?', answer: 'bir xil' }
      ],
      coding: [
        { q: 'Pandas describe()', check: 'describe', starter: 'import pandas as pd\ndf = pd.DataFrame({"ball":[85,92,78,88,95]})\nprint(df.describe())' },
        { q: 'Korrelyatsiya hisoblash', check: 'corrcoef', starter: 'import numpy as np\nx=[2,4,6,8,10]\ny=[1,3,7,9,11]\nprint(np.corrcoef(x,y)[0,1])' }
      ]
    }
  }
};

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
  res.json({ success: passed, message: passed ? '✅ Togri' : `❌ "${check}" kerak` });
});

app.get('/api/ranking', (req, res) => {
  const week = parseInt(req.query.week) || 1;
  const ranking = users.map(u => ({ ...u, weeklyScore: (u.scores?.[`test_week${week}`] || 0) + (u.scores?.[`logic_week${week}`] || 0) + (u.scores?.[`code_week${week}`] || 0) })).filter(u => u.weeklyScore > 0).sort((a, b) => b.weeklyScore - a.weeklyScore);
  res.json(ranking);
});

app.post('/api/ai-chat', (req, res) => {
  res.json({ reply: 'AI chat hozircha faqat frontend orqali ishlaydi.' });
});

app.get('/health', (_, res) => res.json({ status: 'ok', users: users.length }));
app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard', (_, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT} da ishlayapti, ${users.length} foydalanuvchi`));

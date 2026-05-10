const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static('public'));

let users = [];
let nextId = 1;
let tasks = [];

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
    user.scores[taskId] = score;
    res.json({ success: true });
});

app.get('/api/ranking', (req, res) => {
    const ranking = users.map(u => ({
        id: u.id,
        name: `${u.name} ${u.surname}`,
        icon: u.icon,
        total: Object.values(u.scores).reduce((a,b) => a + b, 0)
    })).sort((a,b) => b.total - a.total);
    res.json(ranking);
});

// ========== TASKS (15 ta, 10 test + 5 coding) ==========
const tasksData = {
    'suniy intellekt': {
        name: 'Suniy Intellekt',
        tasks: [
            { id: 'ai1', type: 'test', title: 'Python da o\'zgaruvchi', question: 'Python da o\'zgaruvchi e\'lon qilish uchun qaysi kalit so\'z ishlatiladi?', options: ['var', 'let', 'hech qanday', 'dim'], answer: 'hech qanday', points: 10 },
            { id: 'ai2', type: 'test', title: 'List ga element qo\'shish', question: 'Python list ga element qo\'shish uchun qaysi metod ishlatiladi?', options: ['push()', 'append()', 'add()', 'insert()'], answer: 'append()', points: 10 },
            { id: 'ai3', type: 'test', title: 'NumPy kutubxonasi', question: 'NumPy da array yaratish uchun qaysi funksiya ishlatiladi?', options: ['array()', 'list()', 'create()', 'ndarray()'], answer: 'array()', points: 10 },
            { id: 'ai4', type: 'test', title: 'Pandas Series', question: 'Pandas da 1D ma\'lumotlar uchun qaysi struktura ishlatiladi?', options: ['DataFrame', 'Series', 'Array', 'List'], answer: 'Series', points: 10 },
            { id: 'ai5', type: 'test', title: 'TensorFlow', question: 'TensorFlow qaysi kompaniya tomonidan yaratilgan?', options: ['Google', 'Facebook', 'Microsoft', 'Amazon'], answer: 'Google', points: 10 },
            { id: 'ai6', type: 'test', title: 'Machine Learning turlari', question: 'Qaysi biri nazoratli o\'qitish emas?', options: ['Regression', 'Classification', 'Clustering', 'Decision Tree'], answer: 'Clustering', points: 10 },
            { id: 'ai7', type: 'test', title: 'Overfitting', question: 'Overfitting nimani anglatadi?', options: ['Model yaxshi o\'rganmagan', 'Model juda yaxshi o\'rgangan', 'Model testda yomon ishlaydi', 'Model tez ishlaydi'], answer: 'Model testda yomon ishlaydi', points: 10 },
            { id: 'ai8', type: 'test', title: 'Activation function', question: 'Keng tarqalgan activation funksiya?', options: ['Sigmoid', 'ReLU', 'Tanh', 'Hammasi'], answer: 'Hammasi', points: 10 },
            { id: 'ai9', type: 'test', title: 'CNN', question: 'CNN qayerda ko\'p ishlatiladi?', options: ['Rasm tanish', 'Matn tahlili', 'Ovoz tahlili', 'Hammasi'], answer: 'Rasm tanish', points: 10 },
            { id: 'ai10', type: 'test', title: 'RNN', question: 'RNN qayerda ko\'p ishlatiladi?', options: ['Rasm', 'Video', 'Ketma-ket ma\'lumot', 'Audio'], answer: 'Ketma-ket ma\'lumot', points: 10 },
            { id: 'ai11', type: 'code', title: 'Faktorial', question: 'n faktorial hisoblaydigan funksiya yozing', starter: 'def factorial(n):\n    pass', solution: 'def factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n-1)', points: 20 },
            { id: 'ai12', type: 'code', title: 'Fibonacci', question: 'Fibonacci sonlarini qaytaruvchi funksiya yozing', starter: 'def fibonacci(n):\n    pass', solution: 'def fibonacci(n):\n    a,b = 0,1\n    for _ in range(n):\n        a,b = b,a+b\n    return a', points: 20 },
            { id: 'ai13', type: 'code', title: 'List teskari', question: 'List ni teskari qaytaruvchi funksiya yozing', starter: 'def reverse_list(lst):\n    pass', solution: 'def reverse_list(lst):\n    return lst[::-1]', points: 20 },
            { id: 'ai14', type: 'code', title: 'Toq sonlar', question: 'Berilgan list dan toq sonlarni qaytaruvchi funksiya', starter: 'def odd_numbers(lst):\n    pass', solution: 'def odd_numbers(lst):\n    return [x for x in lst if x%2==1]', points: 20 },
            { id: 'ai15', type: 'code', title: 'So\'zni teskari', question: 'So\'zni teskari qaytaruvchi funksiya', starter: 'def reverse_word(word):\n    pass', solution: 'def reverse_word(word):\n    return word[::-1]', points: 20 }
        ]
    },
    'axborot xavfsizligi': {
        name: 'Axborot Xavfsizligi',
        tasks: [
            { id: 'sec1', type: 'test', title: 'Kali Linux', question: 'Kali Linux qaysi distributiv asosida qurilgan?', options: ['Ubuntu', 'Debian', 'RedHat', 'Arch'], answer: 'Debian', points: 10 },
            { id: 'sec2', type: 'test', title: 'Kriptografiya', question: 'Simmetrik kriptografiyada bir xil kalit...', options: ['Shifrlash va deshifrlash uchun', 'Faqat shifrlash uchun', 'Faqat deshifrlash uchun', 'Hech biri'], answer: 'Shifrlash va deshifrlash uchun', points: 10 },
            { id: 'sec3', type: 'test', title: 'SSL', question: 'SSL nima?', options: ['Protokol', 'Sertifikat', 'Kalit', 'Firewall'], answer: 'Protokol', points: 10 },
            { id: 'sec4', type: 'test', title: 'SQL Injection', question: 'SQL Injection qaysi turdagi hujum?', options: ['XSS', 'CSRF', 'Injection', 'DDoS'], answer: 'Injection', points: 10 },
            { id: 'sec5', type: 'test', title: 'Port 80', question: 'Port 80 qaysi protokol uchun?', options: ['HTTPS', 'HTTP', 'SSH', 'FTP'], answer: 'HTTP', points: 10 },
            { id: 'sec6', type: 'test', title: 'VPN', question: 'VPN nima?', options: ['Virtual Private Network', 'Virtual Public Network', 'Very Private Network', 'Hech biri'], answer: 'Virtual Private Network', points: 10 },
            { id: 'sec7', type: 'test', title: 'Brute force', question: 'Brute force hujum nimani anglatadi?', options: ['Parol taxmin qilish', 'Tarmoqni to\'xtatish', 'Virus yoyish', 'Xatolik topish'], answer: 'Parol taxmin qilish', points: 10 },
            { id: 'sec8', type: 'test', title: 'Phishing', question: 'Phishing qanday hujum?', options: ['Muloqot orqali', 'Parol o\'g\'irlash', 'Virus tarqatish', 'Tarmoqni yuklash'], answer: 'Parol o\'g\'irlash', points: 10 },
            { id: 'sec9', type: 'test', title: 'Firewall', question: 'Firewall vazifasi?', options: ['Trafikni filtrlash', 'Parol saqlash', 'Virusni o\'chirish', 'Ma\'lumotni shifrlash'], answer: 'Trafikni filtrlash', points: 10 },
            { id: 'sec10', type: 'test', title: '2FA', question: '2FA nima?', options: ['Ikki faktorli autentifikatsiya', 'Ikki fayl arxivi', 'Ikkinchi fayl', 'Hech biri'], answer: 'Ikki faktorli autentifikatsiya', points: 10 },
            { id: 'sec11', type: 'code', title: 'Shifrlash', question: 'Caesar shifri: har bir harfni 3 ga suring', starter: 'def caesar_encrypt(text):\n    pass', solution: 'def caesar_encrypt(text):\n    return "".join(chr(ord(c)+3) for c in text)', points: 20 },
            { id: 'sec12', type: 'code', title: 'Parol kuchi', question: 'Parol uzunligi >=8 va raqam borligini tekshiring', starter: 'def is_strong(password):\n    pass', solution: 'def is_strong(password):\n    return len(password)>=8 and any(c.isdigit() for c in password)', points: 20 },
            { id: 'sec13', type: 'code', title: 'XOR shifrlash', question: 'XOR shifri', starter: 'def xor_encrypt(text, key):\n    pass', solution: 'def xor_encrypt(text, key):\n    return "".join(chr(ord(c)^ord(key[i%len(key)])) for i,c in enumerate(text))', points: 20 },
            { id: 'sec14', type: 'code', title: 'Hash', question: 'SHA-256 hash funksiyasi (simulyatsiya)', starter: 'def simple_hash(text):\n    pass', solution: 'def simple_hash(text):\n    return str(sum(ord(c) for c in text))', points: 20 },
            { id: 'sec15', type: 'code', title: 'Base64', question: 'Base64 shifrlash (simulyatsiya)', starter: 'def to_base64(text):\n    pass', solution: 'def to_base64(text):\n    import base64\n    return base64.b64encode(text.encode()).decode()', points: 20 }
        ]
    },
    'statistika': {
        name: 'Statistika',
        tasks: [
            { id: 'stat1', type: 'test', title: 'O\'rtacha', question: 'O\'rtacha qiymat qanday topiladi?', options: ['Sum/n', 'Max-min', 'Median', 'Mode'], answer: 'Sum/n', points: 10 },
            { id: 'stat2', type: 'test', title: 'Median', question: 'Median nima?', options: ['O\'rta qiymat', 'Eng ko\'p takrorlangan', 'Eng kichik', 'Eng katta'], answer: 'O\'rta qiymat', points: 10 },
            { id: 'stat3', type: 'test', title: 'Dispersiya', question: 'Dispersiya nimani o\'lchaydi?', options: ['Tarqoqlik', 'Markaz', 'Maksimal', 'Minimal'], answer: 'Tarqoqlik', points: 10 },
            { id: 'stat4', type: 'test', title: 'Korrelyatsiya', question: 'Korrelyatsiya koeffitsienti oralig\'i?', options: ['0 dan 1', '-1 dan 1', '0 dan 100', '0 dan ∞'], answer: '-1 dan 1', points: 10 },
            { id: 'stat5', type: 'test', title: 'Pandas', question: 'Pandas da DataFrame yaratish funksiyasi?', options: ['pd.dataframe()', 'pd.DataFrame()', 'pd.DF()', 'pd.create()'], answer: 'pd.DataFrame()', points: 10 },
            { id: 'stat6', type: 'test', title: 'Matplotlib', question: 'Chizma chizish uchun qaysi funksiya?', options: ['plt.plot()', 'plt.show()', 'plt.draw()', 'plt.figure()'], answer: 'plt.plot()', points: 10 },
            { id: 'stat7', type: 'test', title: 'Normallik', question: 'Normal taqsimotda qancha ma\'lumot 1 sigma oralig\'ida?', options: ['50%', '68%', '95%', '99%'], answer: '68%', points: 10 },
            { id: 'stat8', type: 'test', title: 'Outlier', question: 'Outlier nima?', options: ['Chekka qiymat', 'O\'rtacha qiymat', 'Nol qiymat', 'Manfiy qiymat'], answer: 'Chekka qiymat', points: 10 },
            { id: 'stat9', type: 'test', title: 'Boxplot', question: 'Boxplot qanday ma\'lumotni ko\'rsatadi?', options: ['Tarqoqlik', 'Vaqt', 'Korrelyatsiya', 'Gistogramma'], answer: 'Tarqoqlik', points: 10 },
            { id: 'stat10', type: 'test', title: 'Scipy', question: 'Scipy kutubxonasi qaysi sohada ko\'p ishlatiladi?', options: ['Ilmiy hisoblar', 'Veb dasturlash', 'O\'yinlar', 'Mobil'], answer: 'Ilmiy hisoblar', points: 10 },
            { id: 'stat11', type: 'code', title: 'O\'rtacha', question: 'List ning o\'rtacha qiymatini hisoblang', starter: 'def mean(lst):\n    pass', solution: 'def mean(lst):\n    return sum(lst)/len(lst) if lst else 0', points: 20 },
            { id: 'stat12', type: 'code', title: 'Dispersiya', question: 'Dispersiyani hisoblang', starter: 'def variance(lst):\n    pass', solution: 'def variance(lst):\n    m = sum(lst)/len(lst)\n    return sum((x-m)**2 for x in lst)/len(lst)', points: 20 },
            { id: 'stat13', type: 'code', title: 'Standart og\'ish', question: 'Standart og\'ishni hisoblang', starter: 'def std(lst):\n    pass', solution: 'def std(lst):\n    m = sum(lst)/len(lst)\n    return (sum((x-m)**2 for x in lst)/len(lst))**0.5', points: 20 },
            { id: 'stat14', type: 'code', title: 'Median', question: 'Medianni toping', starter: 'def median(lst):\n    pass', solution: 'def median(lst):\n    s = sorted(lst)\n    n = len(s)\n    return (s[n//2] + s[(n-1)//2])/2', points: 20 },
            { id: 'stat15', type: 'code', title: 'Korrelyatsiya', question: 'Ikki ro\'yxat orasidagi korrelyatsiyani hisoblang', starter: 'def correlation(x,y):\n    pass', solution: 'def correlation(x,y):\n    n = len(x)\n    mx, my = sum(x)/n, sum(y)/n\n    num = sum((x[i]-mx)*(y[i]-my) for i in range(n))\n    den = (sum((xi-mx)**2 for xi in x)*sum((yi-my)**2 for yi in y))**0.5\n    return num/den if den else 0', points: 20 }
        ]
    }
};

app.get('/api/tasks/:direction', (req, res) => {
    const dir = req.params.direction;
    if (tasksData[dir]) res.json(tasksData[dir].tasks);
    else res.json([]);
});

app.listen(PORT, () => console.log(`Server ${PORT}`));

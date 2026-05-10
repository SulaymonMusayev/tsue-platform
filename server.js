const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static('public'));

// Supabase ulanish
const supabaseUrl = process.env.SUPABASE_URL || 'https://wkhhksjadusvswcpex.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ========== RO'YXATDAN O'TISH ==========
app.post('/api/register', async (req, res) => {
    const { name, surname, password } = req.body;
    if (!name || !surname || !password) {
        return res.status(400).json({ error: "Hamma maydonni to'ldir" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data, error } = await supabase
        .from('users')
        .insert([{ name, surname, password: hashedPassword, icon: '😊', direction: null, scores: {} }])
        .select();
    
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    
    res.json({ success: true, user: { id: data[0].id, name, surname } });
});

// ========== KIRISH ==========
app.post('/api/login', async (req, res) => {
    const { name, surname, password } = req.body;
    
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('name', name)
        .eq('surname', surname)
        .single();
    
    if (error || !data) {
        return res.status(400).json({ error: "Foydalanuvchi topilmadi" });
    }
    
    const valid = await bcrypt.compare(password, data.password);
    if (!valid) {
        return res.status(400).json({ error: "Parol xato" });
    }
    
    res.json({ success: true, user: { id: data.id, name: data.name, surname: data.surname, icon: data.icon, direction: data.direction } });
});

// ========== FOYDALANUVCHINI OLISH ==========
app.get('/api/user/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.params.id)
        .single();
    
    if (error) {
        return res.status(400).json({ error: "Topilmadi" });
    }
    
    res.json({ success: true, user: data });
});

// ========== PROFILNI YANGILASH ==========
app.post('/api/update-profile', async (req, res) => {
    const { userId, icon, direction } = req.body;
    
    const updateData = {};
    if (icon) updateData.icon = icon;
    if (direction) updateData.direction = direction;
    
    const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select();
    
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    
    res.json({ success: true, user: data[0] });
});

// ========== BALLARNI SAQLASH ==========
app.post('/api/save-score', async (req, res) => {
    const { userId, taskId, score } = req.body;
    
    const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('scores')
        .eq('id', userId)
        .single();
    
    if (fetchError || !user) {
        return res.status(400).json({ error: "Foydalanuvchi topilmadi" });
    }
    
    const scores = user.scores || {};
    scores[taskId] = score;
    
    const { error } = await supabase
        .from('users')
        .update({ scores })
        .eq('id', userId);
    
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    
    res.json({ success: true });
});

// ========== KOD TEKSHIRISH ==========
app.post('/api/submit-code', async (req, res) => {
    const { userId, taskId, userCode, expectedKeyword, points } = req.body;
    
    const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('scores')
        .eq('id', userId)
        .single();
    
    if (fetchError || !user) {
        return res.status(400).json({ error: "Foydalanuvchi topilmadi" });
    }
    
    const isCorrect = userCode.toLowerCase().includes(expectedKeyword.toLowerCase());
    
    if (isCorrect) {
        const scores = user.scores || {};
        if (!scores[taskId] || scores[taskId] < points) {
            scores[taskId] = points;
            await supabase.from('users').update({ scores }).eq('id', userId);
        }
        return res.json({ success: true, message: `✅ To‘g‘ri! +${points} ball`, points: points });
    } else {
        return res.json({ success: false, message: `❌ Xato! To‘g‘ri javobda: "${expectedKeyword}" bo‘lishi kerak` });
    }
});

// ========== REYTING ==========
app.get('/api/ranking', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('id, name, surname, icon, scores');
    
    if (error) {
        return res.json([]);
    }
    
    const ranking = data.map(u => ({
        id: u.id,
        name: `${u.name} ${u.surname}`,
        icon: u.icon || '😊',
        total: Object.values(u.scores || {}).reduce((a, b) => a + b, 0)
    })).sort((a, b) => b.total - a.total);
    
    res.json(ranking);
});

// ========== TASKS ==========
const tasksData = {
    'suniy intellekt': {
        tasks: [
            { id: 'ai1', type: 'test', title: 'Python o\'zgaruvchi', question: 'Python da o\'zgaruvchi e\'lon qilish uchun?', options: ['var', 'let', 'hech qanday', 'dim'], answer: 'hech qanday', points: 10 },
            { id: 'ai2', type: 'code', title: 'Faktorial', question: 'n faktorial hisoblaydigan funksiya yozing', solution: 'return n * factorial(n-1)', points: 20 },
            { id: 'ai3', type: 'code', title: 'Fibonacci', question: 'Fibonacci sonlarini qaytaruvchi funksiya yozing', solution: 'fibonacci', points: 20 },
            { id: 'ai4', type: 'code', title: 'List teskari', question: 'List ni teskari qaytaruvchi funksiya yozing', solution: 'reverse', points: 20 }
        ]
    },
    'axborot xavfsizligi': {
        tasks: [
            { id: 'sec1', type: 'test', title: 'Kali Linux', question: 'Kali Linux qaysi asosda?', options: ['Ubuntu', 'Debian', 'RedHat'], answer: 'Debian', points: 10 },
            { id: 'sec2', type: 'code', title: 'Caesar shifri', question: 'Caesar shifri uchun kod yozing', solution: 'chr(ord(c)+3)', points: 20 }
        ]
    },
    'statistika': {
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

app.listen(PORT, () => console.log(`Server ${PORT} da ishga tushdi (Supabase ulangan)`));

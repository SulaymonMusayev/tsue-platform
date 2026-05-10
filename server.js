const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static('public'));

let users = [];
let id = 1;

app.post('/api/register', (req, res) => {
    const { name, surname, password } = req.body;
    if (!name || !surname || !password) {
        return res.status(400).json({ error: "To'liq to'ldiring" });
    }
    const exists = users.find(u => u.name === name && u.surname === surname);
    if (exists) {
        return res.status(400).json({ error: "Bu odam bor" });
    }
    const newUser = { id: id++, name, surname, password };
    users.push(newUser);
    res.json({ success: true, user: { id: newUser.id, name, surname } });
});

app.post('/api/login', (req, res) => {
    const { name, surname, password } = req.body;
    const user = users.find(u => u.name === name && u.surname === surname);
    if (!user) return res.status(400).json({ error: "Topilmadi" });
    if (user.password !== password) return res.status(400).json({ error: "Parol xato" });
    res.json({ success: true, user: { id: user.id, name, surname } });
});

app.get('/api/test', (req, res) => {
    res.json({ message: "OK", users: users.length });
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} da ishga tushdi`);
});
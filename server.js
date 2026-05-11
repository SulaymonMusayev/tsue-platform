const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ SUPABASE_URL yoki SUPABASE_ANON_KEY environment variable topilmadi!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── TASKS DATA ───────────────────────────────────────────────────────────────
const TASKS = {
  ai: {
    learn: [
      {
        id: 'ai-l1', level: 'basic', title: 'Python asoslari',
        theory: `Python — sun'iy intellektda eng ko'p ishlatiladigan dasturlash tili.
O'zgaruvchilar, ro'yxatlar, sikllar va funksiyalar — ML uchun zarur asoslar.

**O'zgaruvchilar:**
\`\`\`python
x = 10
name = "TSUE"
is_student = True
\`\`\`

**Ro'yxatlar:**
\`\`\`python
scores = [95, 87, 92, 78]
print(scores[0])  # 95
\`\`\`

**Funksiyalar:**
\`\`\`python
def greet(name):
    return f"Salom, {name}!"
print(greet("Talaba"))
\`\`\``,
        task: '1 dan 10 gacha sonlarning yig\'indisini hisoblaydigan funksiya yarating.',
        solution_check: 'sum',
        starter_code: `def hisoblash():\n    # 1 dan 10 gacha yig'indi\n    total = sum(range(1, 11))\n    return total\n\nprint(hisoblash())`,
        expected_output: '55'
      },
      {
        id: 'ai-l2', level: 'basic', title: 'NumPy bilan ishlash',
        theory: `NumPy — raqamli hisoblashlar uchun Python kutubxonasi. ML algoritmlarining asosi.

**Massiv yaratish:**
\`\`\`python
import numpy as np
arr = np.array([1, 2, 3, 4, 5])
print(arr.mean())  # 3.0
print(arr.sum())   # 15
\`\`\`

**2D massiv:**
\`\`\`python
matrix = np.array([[1, 2], [3, 4]])
print(matrix.shape)  # (2, 2)
\`\`\``,
        task: 'NumPy yordamida [10, 20, 30, 40, 50] massivining o\'rtacha qiymatini toping.',
        solution_check: 'mean',
        starter_code: `import numpy as np\n\nmas = np.array([10, 20, 30, 40, 50])\nprint(mas.mean())`,
        expected_output: '30.0'
      },
      {
        id: 'ai-l3', level: 'junior', title: 'Pandas bilan ishlash',
        theory: `Pandas — ma'lumotlarni tahlil qilish uchun asosiy kutubxona.

**DataFrame:**
\`\`\`python
import pandas as pd

data = {'ism': ['Ali', 'Vali', 'Sana'],
        'ball': [85, 92, 78]}
df = pd.DataFrame(data)
print(df.describe())
\`\`\`

**Filtratsiya:**
\`\`\`python
yaxshi = df[df['ball'] > 80]
print(yaxshi)
\`\`\``,
        task: 'Pandas DataFrame yaratib, 90 dan yuqori ballga ega talabalarni filtrlang.',
        solution_check: 'DataFrame',
        starter_code: `import pandas as pd\n\ndata = {'ism': ['Ali','Vali','Hasan','Zulfiya'],'ball': [85,93,78,91]}\ndf = pd.DataFrame(data)\nyaxshi = df[df['ball'] > 90]\nprint(yaxshi)`,
        expected_output: 'DataFrame'
      },
      {
        id: 'ai-l4', level: 'junior', title: 'Linear Regression',
        theory: `Linear Regression — eng oddiy ML algoritmi. Y = mX + b formulasi asosida ishlaydi.

**sklearn bilan:**
\`\`\`python
from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[1],[2],[3],[4],[5]])
y = np.array([2, 4, 6, 8, 10])

model = LinearRegression()
model.fit(X, y)
print(model.predict([[6]]))  # [12]
\`\`\``,
        task: 'sklearn yordamida [1,2,3,4,5] -> [3,6,9,12,15] ma\'lumotlarga Linear Regression o\'rgating.',
        solution_check: 'predict',
        starter_code: `from sklearn.linear_model import LinearRegression\nimport numpy as np\n\nX = np.array([[1],[2],[3],[4],[5]])\ny = np.array([3, 6, 9, 12, 15])\n\nmodel = LinearRegression()\nmodel.fit(X, y)\nprint(model.predict([[6]]))`,
        expected_output: '18'
      },
      {
        id: 'ai-l5', level: 'middle', title: 'Neural Network (Keras)',
        theory: `Keras yordamida oddiy neyron tarmoq yaratish:

\`\`\`python
from tensorflow import keras

model = keras.Sequential([
    keras.layers.Dense(64, activation='relu', input_shape=(10,)),
    keras.layers.Dense(32, activation='relu'),
    keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy')
\`\`\``,
        task: 'Keras yordamida 2 ta Dense qatlam bilan model yarating.',
        solution_check: 'Dense',
        starter_code: `from tensorflow import keras\n\nmodel = keras.Sequential([\n    keras.layers.Dense(16, activation='relu', input_shape=(5,)),\n    keras.layers.Dense(1, activation='sigmoid')\n])\nmodel.summary()`,
        expected_output: 'model'
      }
    ],
    weekly: {
      tests: [
        { q: 'Machine Learning nima?', options: ['Odamlarni o\'qitish', 'Kompyuterga ma\'lumotlardan o\'rganishni o\'rgatish', 'Dastur yozish', 'Internet tarmog\'i'], answer: 1 },
        { q: 'Supervised Learning da nima kerak?', options: ['Faqat X ma\'lumot', 'X va y (label) ma\'lumotlar', 'Faqat y ma\'lumot', 'Hech narsa kerak emas'], answer: 1 },
        { q: 'Overfitting nima?', options: ['Model juda yaxshi ishlaydi', 'Model train dataga juda moslashib, yangi datada yomon ishlaydi', 'Model umuman ishlamaydi', 'Data ko\'p bo\'lishi'], answer: 1 },
        { q: 'CNN qaysi sohada ishlatiladi?', options: ['Matn tahlili', 'Tasvirni aniqlash', 'Audio tahlil', 'Reyting hisoblash'], answer: 1 },
        { q: 'Python da list yaratish:', options: ['list = (1,2,3)', 'list = {1,2,3}', 'list = [1,2,3]', 'list = <1,2,3>'], answer: 2 },
        { q: 'NumPy da massiv o\'rtachasi:', options: ['np.avg()', 'np.mean()', 'np.average()', 'np.sum()/len()'], answer: 1 },
        { q: 'Random Forest nima?', options: ['Bitta decision tree', 'Ko\'p decision tree lardan iborat ensemble metod', 'Neural network turi', 'Clustering algoritm'], answer: 1 },
        { q: 'Gradient Descent maqsadi:', options: ['Ma\'lumot tozalash', 'Loss funksiyasini minimallash', 'Model tezligini oshirish', 'Data augmentation'], answer: 1 },
        { q: 'NLP nima?', options: ['Natural Language Processing', 'Neural Learning Protocol', 'Numeric Linear Programming', 'Network Layer Protocol'], answer: 0 },
        { q: 'Keras qaysi ustida ishlaydi?', options: ['PyTorch', 'TensorFlow', 'NumPy', 'Scikit-learn'], answer: 1 },
        { q: 'Classification va Regression farqi:', options: ['Farqi yo\'q', 'Classification kategoric, Regression sonli natija beradi', 'Regression tezroq', 'Classification unsupervised'], answer: 1 },
        { q: 'Cross-validation nima uchun?', options: ['Modelni tezlashtirish', 'Modelni baholashda bias kamaytirish', 'Data ko\'paytirish', 'GPU dan foydalanish'], answer: 1 },
        { q: 'Activation function vazifasi:', options: ['Ma\'lumotni saqlash', 'Neyronlar orasida chiziqsizlik kiritish', 'Learning rate belgilash', 'Weights initsializatsiya'], answer: 1 },
        { q: 'Confusion matrix nima?', options: ['Model arxitekturasi', 'Klasifikatsiya natijalarini ko\'rsatuvchi jadval', 'Loss funksiyasi', 'Optimizer turi'], answer: 1 },
        { q: 'Feature scaling nima uchun?', options: ['Data tozalash', 'Turli o\'lchamdagi xususiyatlarni normallashtirish', 'Model saqlash', 'Grafik chizish'], answer: 1 },
        { q: 'LSTM qayerda ishlatiladi?', options: ['Tasvirda', 'Ketma-ket ma\'lumot va vaqt qatorida', 'Audio da', 'Video da'], answer: 1 },
        { q: 'Dropout nima?', options: ['Ma\'lumot o\'chirish', 'Overfitting oldini olish uchun neyronlarni tasodifiy o\'chirish', 'Model kompressiya', 'Batch normalizatsiya'], answer: 1 },
        { q: 'Transfer Learning nima?', options: ['Ma\'lumot uzatish', 'Oldindan o\'qitilgan modelni yangi vazifaga moslashtirish', 'Cloud computing', 'Model export'], answer: 1 },
        { q: 'K-means nima?', options: ['Supervised learning', 'Unsupervised clustering algoritm', 'Regression turi', 'Neural network'], answer: 1 },
        { q: 'Precision va Recall:', options: ['Bir xil narsa', 'Precision to\'g\'ri pozitivlar, Recall haqiqiy pozitivlar', 'Faqat binary uchun', 'Loss funksiyasi'], answer: 1 }
      ],
      logic: [
        { q: 'Agar model 95% train accuracy va 60% test accuracy ko\'rsatsa, muammo nima?', answer: 'overfitting' },
        { q: '1000 ta ma\'lumotdan 800 ta train, 200 ta test uchun ajratilsa, bu necha foiz train/test split?', answer: '80' },
        { q: 'Agar learning rate juda katta bo\'lsa nima bo\'ladi? (gradient descent haqida)', answer: 'konvergentsiya' },
        { q: 'Feature importance nima uchun ishlatiladi? (bir so\'z)', answer: 'muhim' },
        { q: 'Bias-variance tradeoff da optimal holat qanday nomlanadi?', answer: 'muvozanat' }
      ],
      coding: [
        { q: 'Python da 1 dan 10 gacha sonlar yig\'indisini hisoblang', check: 'sum', starter: '# Yig\'indi hisoblash\ntotal = sum(range(1, 11))\nprint(total)' },
        { q: 'Ro\'yxatdagi juft sonlarni filtrlang: [1,2,3,4,5,6,7,8,9,10]', check: 'filter', starter: 'numbers = [1,2,3,4,5,6,7,8,9,10]\njuft = list(filter(lambda x: x%2==0, numbers))\nprint(juft)' },
        { q: 'Dictionary yarating: 3 ta talaba ismi va ballari', check: 'dict', starter: 'students = dict(Ali=85, Vali=92, Hasan=78)\nprint(students)' },
        { q: 'Matnni teskari aylantiruvchi funksiya yozing', check: 'reverse', starter: 'def teskari(matn):\n    return matn[::-1]\n\nprint(teskari("TSUE"))' },
        { q: 'sorted() funksiyasi bilan ro\'yxatni saralang', check: 'sorted', starter: 'arr = [5,3,8,1,9,2]\nsortlangan = sorted(arr)\nprint(sortlangan)' }
      ]
    }
  },
  security: {
    learn: [
      {
        id: 'sec-l1', level: 'basic', title: 'Kriptografiya asoslari',
        theory: `Kriptografiya — ma'lumotni himoya qilish fani.

**Asosiy tushunchalar:**
- **Encryption** — ma'lumotni shifrlash
- **Decryption** — shifrni ochish
- **Key** — shifrlash kaliti

**Python da oddiy shifrlash:**
\`\`\`python
import hashlib

text = "TSUE2024"
hashed = hashlib.sha256(text.encode()).hexdigest()
print(hashed)
\`\`\``,
        task: 'Python da hashlib yordamida "Hello TSUE" matnini SHA-256 ga aylantiring.',
        solution_check: 'hashlib',
        starter_code: `import hashlib\n\ntext = "Hello TSUE"\nhashed = hashlib.sha256(text.encode()).hexdigest()\nprint(hashed)`,
        expected_output: 'hash'
      },
      {
        id: 'sec-l2', level: 'basic', title: 'Network xavfsizligi',
        theory: `Network xavfsizligi — tarmoqni himoya qilish.

**Asosiy protokollar:**
- **HTTPS** — xavfsiz HTTP
- **SSL/TLS** — shifrlash protokoli
- **Firewall** — tarmoq himoyasi

**Python socket:**
\`\`\`python
import socket
host = socket.gethostname()
print("Host:", host)
\`\`\``,
        task: 'Python socket yordamida localhost hostini oling.',
        solution_check: 'socket',
        starter_code: `import socket\n\nhost = socket.gethostname()\nprint("Host:", host)`,
        expected_output: 'host'
      },
      {
        id: 'sec-l3', level: 'junior', title: 'SQL Injection himoyasi',
        theory: `SQL Injection — eng keng tarqalgan hujum turi.

**Xavfli kod:**
\`\`\`python
# XAVFLI - hech qachon bunday qilmang!
query = "SELECT * FROM users WHERE name='" + user_input + "'"
\`\`\`

**Xavfsiz kod:**
\`\`\`python
# XAVFSIZ - parametrli so'rovlar
query = "SELECT * FROM users WHERE name=?"
cursor.execute(query, (user_input,))
\`\`\``,
        task: 'Parametrli SQL so\'rov yozing (cursor.execute bilan).',
        solution_check: 'execute',
        starter_code: `import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute("CREATE TABLE users (id INTEGER, name TEXT)")\ncursor.execute("INSERT INTO users VALUES (?, ?)", (1, "Ali"))\ncursor.execute("SELECT * FROM users WHERE name=?", ("Ali",))\nprint(cursor.fetchall())`,
        expected_output: 'execute'
      },
      {
        id: 'sec-l4', level: 'middle', title: 'Parol Hashing',
        theory: `Parollarni to'g'ri saqlash — axborot xavfsizligining asosi.

**bcrypt bilan:**
\`\`\`python
import bcrypt

password = b"mypassword123"
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password, salt)

# Tekshirish
valid = bcrypt.checkpw(password, hashed)
print(valid)  # True
\`\`\``,
        task: 'bcrypt yordamida parolni hashlang va tekshiring.',
        solution_check: 'bcrypt',
        starter_code: `import bcrypt\n\npassword = b"MySecurePassword"\nsalt = bcrypt.gensalt()\nhashed = bcrypt.hashpw(password, salt)\nprint(bcrypt.checkpw(password, hashed))`,
        expected_output: 'True'
      }
    ],
    weekly: {
      tests: [
        { q: 'SQL Injection nima?', options: ['Ma\'lumotlar bazasiga zararli so\'rovlar kiritish', 'Python xatosi', 'Network hujumi', 'Virus turi'], answer: 0 },
        { q: 'HTTPS da "S" nima degani?', options: ['Super', 'Secure', 'Speed', 'Server'], answer: 1 },
        { q: 'Firewall nima qiladi?', options: ['Tarmoq trafigini nazorat qiladi', 'Viruslarni tozalaydi', 'Internet tezligini oshiradi', 'Ma\'lumotlarni shifrlaydi'], answer: 0 },
        { q: 'SHA-256 nima?', options: ['Shifrlash algoritmi', 'Hashing algoritmi', 'Kompressiya', 'Protokol'], answer: 1 },
        { q: 'XSS hujumi nima?', options: ['Cross-Site Scripting', 'Extra Security System', 'XML Schema Standard', 'Extended Security Service'], answer: 0 },
        { q: 'Penetration testing maqsadi:', options: ['Tizimni buzish', 'Tizim zaifliklarini topish', 'Ma\'lumot o\'g\'irlash', 'Viruslar yaratish'], answer: 1 },
        { q: 'VPN nima?', options: ['Very Private Network', 'Virtual Private Network', 'Verified Public Network', 'Visual Protocol Node'], answer: 1 },
        { q: 'Phishing nima?', options: ['Baliq ovi', 'Soxta sayt orqali ma\'lumot olish', 'Tarmoq hujumi', 'Shifrlash'], answer: 1 },
        { q: 'Zero-day zaiflik nima?', options: ['Yangi topilgan va hali patchlanmagan zaiflik', 'Nolchi xato', 'Birinchi hujum', 'Test xatosi'], answer: 0 },
        { q: 'Symmetric encryption da:', options: ['2 xil kalit', '1 xil kalit', 'Kalit kerak emas', 'Ko\'p kalit'], answer: 1 },
        { q: 'RSA nima?', options: ['Tarmoq protokoli', 'Asymmetric shifrlash algoritmi', 'Hashing', 'Kompressiya'], answer: 1 },
        { q: 'CSRF nima?', options: ['Cross-Site Request Forgery', 'Common Security Risk Framework', 'Central Server Response File', 'Client Side Rendering Feature'], answer: 0 },
        { q: 'Man-in-the-Middle hujumida:', options: ['Server buziladi', 'Ikkita tomon orasidagi aloqa tinglanaadi', 'Parol buziladi', 'Viruslar yuklanadi'], answer: 1 },
        { q: 'Brute force hujumi:', options: ['Zaifliklarni qidirish', 'Barcha mumkin parollarni sinab ko\'rish', 'Phishing', 'DDoS'], answer: 1 },
        { q: 'DDoS nima?', options: ['Distributed Denial of Service', 'Dynamic Data Object System', 'Direct Download Server', 'Dual Domain Operation'], answer: 0 },
        { q: 'Two-factor authentication (2FA):', options: ['2 xil parol', 'Parol + qo\'shimcha tasdiqlash', 'Faqat biometrika', 'SMS faqat'], answer: 1 },
        { q: 'Port scanning nima uchun?', options: ['Internet tezligi', 'Ochiq portlarni aniqlash', 'DNS lookup', 'IP topish'], answer: 1 },
        { q: 'Social engineering nima?', options: ['Dasturlash uslubi', 'Odamlarni manipulyatsiya qilish orqali ma\'lumot olish', 'Tarmoq hujumi', 'Shifrlash'], answer: 1 },
        { q: 'Bug bounty program nima?', options: ['Xatolar uchun mukofot dasturi', 'Dastur sertifikati', 'Xavfsizlik standarti', 'Test turi'], answer: 0 },
        { q: 'Hacker va Cracker farqi:', options: ['Farqi yo\'q', 'Hacker etik, Cracker zararli', 'Cracker etik, Hacker zararli', 'Ikkalasi ham zararli'], answer: 1 }
      ],
      logic: [
        { q: 'Agar sayt HTTPS ishlatmasa, nima xavf bor? (asosiy xavf)', answer: 'tinglash' },
        { q: 'Parolni hashlashda nima uchun "salt" qo\'shiladi?', answer: 'rainbow' },
        { q: 'SQL Injection dan himoyalanishning eng to\'g\'ri usuli?', answer: 'parametr' },
        { q: 'Port 443 qaysi protokolda ishlatiladi?', answer: 'HTTPS' },
        { q: 'Penetration testing da birinchi qadam nima deyiladi?', answer: 'reconnaissance' }
      ],
      coding: [
        { q: 'Python da hashlib bilan SHA-256 hisoblang', check: 'hashlib', starter: 'import hashlib\ntext = "TSUE Security"\nhash = hashlib.sha256(text.encode()).hexdigest()\nprint(hash)' },
        { q: 'Parolning kuchini tekshiring (8+ belgi, raqam, harf)', check: 'len', starter: 'def check_password(p):\n    return len(p)>=8 and any(c.isdigit() for c in p) and any(c.isalpha() for c in p)\nprint(check_password("Tsue2024!"))' },
        { q: 'Base64 encode/decode qiling', check: 'base64', starter: 'import base64\ntext = "Hello TSUE"\nencoded = base64.b64encode(text.encode()).decode()\ndecoded = base64.b64decode(encoded).decode()\nprint(encoded, decoded)' },
        { q: 'Caesar cipher kodlang (shift=3)', check: 'chr', starter: 'def caesar(text, shift=3):\n    result = ""\n    for c in text:\n        if c.isalpha():\n            result += chr((ord(c)-65+shift)%26+65) if c.isupper() else chr((ord(c)-97+shift)%26+97)\n        else: result+=c\n    return result\nprint(caesar("TSUE"))' },
        { q: 'Tasodifiy kuchli parol generatsiya qiling', check: 'random', starter: 'import random, string\nchars = string.ascii_letters+string.digits+"!@#$%"\npassword = "".join(random.choice(chars) for _ in range(12))\nprint(password)' }
      ]
    }
  },
  statistics: {
    learn: [
      {
        id: 'stat-l1', level: 'basic', title: 'Statistika asoslari',
        theory: `Statistika — ma'lumotlarni tahlil qilish fani.

**Asosiy ko'rsatkichlar:**
\`\`\`python
import statistics

data = [23, 45, 12, 67, 34, 45, 89]
print("O'rtacha:", statistics.mean(data))      # 45
print("Mediana:", statistics.median(data))     # 45
print("Standart og'ish:", statistics.stdev(data))
\`\`\``,
        task: 'statistics moduli bilan [10,20,30,40,50] ning o\'rtachasi va medianasini toping.',
        solution_check: 'statistics',
        starter_code: `import statistics\n\ndata = [10, 20, 30, 40, 50]\nprint("O'rtacha:", statistics.mean(data))\nprint("Mediana:", statistics.median(data))`,
        expected_output: '30'
      },
      {
        id: 'stat-l2', level: 'basic', title: 'Pandas bilan tahlil',
        theory: `Pandas — ma'lumotlar tahlilining asosiy vositasi.

**DataFrame:**
\`\`\`python
import pandas as pd

df = pd.DataFrame({'A': [1,2,3], 'B': [4,5,6]})
print(df.describe())  # Statistika
print(df.corr())      # Korrelyatsiya
\`\`\``,
        task: 'Pandas DataFrame yaratib, describe() chiqaring.',
        solution_check: 'describe',
        starter_code: `import pandas as pd\n\ndf = pd.DataFrame({\n    'ism': ['Ali','Vali','Sana','Hasan'],\n    'ball': [85,92,78,95],\n    'yosh': [20,21,19,22]\n})\nprint(df.describe())`,
        expected_output: 'describe'
      },
      {
        id: 'stat-l3', level: 'junior', title: 'Korrelyatsiya tahlili',
        theory: `Korrelyatsiya — ikkita o'zgaruvchi orasidagi bog'liqlik.

**Pearson korrelyatsiyasi:**
\`\`\`python
import numpy as np

x = [1, 2, 3, 4, 5]
y = [2, 4, 5, 4, 5]

corr = np.corrcoef(x, y)[0, 1]
print(f"Korrelyatsiya: {corr:.3f}")
\`\`\`

- +1: to'liq musbat bog'liqlik
- -1: to'liq manfiy bog'liqlik
- 0: bog'liqlik yo'q`,
        task: 'np.corrcoef bilan ikkita ro\'yxat orasidagi korrelyatsiyani hisoblang.',
        solution_check: 'corrcoef',
        starter_code: `import numpy as np\n\nx = [2, 4, 6, 8, 10]\ny = [1, 3, 7, 9, 11]\ncorr = np.corrcoef(x, y)[0, 1]\nprint(f"Korrelyatsiya: {corr:.3f}")`,
        expected_output: 'corrcoef'
      },
      {
        id: 'stat-l4', level: 'middle', title: 'Gipoteza sinovi',
        theory: `Gipoteza sinovi — statistik qaror qabul qilish.

**T-test:**
\`\`\`python
from scipy import stats

group1 = [85, 92, 78, 95, 88]
group2 = [70, 75, 68, 80, 72]

t_stat, p_value = stats.ttest_ind(group1, group2)
print(f"p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Farq statistik jihatdan muhim!")
\`\`\``,
        task: 'scipy bilan ikkita guruh o\'rtasida t-test o\'tkazing.',
        solution_check: 'ttest',
        starter_code: `from scipy import stats\n\nA = [85, 90, 78, 92, 88]\nB = [70, 75, 72, 68, 80]\nt, p = stats.ttest_ind(A, B)\nprint(f"t={t:.3f}, p={p:.4f}")`,
        expected_output: 'ttest'
      }
    ],
    weekly: {
      tests: [
        { q: 'Mediana nima?', options: ['O\'rtacha qiymat', 'O\'rtadagi qiymat', 'Eng ko\'p takrorlanadigan', 'Maksimal qiymat'], answer: 1 },
        { q: 'Standart og\'ish nima o\'lchaydi?', options: ['O\'rtacha', 'Ma\'lumotlar tarqoqligini', 'Korrelyatsiyani', 'P-valueni'], answer: 1 },
        { q: 'Pearson korrelyatsiyasi qiymati:', options: ['0 dan 1 gacha', '-1 dan 1 gacha', '-∞ dan +∞ gacha', '0 dan 100 gacha'], answer: 1 },
        { q: 'P-value < 0.05 nima degani?', options: ['Natija tasodifiy', 'Natija statistik jihatdan muhim', 'Ma\'lumot yetarli emas', 'Xato bor'], answer: 1 },
        { q: 'Histogram nima uchun ishlatiladi?', options: ['Korrelyatsiya', 'Taqsimotni ko\'rsatish', 'O\'rtacha hisoblash', 'Gipoteza sinovi'], answer: 1 },
        { q: 'Outlier nima?', options: ['O\'rtacha qiymat', 'Boshqa qiymatlardan keskin farq qiluvchi qiymat', 'Minimal qiymat', 'Eng ko\'p takrorlanadigan'], answer: 1 },
        { q: 'Regression tahlil nima uchun?', options: ['Guruhlar farqini aniqlash', 'O\'zgaruvchilar orasidagi bog\'liqlikni modellashtirish', 'Taqsimotni aniqlash', 'Variantsiyani hisoblash'], answer: 1 },
        { q: 'Normal taqsimot shakli:', options: ['U-shakl', 'Bell-shakl', 'J-shakl', 'To\'g\'ri chiziq'], answer: 1 },
        { q: 'Pandas describe() nimani chiqaradi?', options: ['Grafik', 'Asosiy statistik ko\'rsatkichlar', 'Korrelyatsiya', 'Taqsimot'], answer: 1 },
        { q: 'Chi-square test nima uchun?', options: ['O\'rtacha solishtirish', 'Kategorik ma\'lumotlar aloqasini tekshirish', 'Taqsimot aniqlash', 'Korrelyatsiya'], answer: 1 },
        { q: 'IQR nima?', options: ['Interquartile Range', 'Index Query Rate', 'Integrated Quality Report', 'Input Query Result'], answer: 0 },
        { q: 'ANOVA nima uchun?', options: ['2 guruh solishtirish', '2+ guruh o\'rtachalarini solishtirish', 'Korrelyatsiya', 'Regression'], answer: 1 },
        { q: 'Variance nima?', options: ['Standart og\'ish', 'Standart og\'ishning kvadrati', 'O\'rtacha', 'Mediana'], answer: 1 },
        { q: 'Scipy stats moduli nima uchun?', options: ['Ma\'lumot tozalash', 'Statistik testlar', 'Vizualizatsiya', 'Ma\'lumot yuklash'], answer: 1 },
        { q: 'Time series nima?', options: ['Vaqt bo\'yicha ketma-ket kuzatuvlar', 'Tasodifiy ma\'lumotlar', 'Guruh ma\'lumotlari', 'Kategorik ma\'lumotlar'], answer: 0 },
        { q: 'Seaborn qaysi uchun?', options: ['Ma\'lumot yuklash', 'Statistik vizualizatsiya', 'Modellashtirish', 'Hisoblash'], answer: 1 },
        { q: 'Linear regression chiqishi:', options: ['Kategoriya', 'Sonli qiymat', 'Ehtimollik', 'Rang'], answer: 1 },
        { q: 'F-statistika nima uchun?', options: ['Korrelyatsiya', 'Dispersiyalar nisbatini hisoblash', 'Mediana', 'Moda'], answer: 1 },
        { q: 'Konfidenslik intervali:', options: ['To\'g\'ri qiymat', 'Parametr qiymati bo\'lishi mumkin bo\'lgan oraliq', 'P-value', 'Standart og\'ish'], answer: 1 },
        { q: 'Bootstrap metodi nima?', options: ['Qayta namuna olish orqali statistika hisoblash', 'Modelni o\'qitish', 'Data tozalash', 'Vizualizatsiya'], answer: 0 }
      ],
      logic: [
        { q: 'Agar p-value = 0.001 bo\'lsa va alpha = 0.05, nol gipoteza rad qilinadimi? (ha/yo\'q)', answer: 'ha' },
        { q: 'Korrelyatsiya = 0.9 bo\'lsa bu qanday bog\'liqlik?', answer: 'kuchli' },
        { q: 'Ma\'lumotlarda outlierlarni aniqlash uchun IQR metodida qanday formula ishlatiladi? (Q1, Q3, IQR)', answer: 'IQR' },
        { q: 'Agar standart og\'ish = 0 bo\'lsa, ma\'lumotlar haqida nima deyish mumkin?', answer: 'bir xil' },
        { q: 'Normal taqsimotda o\'rtacha va mediana qanday bo\'ladi?', answer: 'teng' }
      ],
      coding: [
        { q: 'statistics moduli bilan o\'rtacha, mediana, moda hisoblang', check: 'statistics', starter: 'import statistics\ndata = [23,45,12,67,34,45,89,23,45]\nprint("Mean:", statistics.mean(data))\nprint("Median:", statistics.median(data))\nprint("Mode:", statistics.mode(data))' },
        { q: 'Pandas describe() bilan statistika chiqaring', check: 'describe', starter: 'import pandas as pd\ndf = pd.DataFrame({"ball":[85,92,78,88,95],"yosh":[20,21,19,22,20]})\nprint(df.describe())' },
        { q: 'NumPy bilan korrelyatsiya hisoblang', check: 'corrcoef', starter: 'import numpy as np\nX = [2,4,6,8,10]\nY = [1,3,7,9,11]\ncorr = np.corrcoef(X, Y)[0,1]\nprint(f"Korrelyatsiya: {corr:.3f}")' },
        { q: 'Normal taqsimotdan 100 son generatsiya qilib statistika chiqaring', check: 'normal', starter: 'import numpy as np\ndata = np.random.normal(50, 10, 100)\nprint(f"Mean: {data.mean():.2f}")\nprint(f"Std: {data.std():.2f}")' },
        { q: 'IQR bilan outlierlarni toping', check: 'IQR', starter: 'import numpy as np\ndata = np.array([10,12,11,14,13,100,12,11,13,10,200])\nQ1, Q3 = np.percentile(data, [25, 75])\nIQR = Q3 - Q1\noutliers = data[(data < Q1-1.5*IQR)|(data > Q3+1.5*IQR)]\nprint("Outliers:", outliers)' }
      ]
    }
  }
};

// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  try {
    const { name, surname, password, icon, direction } = req.body;
    if (!name || !surname || !password) {
      return res.status(400).json({ error: 'Ism, familiya va parol kiritilishi shart' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Parol kamida 6 ta belgi bo\'lishi kerak' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: name.trim(),
        surname: surname.trim(),
        password: hashedPassword,
        icon: icon || '😊',
        direction: direction || null,
        scores: {}
      }])
      .select()
      .single();
    if (error) throw error;
    res.json({
      success: true,
      user: {
        id: data.id,
        name: data.name,
        surname: data.surname,
        icon: data.icon,
        direction: data.direction,
        scores: data.scores || {}
      }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    if (err.message.includes('duplicate')) {
      return res.status(400).json({ error: 'Bu ism bilan foydalanuvchi allaqachon mavjud' });
    }
    res.status(500).json({ error: 'Server xatosi: ' + err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { name, surname, password } = req.body;
    if (!name || !surname || !password) {
      return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring' });
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('name', name.trim())
      .ilike('surname', surname.trim())
      .single();
    if (error || !data) return res.status(401).json({ error: 'Foydalanuvchi topilmadi' });
    const valid = await bcrypt.compare(password, data.password);
    if (!valid) return res.status(401).json({ error: 'Parol noto\'g\'ri' });
    res.json({
      success: true,
      user: {
        id: data.id,
        name: data.name,
        surname: data.surname,
        icon: data.icon || '😊',
        direction: data.direction,
        scores: data.scores || {}
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

app.get('/api/user/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, surname, icon, direction, scores, created_at')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/update-profile', async (req, res) => {
  try {
    const { userId, icon, direction } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId kerak' });
    const updateData = {};
    if (icon) updateData.icon = icon;
    if (direction) updateData.direction = direction;
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, user: data });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/save-score', async (req, res) => {
  try {
    const { userId, scoreType, score, week } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId kerak' });
    const { data: user, error: fetchErr } = await supabase
      .from('users').select('scores').eq('id', userId).single();
    if (fetchErr) throw fetchErr;
    const scores = user.scores || {};
    const key = week ? `${scoreType}_week${week}` : scoreType;
    scores[key] = Math.max(scores[key] || 0, score || 0);
    const { error: updateErr } = await supabase
      .from('users').update({ scores }).eq('id', userId);
    if (updateErr) throw updateErr;
    res.json({ success: true, scores });
  } catch (err) {
    console.error('Save score error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── TASKS & CODE ─────────────────────────────────────────────────────────────
app.get('/api/tasks/:direction', (req, res) => {
  const dir = req.params.direction;
  const taskData = TASKS[dir];
  if (!taskData) return res.status(404).json({ error: 'Yo\'nalish topilmadi' });
  res.json(taskData);
});

app.post('/api/submit-code', (req, res) => {
  const { code, check } = req.body;
  if (!code || !check) return res.status(400).json({ error: 'code va check kerak' });
  const passed = code.includes(check);
  res.json({
    success: passed,
    message: passed ? '✅ To\'g\'ri! Ajoyib ish!' : `❌ Kodda "${check}" bo'lishi kerak`
  });
});

// ─── RANKING ──────────────────────────────────────────────────────────────────
app.get('/api/ranking', async (req, res) => {
  try {
    const week = parseInt(req.query.week) || 1;
    const { data, error } = await supabase
      .from('users')
      .select('id, name, surname, icon, direction, scores');
    if (error) throw error;

    const ranking = (data || [])
      .map(u => {
        const s = u.scores || {};
        const testScore = s[`test_week${week}`] || 0;
        const logicScore = s[`logic_week${week}`] || 0;
        const codeScore = s[`code_week${week}`] || 0;
        const weeklyScore = testScore + logicScore + codeScore;
        return { ...u, weeklyScore, testScore, logicScore, codeScore };
      })
      .filter(u => u.weeklyScore > 0)
      .sort((a, b) => b.weeklyScore - a.weeklyScore);

    res.json(ranking);
  } catch (err) {
    console.error('Ranking error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── AI CHAT (Server Proxy) ────────────────────────────────────────────────────
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { messages, direction } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array kerak' });
    }

    const systemPrompts = {
      ai: `Sen TSUE universiteti "Sun'iy Intellekt" yo'nalishi talabalariga yordam beruvchi AI yordamchisisan. Faqat o'zbek tilida javob ber. ML, Python, Data Science, Neural Networks, TensorFlow, Keras, scikit-learn haqida tushuntir. Qisqa, aniq va kod misollari bilan javob ber. Har bir javob 3-5 jumladan oshmasin.`,
      security: `Sen TSUE universiteti "Axborot Xavfsizligi" yo'nalishi talabalariga yordam beruvchi AI yordamchisisan. Faqat o'zbek tilida javob ber. Kriptografiya, Ethical Hacking, Network Security, SQL Injection, XSS haqida tushuntir. Qisqa, aniq va amaliy misollar ber. Har bir javob 3-5 jumladan oshmasin.`,
      statistics: `Sen TSUE universiteti "Statistika" yo'nalishi talabalariga yordam beruvchi AI yordamchisisan. Faqat o'zbek tilida javob ber. Statistik tahlil, Pandas, NumPy, Scipy, vizualizatsiya haqida tushuntir. Qisqa, aniq va formulalar bilan javob ber. Har bir javob 3-5 jumladan oshmasin.`
    };

    const systemPrompt = systemPrompts[direction] || systemPrompts.ai;

    if (!ANTHROPIC_API_KEY) {
      return res.status(503).json({
        error: 'AI xizmati hozir mavjud emas. ANTHROPIC_API_KEY sozlanmagan.'
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: systemPrompt,
        messages: messages.slice(-10)
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `API xatosi: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Javob olinmadi';
    res.json({ reply });
  } catch (err) {
    console.error('AI chat error:', err.message);
    res.status(500).json({ error: 'AI xizmati vaqtincha ishlamayapti: ' + err.message });
  }
});

// ─── HEALTH ───────────────────────────────────────────────────────────────────
app.get('/health', async (_, res) => {
  let dbStatus = 'unknown';
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    dbStatus = error ? 'error: ' + error.message : 'connected';
  } catch (e) {
    dbStatus = 'error: ' + e.message;
  }
  res.json({ status: 'ok', time: new Date().toISOString(), database: dbStatus });
});

app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard', (_, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 TSUE Platform port ${PORT} da ishlamoqda`);
  console.log(`📊 Supabase: ${SUPABASE_URL ? '✅ URL mavjud' : '❌ URL yo\'q'}`);
  console.log(`🤖 Anthropic: ${ANTHROPIC_API_KEY ? '✅ API key mavjud' : '❌ API key yo\'q'}`);
});

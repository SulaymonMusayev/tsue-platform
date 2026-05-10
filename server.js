const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ─── TASKS DATA (fallback if Supabase empty) ─────────────────────────────────

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
        task: 'Quyidagi kodni yozib ko\'ring: 1 dan 10 gacha sonlarning yig\'indisini hisoblaydigan funksiya yarating.',
        solution_check: 'sum',
        starter_code: `def hisoblash():\n    # 1 dan 10 gacha yig'indi\n    pass\n\nprint(hisoblash())`,
        expected_output: '55'
      },
      {
        id: 'ai-l2', level: 'basic', title: 'NumPy bilan ishlash',
        theory: `NumPy — raqamli hisoblashlar uchun Python kutubxonasi. 
ML algoritmlarining asosi.

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
        starter_code: `import numpy as np\n\nmas = np.array([10, 20, 30, 40, 50])\n# O'rtachani hisoblang\n`,
        expected_output: '30.0'
      },
      {
        id: 'ai-l3', level: 'junior', title: 'Linear Regression',
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
        task: 'sklearn yordamida [1,2,3,4,5] -> [3,6,9,12,15] ma\'lumotlarga Linear Regression o\'rgating va 6 uchun bashorat qiling.',
        solution_check: 'predict',
        starter_code: `from sklearn.linear_model import LinearRegression\nimport numpy as np\n\nX = np.array([[1],[2],[3],[4],[5]])\ny = np.array([3, 6, 9, 12, 15])\n\n# Modelni o'rgating va bashorat qiling\n`,
        expected_output: '18'
      },
      {
        id: 'ai-l4', level: 'middle', title: 'Neural Network (Keras)',
        theory: `Keras yordamida oddiy neyron tarmoq yaratish:

\`\`\`python
from tensorflow import keras

model = keras.Sequential([
    keras.layers.Dense(64, activation='relu', input_shape=(10,)),
    keras.layers.Dense(32, activation='relu'),
    keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
\`\`\``,
        task: 'Keras yordamida 2 ta Dense qatlam bilan model yarating (input: 5, hidden: 10, output: 1).',
        solution_check: 'Dense',
        starter_code: `from tensorflow import keras\n\n# Model yarating\nmodel = keras.Sequential([\n    # qatlamlarni qo'shing\n])\n\nmodel.summary()`,
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
        { q: '1000 ta ma\'lumotdan 800 ta train, 200 ta test uchun ajratilsa, bu necha foiz train/test split?', answer: '80/20' },
        { q: 'Agar learning rate juda katta bo\'lsa nima bo\'ladi?', answer: 'converge' },
        { q: 'Feature importance nima uchun ishlatiladi?', answer: 'muhim' },
        { q: 'Bias-variance tradeoff da optimal nuqta qayerda?', answer: 'muvozanat' }
      ],
      coding: [
        { q: 'Python da Fibonacci ketma-ketligini (n=10) hisoblaydigan kod yozing', check: 'fib', starter: '# Fibonacci ketma-ketligi\ndef fibonacci(n):\n    pass\n\nprint(fibonacci(10))' },
        { q: 'Ro\'yxatdagi juft sonlarni filtrlang: [1,2,3,4,5,6,7,8,9,10]', check: 'filter', starter: 'numbers = [1,2,3,4,5,6,7,8,9,10]\n# Juft sonlarni toping\n' },
        { q: 'Dictionary yarating: 5 ta talaba ismi va ballari', check: 'dict', starter: '# Talabalar dictionarysini yarating\nstudents = {}\n# Qo\'shing va chiqaring' },
        { q: 'Matnni teskari aylantiruvchi funksiya yozing', check: 'reverse', starter: 'def teskari(matn):\n    pass\n\nprint(teskari("TSUE"))' },
        { q: 'Sonlar ro\'yxatini saralang (bubble sort)', check: 'sort', starter: 'def bubble_sort(arr):\n    pass\n\nprint(bubble_sort([5,3,8,1,9,2]))' }
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
- **Key** — kalit (shifrlash/ochish uchun)
- **Hash** — bir tomonlama funksiya

**Python da hash:**
\`\`\`python
import hashlib
text = "parol123"
hash_val = hashlib.sha256(text.encode()).hexdigest()
print(hash_val)
\`\`\``,
        task: 'Python hashlib yordamida "TSUE2024" matnining SHA-256 hashini hisoblang.',
        solution_check: 'hashlib',
        starter_code: `import hashlib\n\nmatn = "TSUE2024"\n# SHA-256 hash hisoblang\n`,
        expected_output: 'hash'
      },
      {
        id: 'sec-l2', level: 'basic', title: 'SQL Injection',
        theory: `SQL Injection — eng keng tarqalgan web hujum turi.

**Zaif kod:**
\`\`\`python
query = f"SELECT * FROM users WHERE name='{user_input}'"
# Agar user_input = "' OR '1'='1" bo'lsa, hamma foydalanuvchi chiqadi!
\`\`\`

**Himoyalangan kod:**
\`\`\`python
query = "SELECT * FROM users WHERE name = %s"
cursor.execute(query, (user_input,))
\`\`\``,
        task: 'Quyidagi zaif SQL so\'rovni parametrli so\'rov bilan himoyalang.',
        solution_check: '%s',
        starter_code: `# Zaif:\nuser = input("Ism: ")\nquery = f"SELECT * FROM users WHERE name='{user}'"\n\n# Himoyalang:\n# query = ???`,
        expected_output: 'protected'
      },
      {
        id: 'sec-l3', level: 'junior', title: 'Caesar Cipher',
        theory: `Caesar shifri — eng qadimgi shifrlash usuli. Harflarni N pozitsiya surib shifrlaydi.

**Misol (shift=3):**
- A → D
- B → E  
- HELLO → KHOOR

\`\`\`python
def caesar_encrypt(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            shifted = ord(char) + shift
            if char.islower():
                result += chr((shifted - 97) % 26 + 97)
            else:
                result += chr((shifted - 65) % 26 + 65)
        else:
            result += char
    return result
\`\`\``,
        task: '"HELLO" so\'zini Caesar shifri (shift=3) bilan shifrlang va natijani chiqaring.',
        solution_check: 'KHOOR',
        starter_code: `def caesar_encrypt(text, shift):\n    result = ""\n    for char in text:\n        if char.isalpha():\n            # Shifrlash logikasini yozing\n            pass\n        else:\n            result += char\n    return result\n\nprint(caesar_encrypt("HELLO", 3))`,
        expected_output: 'KHOOR'
      },
      {
        id: 'sec-l4', level: 'middle', title: 'Port Scanner',
        theory: `Port scanner — tarmoqdagi ochiq portlarni topuvchi dastur.

\`\`\`python
import socket

def scan_port(host, port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0  # True = ochiq
    except:
        return False

# Localhost portlarini skanerlash
for port in [80, 443, 8080, 3000]:
    if scan_port('127.0.0.1', port):
        print(f"Port {port}: OCHIQ")
\`\`\``,
        task: '127.0.0.1 da 20-25 portlarni tekshiruvchi scanner yozing.',
        solution_check: 'socket',
        starter_code: `import socket\n\ndef scan_port(host, port):\n    # Port ochiqligini tekshiring\n    pass\n\n# 20-25 portlarni tekshiring\nfor port in range(20, 26):\n    # chiqaring\n    pass`,
        expected_output: 'scanner'
      }
    ],
    weekly: {
      tests: [
        { q: 'CIA Triad nimalardan iborat?', options: ['Confidentiality, Integrity, Availability', 'Control, Inspect, Audit', 'Cyber, Internet, Application', 'Certificate, Identity, Authentication'], answer: 0 },
        { q: 'Phishing nima?', options: ['Virus turi', 'Fishing o\'yini', 'Aldov orqali ma\'lumot o\'g\'irlash', 'Tarmoq hujumi'], answer: 2 },
        { q: 'HTTPS da "S" nimani anglatadi?', options: ['Speed', 'Secure', 'Server', 'System'], answer: 1 },
        { q: 'Firewall vazifasi:', options: ['Internet tezlashtirishri', 'Kiruvchi/chiquvchi trafikni filtrlash', 'Parol saqlash', 'Email yuborish'], answer: 1 },
        { q: 'DDoS hujumi nima?', options: ['Parol buzish', 'Serverga katta trafik yuborib ishdan chiqarish', 'Virus tarqatish', 'Ma\'lumot o\'chirish'], answer: 1 },
        { q: 'Encryption va Hashing farqi:', options: ['Farqi yo\'q', 'Encryption qaytariladi, Hashing bir tomonlama', 'Hashing tezroq', 'Encryption bepul'], answer: 1 },
        { q: 'Zero-day vulnerability nima?', options: ['Yangi topilgan, yamalmagan zaiflik', 'Eski zaiflik', 'Foydalanuvchi xatosi', 'Server muammosi'], answer: 0 },
        { q: 'VPN nima uchun?', options: ['Internet tezlashtirishri', 'Xavfsiz va shifrlangan ulanish', 'Virus tozalash', 'Parol yaratish'], answer: 1 },
        { q: 'Man-in-the-Middle hujumi:', options: ['Serverga hujum', 'Ikki tomon o\'rtasiga kirib ma\'lumot o\'g\'irlash', 'Parol buzish', 'DDoS turi'], answer: 1 },
        { q: 'SHA-256 nima?', options: ['Shifrlash algoritmi', 'Kriptografik hash funksiyasi', 'Parol generatori', 'SSL sertifikati'], answer: 1 },
        { q: 'Social Engineering nima?', options: ['Dasturlash usuli', 'Odamlarni manipulyatsiya qilib ma\'lumot olish', 'Tarmoq protokoli', 'Antivirus turi'], answer: 1 },
        { q: 'Malware turlari:', options: ['Faqat virus', 'Virus, Trojan, Ransomware, Spyware', 'Faqat ransomware', 'SQL injection'], answer: 1 },
        { q: 'Two-Factor Authentication (2FA):', options: ['Ikki parol', 'Ikkita turli tekshiruv usuli', 'Biometric faqat', 'Email tasdiqlash'], answer: 1 },
        { q: 'Penetration Testing nima?', options: ['Internet testi', 'Ruxsat bilan tizimga hujum qilib zaiflik topish', 'Speed test', 'Antivirus test'], answer: 1 },
        { q: 'XSS hujumi:', options: ['SQL hujumi', 'Veb-saytga zararli script kiritish', 'DDoS turi', 'Phishing'], answer: 1 },
        { q: 'PKI nima?', options: ['Python Key Interface', 'Public Key Infrastructure', 'Private Key Integration', 'Protocol Key Index'], answer: 1 },
        { q: 'Ransomware nima?', options: ['Virus turi', 'Ma\'lumotni shiflab to\'lov talab qiluvchi dastur', 'Spyware', 'Reklama dasturi'], answer: 1 },
        { q: 'Network Sniffing:', options: ['Tarmoq tezligini o\'lchash', 'Tarmoq trafikini tinglash va tahlil qilish', 'DNS o\'zgartirish', 'Firewall o\'rnatish'], answer: 1 },
        { q: 'OWASP Top 10 nima?', options: ['10 ta dasturlash tili', 'Eng ko\'p uchraydigan veb zaifliklar ro\'yxati', '10 ta antivirus', 'Security standartlari'], answer: 1 },
        { q: 'Brute Force hujumi:', options: ['Ijtimoiy hujum', 'Barcha kombinatsiyalarni sinab parol topish', 'Tarmoq hujumi', 'SQL hujum'], answer: 1 }
      ],
      logic: [
        { q: 'Agar parol "password123" bo\'lsa, uning zaif tomonlarini sanab yozing', answer: 'keng' },
        { q: 'HTTP va HTTPS o\'rtasidagi asosiy farq nima?', answer: 'shifrlash' },
        { q: 'Xodim kompaniya ma\'lumotlarini USB ga ko\'chirib olib chiqsa, bu qanday tahdid turi?', answer: 'insider' },
        { q: 'Agar server 500 xato qaytarsa, bu xavfsizlik nuqtai nazaridan nima deydi?', answer: 'ma\'lumot' },
        { q: 'Multi-factor authentication necha omildan iborat bo\'lishi kerak?', answer: '2' }
      ],
      coding: [
        { q: 'Parol kuchliligini tekshiruvchi funksiya yozing (katta harf, raqam, belgi, 8+ uzunlik)', check: 'password', starter: 'def check_password(password):\n    # Kuchliligini tekshiring\n    pass\n\nprint(check_password("Test@123"))' },
        { q: 'Foydalanuvchi kiritgan matnni Base64 ga aylantiring', check: 'base64', starter: 'import base64\n\nmatn = "Salom TSUE"\n# Base64 ga aylantiring\n' },
        { q: 'Oddiy login brute force himoyasi (3 ta urinish)', check: 'attempts', starter: 'def login(password, attempt=0):\n    correct = "secret123"\n    # 3 ta urinish bilan cheklang\n    pass' },
        { q: 'Tasodifiy 16 belgili xavfsiz parol generator yozing', check: 'random', starter: 'import random\nimport string\n\ndef generate_password():\n    # Parol yarating\n    pass\n\nprint(generate_password())' },
        { q: 'Vigenere cipher bilan shifrlash funksiyasi yozing', check: 'key', starter: 'def vigenere_encrypt(text, key):\n    # Vigenere shifri\n    pass\n\nprint(vigenere_encrypt("HELLO", "KEY"))' }
      ]
    }
  },
  statistics: {
    learn: [
      {
        id: 'stat-l1', level: 'basic', title: 'Statistika asoslari',
        theory: `Statistika — ma\'lumotlarni to\'plash, tahlil qilish va talqin qilish fani.

**Asosiy o\'lchov ko\'rsatkichlari:**
\`\`\`python
import statistics

data = [10, 20, 30, 40, 50, 20, 30]

print(statistics.mean(data))    # O'rtacha: 28.57
print(statistics.median(data))  # Mediana: 30
print(statistics.mode(data))    # Moda: 20
print(statistics.stdev(data))   # Standart og'ish
\`\`\``,
        task: '[5, 10, 15, 20, 25, 15, 10] ro\'yxati uchun o\'rtacha, mediana va modani hisoblang.',
        solution_check: 'mean',
        starter_code: `import statistics\n\ndata = [5, 10, 15, 20, 25, 15, 10]\n# O'rtacha, mediana, modani hisoblang\n`,
        expected_output: '14.28'
      },
      {
        id: 'stat-l2', level: 'basic', title: 'Pandas bilan ishlash',
        theory: `Pandas — ma\'lumotlarni tahlil qilish uchun Python kutubxonasi.

**DataFrame yaratish:**
\`\`\`python
import pandas as pd

data = {
    'ism': ['Ali', 'Vali', 'Hasan'],
    'ball': [85, 92, 78],
    'yosh': [20, 21, 19]
}
df = pd.DataFrame(data)
print(df.describe())  # Statistik tavsif
print(df['ball'].mean())  # Ball o'rtachasi
\`\`\``,
        task: '5 ta talaba ismi va ballari bilan DataFrame yarating, balllarning o\'rtacha va maksimumini toping.',
        solution_check: 'DataFrame',
        starter_code: `import pandas as pd\n\n# 5 ta talaba datasini yarating\ndata = {\n    'ism': [],\n    'ball': []\n}\ndf = pd.DataFrame(data)\n# O'rtacha va maksimumni toping\n`,
        expected_output: 'dataframe'
      },
      {
        id: 'stat-l3', level: 'junior', title: 'Korrelyatsiya tahlili',
        theory: `Korrelyatsiya — ikki o\'zgaruvchi o\'rtasidagi bog\'liqlik darajasi.

**Korrelyatsiya koeffitsienti (-1 dan 1 gacha):**
- 1 yaqin: kuchli musbat bog\'liqlik
- -1 yaqin: kuchli manfiy bog\'liqlik
- 0 yaqin: bog\'liqlik yo\'q

\`\`\`python
import numpy as np

study_hours = [2, 4, 6, 8, 10]
exam_scores = [60, 70, 80, 90, 95]

correlation = np.corrcoef(study_hours, exam_scores)[0,1]
print(f"Korrelyatsiya: {correlation:.2f}")
\`\`\``,
        task: 'O\'qish soatlari [1,3,5,7,9] va balllar [55,65,75,85,95] o\'rtasidagi korrelyatsiyani hisoblang.',
        solution_check: 'corrcoef',
        starter_code: `import numpy as np\n\nhours = [1, 3, 5, 7, 9]\nscores = [55, 65, 75, 85, 95]\n\n# Korrelyatsiyani hisoblang\n`,
        expected_output: '0.99'
      },
      {
        id: 'stat-l4', level: 'middle', title: 'Gipoteza testlash',
        theory: `T-test — ikki guruh o\'rtacha qiymatlarini solishtirish uchun.

\`\`\`python
from scipy import stats

group_a = [85, 88, 90, 82, 87]  # Darsga qatnashganlar
group_b = [70, 75, 68, 72, 71]  # Qatnashmagan

t_stat, p_value = stats.ttest_ind(group_a, group_b)
print(f"T-statistic: {t_stat:.2f}")
print(f"P-value: {p_value:.4f}")

if p_value < 0.05:
    print("Farq statistik jihatdan muhim!")
\`\`\``,
        task: 'Ikkita guruh [90,85,88,92,87] va [70,75,72,68,74] o\'rtasida T-test o\'tkazing.',
        solution_check: 'ttest',
        starter_code: `from scipy import stats\n\nA = [90, 85, 88, 92, 87]\nB = [70, 75, 72, 68, 74]\n\n# T-test o'tkazing\n`,
        expected_output: 'significant'
      }
    ],
    weekly: {
      tests: [
        { q: 'O\'rtacha (mean) qanday hisoblanadi?', options: ['Eng ko\'p takrorlangan son', 'Barcha sonlar yig\'indisi / soni', 'O\'rtadagi son', 'Eng katta - eng kichik'], answer: 1 },
        { q: 'Mediana nima?', options: ['O\'rtacha', 'Saralangan qatordagi o\'rtadagi qiymat', 'Eng katta qiymat', 'Standart og\'ish'], answer: 1 },
        { q: 'Standart og\'ish nimani ko\'rsatadi?', options: ['O\'rtacha qiymat', 'Ma\'lumotlarning tarqoqligini', 'Maksimal qiymat', 'Minimal qiymat'], answer: 1 },
        { q: 'Korrelyatsiya koeffitsienti qaysi oraliqda bo\'ladi?', options: ['0 dan 1', '-1 dan 1', '-∞ dan +∞', '0 dan 100'], answer: 1 },
        { q: 'Normal taqsimot grafigi qanday ko\'rinishda?', options: ['To\'g\'ri chiziq', 'Qo\'ng\'iroq shakli', 'U shakli', 'Zig-zag'], answer: 1 },
        { q: 'P-value 0.05 dan kichik bo\'lsa:', options: ['H0 qabul qilinadi', 'H0 rad etiladi', 'Test noto\'g\'ri', 'Ma\'lumot yetarli emas'], answer: 1 },
        { q: 'Regression tahlili nima uchun?', options: ['Guruhlarni aniqlash', 'O\'zgaruvchilar orasidagi bog\'liqlikni modellashtirish', 'Ma\'lumot tozalash', 'Grafik chizish'], answer: 1 },
        { q: 'Outlier nima?', options: ['Tez-tez uchraydigan qiymat', 'Qolganlardan keskin farqlanadigan qiymat', 'O\'rtacha qiymat', 'Minimal qiymat'], answer: 1 },
        { q: 'Histogram nima ko\'rsatadi?', options: ['Vaqt o\'zgarishi', 'Ma\'lumotlarning taqsimotini', 'Ikkita o\'zgaruvchi bog\'liqligini', 'Foizli nisbatlarni'], answer: 1 },
        { q: 'Box plot da "whisker" nima?', options: ['O\'rtacha', 'Min va max qiymatlar chegarasi', 'Mediana', 'Standart og\'ish'], answer: 1 },
        { q: 'ANOVA nima uchun?', options: ['Ikkita guruh solishtirish', 'Uch va undan ko\'p guruh o\'rtachalarini solishtirish', 'Korrelyatsiya hisoblash', 'Regression'], answer: 1 },
        { q: 'Variance (dispersiya) nima?', options: ['O\'rtacha', 'Standart og\'ishning kvadrati', 'Mediana', 'Moda'], answer: 1 },
        { q: 'Sampling nima?', options: ['Barcha ma\'lumot olish', 'Katta to\'plamdan kichik namuna olish', 'Ma\'lumot tozalash', 'Grafik yaratish'], answer: 1 },
        { q: 'Skewness (qiyalik) nima ko\'rsatadi?', options: ['Ma\'lumot hajmi', 'Taqsimotning simmetriyligi', 'O\'rtacha qiymat', 'Korrelyatsiya'], answer: 1 },
        { q: 'Confidence interval nima?', options: ['P-value', 'Parametr qiymatining ehtimoliy oralig\'i', 'T-test natijasi', 'Standart xato'], answer: 1 },
        { q: 'Time series tahlili nima uchun?', options: ['Guruh taqqoslash', 'Vaqt bo\'yicha o\'zgarishlarni tahlil qilish', 'Korrelyatsiya', 'Clustering'], answer: 1 },
        { q: 'Chi-square test qachon ishlatiladi?', options: ['Sonli ma\'lumotlar', 'Kategorik ma\'lumotlar bog\'liqligini tekshirish', 'Vaqt qatorlari', 'Regression'], answer: 1 },
        { q: 'Central Limit Theorem nima deydi?', options: ['Ma\'lumot har doim normal taqsimlangan', 'Namuna kattalashsa, o\'rtachalar normal taqsimotga yaqinlashadi', 'Katta dataset kerak', 'P-value < 0.05'], answer: 1 },
        { q: 'Bayesian statistika nima?', options: ['Klassik statistika', 'Oldingi bilimni yangi ma\'lumot bilan yangilash', 'Regression turi', 'Clustering metod'], answer: 1 },
        { q: 'R-squared (R²) nimani anglatadi?', options: ['Korrelyatsiya', 'Model tomonidan tushuntirilgan dispersiya ulushi', 'T-statistika', 'P-value'], answer: 1 }
      ],
      logic: [
        { q: 'Agar o\'rtacha 70, mediana 65 bo\'lsa, taqsimot qaysi tomonga qiyshaygan?', answer: 'o\'ng' },
        { q: '100 ta talaba ballari: min=40, max=100, mean=72, median=75. Bu qanday taqsimot?', answer: 'chap' },
        { q: 'Korrelyatsiya 0.95 bo\'lsa, bu qanday bog\'liqlik?', answer: 'kuchli' },
        { q: 'Namuna hajmi 2 baravar oshsa, standart xato qanday o\'zgaradi?', answer: 'kamayadi' },
        { q: '30 ta namunaviy o\'lchovning qaysi teorema asosida normal taqsimotga yaqinlashadi?', answer: 'markaziy' }
      ],
      coding: [
        { q: 'Ro\'yxat uchun o\'rtacha, mediana, moda, min, max hisoblang', check: 'statistics', starter: 'import statistics\n\ndata = [23, 45, 12, 67, 34, 45, 89, 23, 45]\n# Barcha ko\'rsatkichlarni hisoblang\n' },
        { q: 'Pandas bilan CSV o\'qib (yoki dict dan), balllar bo\'yicha umumiy statistika chiqaring', check: 'describe', starter: 'import pandas as pd\n\ndata = {"ism": ["Ali","Vali","Hasan","Qodir","Sarvар"], "ball": [85,92,78,88,95]}\ndf = pd.DataFrame(data)\n# describe() chiqaring\n' },
        { q: 'Ikkita ro\'yxat uchun korrelyatsiya matritsasini chiqaring', check: 'corr', starter: 'import numpy as np\n\nX = [2,4,6,8,10]\nY = [1,3,7,9,11]\n# Korrelyatsiya hisoblang\n' },
        { q: 'Normal taqsimotdan 100 ta son generatsiya qilib, o\'rtacha va std hisoblang', check: 'normal', starter: 'import numpy as np\n\n# Normal taqsimotdan 100 ta son (mean=50, std=10)\n# Keyin o\'rtacha va std ni hisoblang\n' },
        { q: 'Ro\'yxatdagi outlierlarni IQR usuli bilan toping', check: 'IQR', starter: 'import numpy as np\n\ndata = [10,12,11,14,13,100,12,11,13,10,200]\n# IQR usuli bilan outlierlarni toping\n# Q1, Q3, IQR hisoblang\n' }
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, surname, password: hashedPassword, icon: icon || '😊', direction: direction || null, scores: {} }])
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, user: { id: data.id, name: data.name, surname: data.surname, icon: data.icon, direction: data.direction } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { name, surname, password } = req.body;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('name', name)
      .ilike('surname', surname)
      .single();
    if (error || !data) return res.status(401).json({ error: 'Foydalanuvchi topilmadi' });
    const valid = await bcrypt.compare(password, data.password);
    if (!valid) return res.status(401).json({ error: 'Parol noto\'g\'ri' });
    res.json({ success: true, user: { id: data.id, name: data.name, surname: data.surname, icon: data.icon, direction: data.direction, scores: data.scores } });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const { data, error } = await supabase
      .from('users')
      .update({ icon, direction })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, user: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/save-score', async (req, res) => {
  try {
    const { userId, scoreType, score, week } = req.body;
    const { data: user, error: fetchErr } = await supabase
      .from('users').select('scores').eq('id', userId).single();
    if (fetchErr) throw fetchErr;
    const scores = user.scores || {};
    const key = week ? `${scoreType}_week${week}` : scoreType;
    scores[key] = Math.max(scores[key] || 0, score);
    const { error: updateErr } = await supabase
      .from('users').update({ scores }).eq('id', userId);
    if (updateErr) throw updateErr;
    res.json({ success: true, scores });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── TASKS & CODE ─────────────────────────────────────────────────────────────

app.get('/api/tasks/:direction', async (req, res) => {
  const dir = req.params.direction;
  const taskData = TASKS[dir];
  if (!taskData) return res.status(404).json({ error: 'Yo\'nalish topilmadi' });
  res.json(taskData);
});

app.post('/api/submit-code', async (req, res) => {
  const { code, check, expected } = req.body;
  const passed = code && code.includes(check);
  res.json({ success: passed, message: passed ? '✅ To\'g\'ri! Ajoyib ish!' : `❌ Kod "${check}" ni o\'z ichiga olishi kerak` });
});

// ─── RANKING ──────────────────────────────────────────────────────────────────

app.get('/api/ranking', async (req, res) => {
  try {
    const week = req.query.week || 1;
    const { data, error } = await supabase
      .from('users')
      .select('id, name, surname, icon, direction, scores')
      .not('scores', 'eq', '{}');
    if (error) throw error;
    const ranking = data
      .map(u => {
        const s = u.scores || {};
        const weekly = (s[`test_week${week}`] || 0) + (s[`logic_week${week}`] || 0) + (s[`code_week${week}`] || 0);
        return { ...u, weeklyScore: weekly };
      })
      .filter(u => u.weeklyScore > 0)
      .sort((a, b) => b.weeklyScore - a.weeklyScore);
    res.json(ranking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── AI CHAT ──────────────────────────────────────────────────────────────────

app.post('/api/ai-chat', async (req, res) => {
  const { message, direction } = req.body;
  const systemPrompts = {
    ai: 'Sen TSUE universiteti "Sun\'iy Intellekt" yo\'nalishi uchun AI yordamchisisan. Faqat o\'zbek tilida javob ber. ML, Python, Data Science, Neural Networks haqida tushuntir. Qisqa, aniq va misollar bilan javob ber.',
    security: 'Sen TSUE universiteti "Axborot Xavfsizligi" yo\'nalishi uchun AI yordamchisisan. Faqat o\'zbek tilida javob ber. Kriptografiya, Ethical Hacking, Network Security haqida tushuntir. Qisqa, aniq va amaliy misollar ber.',
    statistics: 'Sen TSUE universiteti "Statistika" yo\'nalishi uchun AI yordamchisisan. Faqat o\'zbek tilida javob ber. Statistik tahlil, Pandas, Scipy, vizualizatsiya haqida tushuntir. Qisqa, aniq va formulalar bilan javob ber.'
  };
  res.json({
    reply: `Hozircha AI chat server tomonida ishlamaydi. Dashboard da to'g'ridan to'g'ri Anthropic API ga murojaat qiladi. Tizim ishlayapti!`,
    systemPrompt: systemPrompts[direction] || systemPrompts.ai
  });
});

// ─── HEALTH ───────────────────────────────────────────────────────────────────

app.get('/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard', (_, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 TSUE Platform running on port ${PORT}`));

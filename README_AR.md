# 🎯 Remote Storage Server - الخادم المركزي للتخزين

## 📌 نسخة محسّنة لـ Hostinger 🚀

تطبيق Node.js لإدارة رفع وتحميل الملفات مع دعم كامل لـ **Hostinger Shared Hosting**.

---

## ✨ الميزات

- ✅ **رفع ملفات آمن** مع التحقق من API Key
- ✅ **تخزين محلي** بدون الاعتماد على cloud
- ✅ **معالجة متوازية** للملفات
- ✅ **دعم أنواع متعددة:** صور، فيديو، صوت، PDF، وغيرها
- ✅ **نظيف على Hostinger** - بدون dependencies معقدة
- ✅ **CORS مدعوم** لـ cross-origin requests

---

## 🔧 المتطلبات

- **Node.js** ≥ 18.0.0
- **npm** أو **yarn**

---

## 📥 التثبيت المحلي (Development)

### 1️⃣ استنساخ المشروع
```bash
git clone https://github.com/your-username/remote-storage-server.git
cd remote-storage-server
```

### 2️⃣ تثبيت Dependencies
```bash
npm install
```

### 3️⃣ إعداد متغيرات البيئة
```bash
cp .env.example .env
```

عدّل `.env`:
```dotenv
NODE_ENV=development
STORAGE_SERVER_API_KEY=your-test-key-123
STORAGE_SERVER_URL=http://localhost:3000
```

### 4️⃣ شغّل السيرفر
```bash
# وضع التطوير (مع auto-reload)
npm run dev

# أو وضع الـ production
npm start
```

**النتيجة المتوقعة:**
```
🚀 Storage Server running on port 3000
```

---

## 🚀 التثبيت على Hostinger

**اقرأ:** [HOSTINGER_DEPLOYMENT.md](HOSTINGER_DEPLOYMENT.md)

### الخطوات السريعة:

1. **رفع الملفات** (git push أو FTP)
2. **تثبيت dependencies:**
   ```bash
   npm ci
   ```
3. **إضافة Environment Variables** من لوحة التحكم:
   - `NODE_ENV=production`
   - `STORAGE_SERVER_API_KEY=your-secret-key`
4. **Restart Node.js** من لوحة التحكم
5. **اختبر:**
   ```bash
   curl https://your-domain.com/health
   ```

---

## 📚 API Endpoints

### 1️⃣ Health Check
```bash
GET /health
```
**الرد:**
```json
{"success": true, "status": "Storage Server Ready"}
```

---

### 2️⃣ رفع ملف
```bash
POST /upload
```

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
Content-Type: multipart/form-data
```

**Body Parameters:**
- `file` (required) - الملف
- `folder` (optional) - المجلد - الافتراضي: `general`

**مثال:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@document.pdf" \
  -F "folder=documents" \
  http://localhost:3000/upload
```

**الرد:**
```json
{
  "success": true,
  "data": {
    "url": "http://localhost:3000/uploads/documents/document-timestamp-random.pdf",
    "publicId": "documents/document-timestamp-random.pdf",
    "resourceType": "raw",
    "format": "pdf",
    "bytes": 15240,
    "provider": "local"
  }
}
```

---

### 3️⃣ حذف ملف
```bash
DELETE /delete
```

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Body:**
```json
{
  "publicId": "documents/document-timestamp-random.pdf"
}
```

**مثال:**
```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"publicId":"documents/file.pdf"}' \
  http://localhost:3000/delete
```

**الرد:**
```json
{"success": true}
```

---

## 🔐 متغيرات البيئة

| المتغير | الافتراضي | الوصف |
|--------|---------|-------|
| `NODE_ENV` | `development` | بيئة التشغيل |
| `PORT` | `3000` | منفذ السيرفر |
| `STORAGE_SERVER_API_KEY` | `undefined` | مفتاح التحقق الأمني |
| `LOCAL_UPLOAD_PATH` | `uploads` | مسار المجلد |
| `STORAGE_SERVER_URL` | `http://localhost:3000` | عنوان السيرفر |

---

## 📁 هيكل المشروع

```
.
├── storage-server.js           # ملف السيرفر الرئيسي
├── package.json                # Dependencies
├── .env.example                # مثال متغيرات البيئة
├── HOSTINGER_DEPLOYMENT.md     # دليل Hostinger
├── CHANGES_SUMMARY.md          # ملخص التغييرات
├── src/
│   └── providers/
│       ├── BaseUploadProvider.js
│       └── LocalProvider.js    # معالج التخزين المحلي
└── uploads/                    # مجلد التخزين
    ├── tmp/                    # ملفات مؤقتة
    ├── general/                # المجلد الافتراضي
    ├── documents/
    ├── images/
    └── ...
```

---

## ❌ الأخطاء الشائعة والحلول

### 1️⃣ 503 Service Unavailable
**السبب:** السيرفر لم يشتغل
**الحل:**
```bash
# تحقق من الأخطاء
npm install
npm start

# على Hostinger: اطلب من الـ Support تفعيل logs
```

---

### 2️⃣ 401 Unauthorized
**السبب:** API Key غير صحيح
**الحل:**
```bash
# تأكد من API Key في الـ request
curl -H "Authorization: Bearer CORRECT_KEY" ...
```

---

### 3️⃣ 413 Payload Too Large
**السبب:** الملف أكبر من 15MB
**الحل:**
- استخدم ملفات أصغر
- أو عدّل `fileSize` limit في `storage-server.js`

---

## 🧪 اختبار سريع

```bash
# 1️⃣ Health Check
curl http://localhost:3000/health

# 2️⃣ رفع ملف
curl -X POST \
  -H "Authorization: Bearer test-key" \
  -F "file=@test.txt" \
  http://localhost:3000/upload

# 3️⃣ حذف ملف
curl -X DELETE \
  -H "Authorization: Bearer test-key" \
  -H "Content-Type: application/json" \
  -d '{"publicId":"general/test-123.txt"}' \
  http://localhost:3000/delete
```

أو استخدم script الاختبار:
```bash
bash test-api.sh
```

---

## 📊 الإحصائيات

- **حجم الملفات المدعومة:** ≤ 15MB (قابل للتعديل)
- **أنواع الملفات:**
  - صور: JPEG, PNG, GIF, WebP
  - فيديو: MP4, WebM
  - صوت: MP3, WAV
  - المستندات: PDF, DOC, DOCX, وغيرها
- **Performance:** ≤ 2s للملفات العادية

---

## 🔒 نصائح الأمان

1. ✅ استخدم **API Key قوي** (30+ حرف عشوائي)
2. ✅ استخدم **HTTPS** دائمًا
3. ✅ لا تلتزم `.env` في Git
4. ✅ غيّر مفاتيح الـ production بشكل دوري
5. ✅ نظّف مجلد `uploads/tmp` بشكل دوري

---

## 📝 الترخيص

MIT License

---

## 🤝 المساهمة

Pull Requests مرحب بها! للتعديلات الكبيرة، افتح issue أولاً.

---

## 📞 الدعم

- 🐛 للمشاكل: انشر issue على GitHub
- 💬 للاستفسارات: استخدم Discussions
- 📚 للتوثيق: اقرأ [HOSTINGER_DEPLOYMENT.md](HOSTINGER_DEPLOYMENT.md)

---

**آخر تحديث:** 14 يناير 2026  
**نسخة:** 1.0.0 (محسّنة لـ Hostinger)

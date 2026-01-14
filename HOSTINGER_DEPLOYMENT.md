# 🚀 دليل التثبيت على Hostinger

## ✅ التغييرات المطبقة بالفعل

### 1️⃣ ✔️ تم حذف `process.exit(1)`
- السيرفر الآن لن يقفل إذا كان API_KEY غير معرّف
- بدلاً من ذلك سيعطي تحذير في logs

### 2️⃣ ✔️ تم تغيير PORT إلى `process.env.PORT`
```js
const PORT = process.env.PORT || 3000;
```
- Hostinger يفرض PORT محدد من البيئة
- Default 3000 للتطوير المحلي

### 3️⃣ ✔️ تم تغيير multer إلى Disk Storage
```js
multer.diskStorage({
  destination: 'uploads/tmp',
  filename: Date.now() + '-' + originalname
})
```
- لا يعتمد على RAM الآن
- آمن لـ Hostinger Shared Hosting

### 4️⃣ ✔️ تم حذف `sharp` من package.json
- مكتبة native ومعقدة
- تسبب مشاكل على Hostinger

### 5️⃣ ✔️ تم إنشاء مجلد `uploads/tmp`
- للملفات المرفوعة مؤقتًا

---

## 📋 خطوات التثبيت على Hostinger

### الخطوة 1: رفع الملفات
```bash
npm install
# أو
npm ci  # (أفضل للـ production)
```

### الخطوة 2: إعداد متغيرات البيئة من لوحة التحكم

**اذهب إلى:**
```
Hosting Dashboard → Environment Variables → Add New
```

**أضف هذه المتغيرات:**

| المتغير | القيمة | ملاحظة |
|--------|--------|--------|
| `NODE_ENV` | `production` | مهم |
| `PORT` | يُحدّده Hostinger تلقائيًا | لا تغيره |
| `STORAGE_SERVER_API_KEY` | `your-secret-key` | أنشئ مفتاح قوي |

### الخطوة 3: تأكد من صلاحيات المجلدات
```bash
chmod 755 uploads/
chmod 755 uploads/tmp
```

### الخطوة 4: اختبر الـ Health Check

```bash
curl https://your-domain.com/health
```

**النتيجة المتوقعة:**
```json
{"success": true, "status": "Storage Server Ready"}
```

---

## ❌ الأخطاء الشائعة وحلولها

### خطأ 1: 503 Service Unavailable
**السبب:** السيرفر لا يشتغل أصلاً

**الحل:**
1. تأكد من متغير `PORT` في Hostinger
2. شغّل `npm install` مرة أخرى
3. تحقق من logs من لوحة التحكم

### خطأ 2: 401 Unauthorized
**السبب:** API_KEY غير صحيح

**الحل:**
```bash
# أرسل الـ request بشكل صحيح:
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -F "file=@file.pdf" \
     https://your-domain.com/upload?folder=documents
```

### خطأ 3: ملفات كبيرة تفشل
**السبب:** الـ upload timeout

**الحل:**
اطلب من Hostinger زيادة `request timeout`

---

## 📊 اختبر الـ Endpoints

### 1️⃣ Health Check
```bash
curl https://your-domain.com/health
```

### 2️⃣ Upload File
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@document.pdf" \
  -F "folder=documents" \
  https://your-domain.com/upload
```

### 3️⃣ Delete File
```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"publicId":"file-id"}' \
  https://your-domain.com/delete
```

---

## 🔐 نصائح أمان

1. ✅ استخدم API_KEY قوي (30+ حرف عشوائي)
2. ✅ استخدم HTTPS دائمًا
3. ✅ حدّد `fileSize` في multer (الحالي 15MB)
4. ✅ نظّف مجلد `uploads/tmp` بشكل دوري

---

## 📞 في حالة المشاكل

إذا استمرت مشكلة 503:

1. **تحقق من Node.js version:**
   ```bash
   node --version  # يجب ≥18.0.0
   ```

2. **تحقق من logs على Hostinger:**
   - Hosting Dashboard → Logs → Error Logs

3. **حاول restart:**
   - من لوحة التحكم → Restart Node.js Application

4. **اتصل بـ Hostinger Support:**
   - أخبرهم أن التطبيق يحتاج إلى Node.js v18+


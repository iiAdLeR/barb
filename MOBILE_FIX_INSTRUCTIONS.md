# إصلاح مشكلة الصفحة البيضاء على الجوال

## المشاكل التي تم إصلاحها:

### 1. متغيرات البيئة Firebase
- تم إضافة fallback values للـ Firebase configuration
- المشروع سيعمل الآن حتى لو لم تكن متغيرات البيئة متوفرة

### 2. Service Worker
- تم تحديث Service Worker ليعمل مع Vite بدلاً من Create React App
- تم إصلاح مسارات الملفات

### 3. Error Handling
- تم إضافة error boundaries وconsole logging
- تم إضافة شاشات خطأ وتحميل

### 4. إعدادات الجوال
- تم تحسين meta tags للجوال
- تم إضافة إعدادات PWA

## الخطوات المطلوبة:

### 1. إنشاء ملف .env
أنشئ ملف `.env` في المجلد الجذر مع محتوى:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com/
```

### 2. بناء المشروع
```bash
npm run build
```

### 3. رفع الملفات إلى Vercel
- ارفع مجلد `dist` إلى Vercel
- تأكد من أن متغيرات البيئة مضبوطة في Vercel Dashboard

### 4. اختبار على الجوال
- افتح Developer Tools في المتصفح
- تحقق من Console للأخطاء
- تأكد من أن Firebase يعمل بشكل صحيح

## ملاحظات مهمة:
- المشروع سيعمل الآن في وضع demo حتى لو لم تكن Firebase مضبوطة
- تم إضافة شاشات خطأ واضحة للمستخدم
- تم تحسين الأداء للجوال

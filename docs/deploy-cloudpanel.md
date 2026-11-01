# نشر الموقع على السيرفر (CloudPanel)

الموقع تطبيق Next.js، فبيتنشر من خيار **Create a Node.js Site** في CloudPanel. لوحة التحكم
(`/studio`) جزء من نفس التطبيق، فمش محتاجة موقع منفصل.

## 1. إنشاء الموقع في CloudPanel

1. **Create a Node.js Site**.
2. **Domain Name:** دومين الموقع (مثلاً `codex-tech.ai`).
3. **Node.js Version:** اختر **22** (أو أحدث). لوحة التحكم تحتاج 22.12 على الأقل.
4. **App Port:** `3000`. لو اخترت رقمًا مختلفًا، غيّره في `ecosystem.config.cjs` (`start -p 3000`).
5. **Site User / Password:** احفظهم، هتستخدمهم في الدخول بـ SSH.

بعد الإنشاء فعّل شهادة SSL من تبويب **SSL/TLS** (Let's Encrypt).

## 2. رفع الكود

ادخل على السيرفر بـ SSH بمستخدم الموقع، وروح لمجلد الموقع:

```bash
cd ~/htdocs/codex-tech.ai
```

**الطريقة الأولى (ملف مضغوط):** ارفع `codex-tech-website-deploy.zip` من **File Manager** في
CloudPanel لنفس المجلد، وبعدين:

```bash
unzip -o codex-tech-website-deploy.zip && rm codex-tech-website-deploy.zip
```

**الطريقة التانية (Git):** لو الكود على ريبو، امسح محتوى المجلد واعمل:

```bash
git clone <رابط-الريبو> .
```

## 3. متغيرات البيئة

اعمل ملف `.env.local` في نفس المجلد (من File Manager أو بـ `nano .env.local`). أقل حاجة:

```
NEXT_PUBLIC_SITE_URL=https://codex-tech.ai
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_REVALIDATE_SECRET=اكتب-كلمة-سر-طويلة
RESEND_API_KEY=
CONTACT_SENDER=
```

القائمة الكاملة وشرح كل متغير في `.env.example`. أي متغير يبدأ بـ `NEXT_PUBLIC_` لازم
يكون موجود **قبل** البناء، لأنه بيتحط جوّه الكود وقت الـ build.

## 4. البناء والتشغيل

```bash
npm ci
```

```bash
npm run build
```

```bash
npm i -g pm2
```

```bash
pm2 start ecosystem.config.cjs && pm2 save
```

عشان التطبيق يرجع يشتغل لوحده بعد إعادة تشغيل السيرفر، أضف في **Cron Jobs** في CloudPanel
مهمة بتوقيت `@reboot` بالأمر:

```bash
cd ~/htdocs/codex-tech.ai && pm2 resurrect
```

افتح الدومين، المفروض الموقع يشتغل. ولوحة التحكم على `https://الدومين/studio`.

## 5. تحديث الموقع بعد أي تعديل

```bash
cd ~/htdocs/codex-tech.ai
```

ارفع الملفات الجديدة (أو `git pull`)، وبعدين:

```bash
npm ci && npm run build && pm2 reload codex-tech
```

## 6. ربط لوحة التحكم

1. في [sanity.io/manage](https://www.sanity.io/manage) → المشروع → **API → CORS origins** ضيف
   `https://الدومين` مع تفعيل **Allow credentials**.
2. عشان تعديلات اللوحة تظهر فورًا بدل كل ساعة: في **API → Webhooks** اعمل webhook على
   `https://الدومين/api/revalidate` بنفس قيمة `SANITY_REVALIDATE_SECRET`.
3. تعبئة اللوحة بالمحتوى الحالي مرة واحدة (من السيرفر أو من جهازك):

```bash
SANITY_API_WRITE_TOKEN=التوكن npm run sanity:seed
```

## لو حصلت مشكلة

| العَرَض                        | السبب الغالب                                                               |
| ------------------------------ | -------------------------------------------------------------------------- |
| `502 Bad Gateway`              | التطبيق مش شغّال أو البورت مختلف. جرّب `pm2 logs codex-tech`               |
| `/studio` بتلف على طول         | `NEXT_PUBLIC_SANITY_PROJECT_ID` مش موجود وقت البناء، أو الدومين مش في CORS |
| البناء وقف بخطأ ذاكرة          | السيرفر محتاج 2GB رام على الأقل وقت البناء، أو ابنِ وأنت مقفّل pm2         |
| فورم التواصل بيقول فشل الإرسال | `RESEND_API_KEY` و `CONTACT_SENDER` مش متظبطين                             |

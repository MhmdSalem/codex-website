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

## 5ب. النشر التلقائي من GitHub (بدل الخطوة 5)

أي push على `main` بيتفحص على GitHub (الأنواع، lint، build)، ولو نجح بيدخل على السيرفر وينشر
لوحده بالسكريبت `deploy/deploy.sh`. محتاج تضيف مرة واحدة الـ secrets دي في الريبو من
**Settings → Secrets and variables → Actions → New repository secret**:

| الاسم         | القيمة                                                |
| ------------- | ----------------------------------------------------- |
| `VPS_HOST`    | الـ IP بتاع السيرفر                                   |
| `VPS_USER`    | مستخدم الموقع في CloudPanel (Site User)               |
| `VPS_SSH_KEY` | المفتاح الخاص (private key) اللي هتعمله تحت           |
| `VPS_APP_DIR` | مسار الموقع، مثلاً `/home/codex/htdocs/codex-tech.ai` |
| `VPS_PORT`    | اختياري، لو SSH مش على 22                             |

**عمل المفتاح:** على جهازك:

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f codex-deploy -N ""
```

- محتوى `codex-deploy.pub` حطه في CloudPanel: الموقع → **SSH/FTP** → SSH Keys للمستخدم ده.
- محتوى `codex-deploy` (من غير `.pub`) حطه في الـ secret اسمه `VPS_SSH_KEY`، وبعدها امسح الملفين من جهازك.

لحد ما `VPS_HOST` يتحط، الفحص بيشتغل عادي والنشر بيتخطّى نفسه من غير ما يفشل. وتقدر
تشغّل النشر يدوي من تبويب **Actions → Deploy → Run workflow**.

**لو السيرفر عليه الموقع القديم:** السكريبت بيوقف عملية PM2 القديمة `codex-web` لوحده لو كانت
شغّالة من نفس المسار. لو كانت في مسار تاني على نفس البورت 3000، وقّفها بإيدك مرة واحدة:

```bash
pm2 delete codex-web && pm2 save
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

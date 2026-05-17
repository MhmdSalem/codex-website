# Production deployment — Hostinger VPS

دليل كامل لنشر Codex على VPS هوستنجر باحترافية: Nginx + PM2 + MongoDB self-hosted + SSL + GitHub Actions auto-deploy.

> الفرضية: VPS Ubuntu 22.04/24.04 (KVM 1 على الأقل) ودومين عندك على GoDaddy.

---

## نظرة عامة على المعمارية

```
        Internet
            ↓
    [GoDaddy DNS] → A record → VPS_IP
            ↓
       Nginx :443 (SSL by Let's Encrypt)
            ↓
       Next.js :3000 (PM2)
            ↓
       MongoDB :27017 (localhost only, auth)
```

---

## المحتويات

| الملف | الغرض | يُشغَّل بواسطة |
|------|-------|---------------|
| `1-bootstrap.sh` | تأمين السيرفر (UFW, fail2ban, swap, deploy user) | root |
| `2-stack.sh` | تثبيت Node.js 20, Nginx, MongoDB 7, PM2, Certbot | root |
| `3-mongodb-secure.sh` | تفعيل auth في MongoDB وعمل users | root |
| `4-app-init.sh` | clone للريبو + install + build + PM2 | deploy |
| `5-nginx-ssl.sh` | إعداد Nginx + شهادة SSL | root |
| `setup-cron.sh` | تثبيت backup يومي لـ MongoDB | root |
| `backup-mongodb.sh` | يُستدعى من الـ cron | تلقائي |
| `deploy.sh` | تحديث الموقع لأحدث commit | deploy |
| `nginx.conf` | قالب إعداد Nginx | يُنسخ في خطوة 5 |
| `ecosystem.config.cjs` | ملف إعداد PM2 | يُستخدم تلقائياً |

---

## خطوات النشر بالترتيب

### ١ ـ ضبط DNS على GoDaddy (افعلها أولاً)

في لوحة GoDaddy → **My Products → Domains → DNS**:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | `IP_VPS_بتاعك` | 1 hour |
| A | www | `IP_VPS_بتاعك` | 1 hour |

استنى 5–30 دقيقة عشان الـ DNS ينتشر. اختبر بـ:

```bash
nslookup yourdomain.com
```

### ٢ ـ الدخول للـ VPS وتشغيل سكربت التأمين

```bash
ssh root@VPS_IP
# الصق الريبو هنا (للحصول على ملفات deploy)
git clone https://github.com/MhmdSalem/codex-website.git /tmp/codex
cd /tmp/codex/deploy
chmod +x *.sh

bash 1-bootstrap.sh
```

السكربت ده هيعمل:
- تحديث النظام
- يضيف 2GB swap
- ينشئ مستخدم `deploy` بصلاحيات sudo محدودة
- يفعّل UFW (يفتح فقط 22, 80, 443)
- يفعّل fail2ban
- يفعّل التحديثات الأمنية التلقائية

### ٣ ـ ضع SSH Key للمستخدم deploy

من جهازك المحلي:

```bash
# إذا ما عندكش SSH key:
ssh-keygen -t ed25519 -C "deploy@codex"

# انسخ الـ public key للسيرفر
ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@VPS_IP
```

أو بطريقة يدوية: انسخ محتوى `~/.ssh/id_ed25519.pub` ثم على السيرفر:

```bash
echo "PASTE_PUBLIC_KEY_HERE" >> /home/deploy/.ssh/authorized_keys
```

ثم اختبر:

```bash
ssh deploy@VPS_IP
```

### ٤ ـ تأمين SSH (اختياري لكن مهم)

كـ root:

```bash
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl reload ssh
```

### ٥ ـ تثبيت السترك (Node, Nginx, MongoDB, PM2)

```bash
ssh root@VPS_IP
cd /tmp/codex/deploy
bash 2-stack.sh
```

### ٦ ـ تأمين MongoDB بكلمة مرور

```bash
bash 3-mongodb-secure.sh
sudo cat /root/codex-db-credentials.txt
```

احفظ الـ connection string اللي هيظهر — هتحتاجه في `.env.local`.

### ٧ ـ تشغيل التطبيق كأول مرة

```bash
ssh deploy@VPS_IP
git clone https://github.com/MhmdSalem/codex-website.git ~/codex-website
cd ~/codex-website
cp .env.example .env.local
nano .env.local
```

عبّي القيم التالية في `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_CONTACT_EMAIL=hello@yourdomain.com
NEXT_PUBLIC_CONTACT_PHONE=+201000000000
NEXT_PUBLIC_WHATSAPP_NUMBER=201000000000

# من ملف /root/codex-db-credentials.txt
MONGODB_URI=mongodb://codexapp:PASSWORD@127.0.0.1:27017/codex_website?authSource=codex_website
MONGODB_DB=codex_website

# string عشوائي 32+ حرف
AUTH_SECRET=$(openssl rand -base64 48)

# أول أدمن (ممكن تعدّله بعد كده من الداش)
SEED_ADMIN_EMAIL=admin@yourdomain.com
SEED_ADMIN_PASSWORD=ChangeMeNow!
SEED_ADMIN_NAME=Mohamed Salem
```

ثم:

```bash
bash deploy/4-app-init.sh
```

### ٨ ـ ربط Nginx + شهادة SSL

كـ root:

```bash
DOMAIN=yourdomain.com EMAIL=you@example.com bash /home/deploy/codex-website/deploy/5-nginx-ssl.sh
```

افتح المتصفح على `https://yourdomain.com` — المفروض تشوف الموقع.

### ٩ ـ تثبيت backup يومي

```bash
bash /home/deploy/codex-website/deploy/setup-cron.sh
```

النسخ الاحتياطية في `/var/backups/codex-mongodb/` وbتتشال بعد 14 يوم تلقائياً.

### ١٠ ـ تفعيل GitHub Actions (نشر تلقائي)

اعمل SSH key مخصص للنشر على VPS:

```bash
ssh deploy@VPS_IP
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy   # ← انسخ المحتوى ده
```

ثم في GitHub:
**Settings → Secrets and variables → Actions → New repository secret**

أضف الـ secrets دي:

| الاسم | القيمة |
|------|--------|
| `VPS_HOST` | عنوان IP للـ VPS |
| `VPS_USER` | `deploy` |
| `VPS_PORT` | `22` (اختياري) |
| `VPS_SSH_KEY` | محتوى `~/.ssh/github_deploy` (الـ private key) |
| `AUTH_SECRET` | نفس الـ AUTH_SECRET في `.env.local` (لاختبار البناء فقط) |

من دلوقتي فصاعداً، أي `git push` لـ `main` هيعمل deploy تلقائي خلال دقيقتين.

---

## أوامر مفيدة

```bash
# حالة التطبيق
pm2 status
pm2 logs codex-web --lines 100

# إعادة تشغيل يدوي
pm2 reload codex-web

# Nginx
sudo nginx -t                  # اختبر الـ config
sudo systemctl reload nginx

# MongoDB
sudo systemctl status mongod
mongosh -u codexroot -p --authenticationDatabase admin

# Backups
sudo ls -lh /var/backups/codex-mongodb/
sudo bash /home/deploy/codex-website/deploy/backup-mongodb.sh   # backup يدوي

# Restore من backup
sudo mongorestore --gzip --archive=/var/backups/codex-mongodb/FILE.archive.gz \
  --username=codexroot --authenticationDatabase=admin
```

---

## الترقية لاحقاً (KVM 2 / 4)

لما تكبر الداتا أو الزوار:

1. ارفع الـ VPS plan من Hostinger (Hot upgrade — بدون فقد بيانات).
2. عدّل `ecosystem.config.cjs`:
   - `instances: "max"` و `exec_mode: "cluster"` (يستخدم كل الـ vCPU).
   - زوّد `max_memory_restart` لـ "2G" أو أكتر.
3. زوّد `cacheSizeGB` لـ MongoDB في `/etc/mongod.conf` لربع/نصف الـ RAM المتاحة.
4. اعمل `pm2 reload codex-web`.

---

## الخطوات المستقبلية (لما تيجي)

- ✅ نظام Subscriptions/Payments (Paymob/Fawry/Stripe)
- ✅ حسابات الزوار + email verification
- ✅ Rate-limiting أعمق (Redis للـ session blacklist)
- ✅ Monitoring (Uptime Kuma على نفس الـ VPS)
- ✅ CDN للصور لو الترافيك زاد (Cloudflare مجاني)

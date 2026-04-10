# Deployment Prompt untuk Qwen CLI

Salin prompt di bawah ini ke Qwen CLI di server:

---

Saya ingin deploy project MCI Training Platform dari GitHub ke server ini. Tolong lakukan step-by-step berikut:

## Info Project

- Repo: https://github.com/Alucard0x1/mci
- Target directory: /home/missioncritical/public_html
- Domain: https://missioncritical.institute/
- Tech: React (Vite) frontend + Express.js backend + SQLite
- Frontend menggunakan BrowserRouter (clean URLs, bukan hash)
- Backend port: 3001
- Frontend: static build, serve via Nginx

## Yang perlu dilakukan:

### 1. Clone & Install

```bash
cd /home/missioncritical
```

Kalau `public_html` sudah ada isinya, backup dulu:
```bash
mv public_html public_html_backup_$(date +%Y%m%d)
```

Lalu clone:
```bash
git clone https://github.com/Alucard0x1/mci public_html
cd public_html
npm install
```

### 2. Setup Environment

Generate JWT secret dan buat `.env`:

```bash
JWT_SECRET=$(openssl rand -hex 32)
cat > .env << EOF
JWT_SECRET=$JWT_SECRET
PORT=3001
EOF
```

### 3. Update Frontend API URL

File `lib/api.ts` saat ini hardcode ke `http://localhost:3001/api`. Karena nanti Nginx akan proxy `/api/` ke backend, ubah jadi relative path.

Di file `lib/api.ts`, ganti baris:
```typescript
const API_BASE = 'http://localhost:3001/api';
```
Menjadi:
```typescript
const API_BASE = '/api';
```

### 4. Build Frontend

```bash
npm run build
```

Ini akan generate folder `dist/` berisi static files.

### 5. Pastikan folder data writable

```bash
mkdir -p /home/missioncritical/public_html/data
chown -R missioncritical:missioncritical /home/missioncritical/public_html/data
```

### 6. Setup PM2 untuk Backend

Install PM2 kalau belum ada:
```bash
npm install -g pm2
```

Start backend dengan PM2:
```bash
cd /home/missioncritical/public_html
pm2 start npm --name "mci-backend" -- run server
pm2 save
pm2 startup
```

Verifikasi backend jalan:
```bash
curl http://127.0.0.1:3001/api/health
```

Harus return `{"status":"ok",...}`

### 7. Setup Nginx

PENTING: Project ini menggunakan BrowserRouter (clean URLs tanpa #). Nginx HARUS dikonfigurasi dengan `try_files $uri $uri/ /index.html` supaya semua route seperti `/login`, `/dashboard`, `/about`, `/courses/dc-101` dll bisa diakses langsung tanpa 404.

Buat/edit Nginx config untuk domain `missioncritical.institute`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name missioncritical.institute www.missioncritical.institute;

    root /home/missioncritical/public_html/dist;
    index index.html;

    # Proxy API requests ke Express backend — HARUS di atas location /
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback — SEMUA route yang bukan /api/ dan bukan static file
    # akan di-serve index.html, supaya React Router handle routing-nya
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

PENTING: Kalau sudah ada config Nginx untuk domain ini (misalnya dengan SSL/certbot), JANGAN timpa seluruhnya. Cukup:
1. Pastikan `root` mengarah ke `/home/missioncritical/public_html/dist`
2. Tambahkan block `location /api/` untuk proxy ke backend
3. Pastikan `location /` punya `try_files $uri $uri/ /index.html;`

Test dan reload:
```bash
nginx -t && systemctl reload nginx
```

### 8. Setup SSL (kalau belum ada)

```bash
certbot --nginx -d missioncritical.institute -d www.missioncritical.institute
```

### 9. Verifikasi

```bash
# API health check
curl https://missioncritical.institute/api/health

# Courses endpoint
curl https://missioncritical.institute/api/courses

# Frontend — harus return HTML (bukan 404)
curl -s https://missioncritical.institute/login | head -5

# Direct access ke sub-route — harus return HTML juga (bukan 404)
curl -s https://missioncritical.institute/about | head -5
```

Lalu buka di browser:
- Homepage: https://missioncritical.institute/
- Login: https://missioncritical.institute/login
- Dashboard: https://missioncritical.institute/dashboard (setelah login)
- About: https://missioncritical.institute/about
- Courses: https://missioncritical.institute/courses/dc-101

Login credentials: `admin@mci-training.com` / `admin123`

## Catatan Penting

- Database SQLite otomatis dibuat di `data/mci.db` saat backend pertama kali jalan
- Seed data (admin user, courses, instructors, dll) otomatis dijalankan saat pertama start
- `try_files $uri $uri/ /index.html` di Nginx WAJIB ada, tanpa ini semua route selain `/` akan 404
- Kalau perlu restart backend: `pm2 restart mci-backend`
- Kalau perlu lihat log: `pm2 logs mci-backend`
- Pastikan Node.js v18+ terinstall di server

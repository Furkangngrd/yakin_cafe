# ☕ YakınKafe — 5km Yakınındaki Kafeler & Mekanlar

MongoDB GeoSpatial API kullanarak yakınındaki kafeleri, restoranları ve çalışma alanlarını keşfeden modern bir web uygulaması.

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 20+
- MongoDB 7+ (yerel veya Atlas)

### Kurulum

```bash
# 1. Backend bağımlılıklarını yükle
cd server
npm install

# 2. Frontend bağımlılıklarını yükle
cd ../client
npm install

# 3. MongoDB'yi başlat (farklı terminalde)
mongod

# 4. Örnek verileri yükle
cd ../server
npm run seed

# 5. Backend'i başlat
npm run dev

# 6. Frontend'i başlat (farklı terminalde)
cd ../client
npm run dev
```

### Demo Hesaplar
| E-posta         | Şifre  |
|-----------------|--------|
| ahmet@test.com  | 123456 |
| elif@test.com   | 123456 |
| can@test.com    | 123456 |

## 🏗️ Teknoloji Yığını

| Katman    | Teknoloji                                      |
|-----------|-------------------------------------------------|
| Backend   | Node.js 20, Fastify, Mongoose                  |
| Veritabanı| MongoDB 7 (GeoJSON + 2dsphere index)            |
| Frontend  | React 18, Vite, Tailwind CSS v4                |
| UI        | Shadcn/UI, Framer Motion, Lucide Icons          |
| Harita    | React-Leaflet (Leaflet.js), CARTO tiles         |
| Auth      | JWT (Fastify-JWT), bcrypt                       |
| Güvenlik  | Fastify-rate-limit, CORS, Global Error Handler  |

## 📁 Proje Yapısı

```
├── server/                   # Backend API
│   ├── src/
│   │   ├── app.js            # Fastify entry point
│   │   ├── config/           # DB + env yapılandırması
│   │   ├── models/           # Mongoose şemaları
│   │   ├── controllers/      # Request handler'ları
│   │   ├── services/         # İş mantığı katmanı
│   │   ├── routes/           # API rotaları
│   │   ├── middlewares/      # Auth + Error handling
│   │   ├── plugins/          # CORS + Rate limit
│   │   └── utils/            # Yardımcı fonksiyonlar
│   └── seed.js               # Örnek veri
│
└── client/                   # Frontend
    └── src/
        ├── api/              # Axios instance
        ├── components/       # UI bileşenleri
        ├── context/          # Auth context
        ├── hooks/            # Custom hooks
        ├── lib/              # Utility fonksiyonlar
        └── pages/            # Sayfa bileşenleri
```

## 🌍 API Endpoints

### Auth
- `POST /api/auth/register` — Kayıt
- `POST /api/auth/login` — Giriş
- `GET  /api/auth/me` — Profil (🔒)
- `POST /api/auth/favorites/:placeId` — Favori toggle (🔒)

### Places
- `GET  /api/places` — Tüm mekanlar (filtreli)
- `GET  /api/places/:id` — Mekan detay
- `GET  /api/places/nearby?lng=X&lat=Y&maxDistance=5` — Yakın mekanlar ($geoNear)
- `POST /api/places` — Mekan ekle (🔒)
- `POST /api/places/within` — Polygon içindeki mekanlar ($geoWithin) (🔒)
- `PUT  /api/places/:id` — Güncelle (🔒)
- `DELETE /api/places/:id` — Sil (🔒)

### Reviews
- `GET  /api/reviews/:placeId` — Yorumlar
- `POST /api/reviews` — Yorum ekle (🔒)
- `DELETE /api/reviews/:id` — Yorum sil (🔒)

## 📜 Lisans

MIT

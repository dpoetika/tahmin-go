# TahminGO Backend API

TahminGO uygulaması için geliştirilmiş, Firebase Functions üzerinde çalışan modern bir backend API servisi.

## 🚀 Özellikler

- **Futbol Maç Tahminleri**: Mackolik.com'dan canlı maç verileri ve oranları
- **Kullanıcı Yönetimi**: Güvenli kayıt, giriş ve JWT token sistemi
- **Kupon Sistemi**: Maç tahminlerini birleştirerek kupon oluşturma
- **Forum Sistemi**: Kullanıcılar arası etkileşim ve blog paylaşımı
- **Otomatik Sonuç Kontrolü**: Maç sonuçlarını otomatik kontrol eden sistem
- **Rate Limiting**: API kullanımını sınırlayan güvenlik sistemi
- **Firebase Entegrasyonu**: Gerçek zamanlı veritabanı desteği

## 🏗️ Mimari Yapı

```
functions/
├── app/
│   ├── __init__.py          # Flask uygulama fabrikası
│   ├── routes/              # API endpoint'leri
│   │   ├── auth.py         # Kimlik doğrulama
│   │   ├── matches.py      # Maç yönetimi
│   │   ├── coupons.py      # Kupon işlemleri
│   │   └── forum.py        # Forum işlemleri
│   ├── services/            # İş mantığı katmanı
│   │   ├── auth_services.py
│   │   ├── match_services.py
│   │   ├── coupon_services.py
│   │   └── forum_services.py
│   ├── middleware/          # Ara yazılım katmanı
│   │   ├── auth.py         # JWT token doğrulama
│   │   ├── rate_limit.py   # Rate limiting
│   │   └── error_handler.py # Hata yönetimi
│   └── utils/               # Yardımcı fonksiyonlar
│       └── security.py     # Şifre hash'leme
├── main.py                  # Ana giriş noktası
├── check.py                 # Maç sonuç kontrolü
├── get_odds.py             # Mackolik'ten oran çekme
├── get_match_code.py       # Maç kodlarını alma
└── requirements.txt         # Python bağımlılıkları
```

## 🔧 Kurulum

### Gereksinimler

- Python 3.8+
- Firebase CLI
- Firebase Projesi

### Adımlar

1. **Firebase CLI kurulumu:**
```bash
npm install -g firebase-tools
```

2. **Firebase'e giriş:**
```bash
firebase login
```

3. **Proje dizininde:**
```bash
cd functions
pip install -r requirements.txt
```

4. **Firebase Functions'ı deploy et:**
```bash
firebase deploy --only functions
```

## 📡 API Endpoint'leri

### 🔐 Kimlik Doğrulama

#### Kullanıcı Kaydı
```http
POST /auth/register
Content-Type: application/json

{
  "username": "kullanici_adi",
  "password": "güvenli_şifre123"
}
```

#### Kullanıcı Girişi
```http
POST /auth/login
Content-Type: application/json

{
  "username": "kullanici_adi",
  "password": "güvenli_şifre123"
}
```

### ⚽ Maç Yönetimi

#### Maçları Yenile
```http
GET /matches/refresh
```

#### Maç Detayları
```http
GET /matches/details          # Tüm maçlar
GET /matches/details/{id}     # Belirli maç
```

### 🎫 Kupon İşlemleri

#### Kupon Oluştur
```http
POST /coupons/
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "id": "unique_coupon_id",
  "coupons": [
    {
      "id": "match_id",
      "taraflar": "Ev Sahibi vs Deplasman",
      "iddaa": "Maç Sonucu",
      "oran": 1.85,
      "tahmin": "1"
    }
  ],
  "betAmount": 10
}
```

#### Kuponları Kontrol Et (Admin)
```http
GET /coupons/check
Authorization: Bearer {ADMIN_JWT_TOKEN}
```

### 💬 Forum Sistemi

#### Blog Oluştur
```http
POST /forum/blog
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "id": "blog_id",
  "coupons": "kupon_verisi"
}
```

#### Blogları Listele
```http
GET /forum/blog
```

#### Yorum Ekle
```http
POST /forum/comment
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "post_id": "blog_id",
  "comment": "Yorum metni"
}
```

#### Yorumları Listele
```http
GET /forum/comment?post_id={blog_id}
```

## 🔒 Güvenlik Özellikleri

### JWT Token Sistemi
- 24 saat geçerli token'lar
- Kullanıcı rolü tabanlı yetkilendirme
- Güvenli token doğrulama

### Şifre Güvenliği
- bcrypt ile hash'leme
- Güçlü şifre kuralları:
  - En az 8 karakter
  - Büyük/küçük harf
  - Sayı ve özel karakter

### Rate Limiting
- IP başına saatlik 100 istek sınırı
- API kötüye kullanımını önleme

## 🎯 Futbol Tahmin Sistemi

### Desteklenen Bahis Türleri

- **Maç Sonucu**: 1, X, 2
- **Çifte Şans**: 1X, 12, X2
- **Alt/Üst**: 1.5, 2.5, 3.5, 4.5
- **Karşılıklı Gol**: Var/Yok
- **İlk Gol**: Ev Sahibi/Deplasman/Yok
- **Korner Bahisleri**: Alt/Üst, Tek/Çift
- **Yarı Sonuçları**: 1. Yarı, 2. Yarı
- **Handikap**: Çeşitli handikap seçenekleri

### Otomatik Sonuç Kontrolü
- Maç sonuçlarını otomatik kontrol
- Kazanan kuponlar için otomatik ödeme
- Gerçek zamanlı bakiye güncelleme

## 🗄️ Veritabanı Yapısı

### Firebase Realtime Database

```json
{
  "users": {
    "username": {
      "password": "hashed_password",
      "balance": 200,
      "role": "user",
      "coupons": {},
      "created_at": "timestamp"
    }
  },
  "matches": {
    "match_id": {
      "Taraflar": "Ev Sahibi vs Deplasman",
      "Tarih": "2024-01-01",
      "Lig": "Süper Lig",
      "Maç Sonucu": {
        "1": 1.85,
        "X": 3.20,
        "2": 4.50
      }
    }
  },
  "matchesDetailed": {
    "match_id": {
      "Taraf": {},
      "Alt_Üst": {},
      "Goller": {},
      "Korner_Kart": {}
    }
  },
  "blogs": {
    "blog_id": {
      "coupon": "kupon_verisi",
      "author": "username",
      "created_at": "timestamp",
      "comments": {}
    }
  }
}
```

## 🚀 Deployment

### Firebase Functions
```bash
firebase deploy --only functions
```

### Cloud Run (Alternatif)
```bash
gcloud run deploy tahmingo-api \
  --source . \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated
```

## 📊 Performans

- **Rate Limiting**: 100 istek/saat
- **Max Instances**: 10 (Firebase Functions)
- **Response Time**: <500ms (ortalama)
- **Uptime**: %99.9+ (Firebase SLA)

## 🔍 Monitoring

### Health Check
```http
GET /health
```

### Ana Sayfa
```http
GET /
```

## 🛠️ Geliştirme

### Lokal Geliştirme
```bash
cd functions
python main.py
```

### Test
```bash
# Test endpoint'leri
curl http://localhost:8080/health
curl http://localhost:8080/
```


**TahminGO Backend API** - Futbol tahmin uygulamanız için güçlü ve güvenli backend servisi 🚀⚽



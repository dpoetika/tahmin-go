# 🏆 TahminGO - Futbol Tahmin ve Forum Uygulaması

TahminGO, futbol tutkunları için geliştirilmiş modern ve kullanıcı dostu bir mobil tahmin ve forum uygulamasıdır. Kullanıcıların maç sonuçlarını tahmin edebileceği, kupon oluşturabileceği, yorum yapabileceği ve futbol topluluğuyla aktif etkileşim kurabileceği kapsamlı bir platform sunar.

## ✨ Özellikler

### 🏠 Ana Ekran
- Güncel futbol haberleri ve güncellemeler
- Öne çıkan maçlar ve sonuçlar
- Kişiselleştirilmiş içerik önerileri

### 📅 Bülten (Schedule)
- Günlük maç programları
- Farklı ligler ve turnuvalar için detaylı takvim

### 🎫 Kuponlarım
- Kişisel tahmin kuponları oluşturma
- Kupon geçmişi ve istatistikler
- Başarı oranı takibi ve analiz

### 🌍 Tribün (Forum)
- Futbol topluluğu ile aktif etkileşim
- Tahmin paylaşımları ve detaylı tartışmalar
- Yorum yapma ve cevap verme özelliği
- Sosyal medya benzeri forum deneyimi
- Topluluk içinde bilgi paylaşımı

### 👤 Profil
- Kullanıcı hesap yönetimi
- Tahmin geçmişi ve performans analizi
- Kişisel ayarlar ve tercihler

## 🚀 Teknik Özellikler

- **Cross-Platform**: iOS, Android ve Web desteği
- **Modern UI/UX**: React Native ile geliştirilmiş responsive tasarım
- **Type Safety**: TypeScript ile tip güvenliği
- **State Management**: Context API ile durum yönetimi
- **Navigation**: Expo Router ile gelişmiş navigasyon
- **Authentication**: Güvenli kullanıcı kimlik doğrulama sistemi
- **Forum System**: Yorum yapma, tartışma ve topluluk etkileşimi

## 🛠️ Teknoloji Stack

### Frontend
- **React Native** (0.79.5) - Cross-platform mobil uygulama geliştirme
- **React** (19.0.0) - UI kütüphanesi
- **TypeScript** (5.8.3) - Tip güvenliği ve geliştirici deneyimi

### Navigation & Routing
- **Expo Router** (5.1.4) - File-based routing sistemi
- **React Navigation** (7.x) - Navigasyon çözümleri

### UI & UX
- **Expo Vector Icons** (14.1.0) - İkon kütüphanesi
- **Expo Blur** (14.1.5) - Görsel efektler
- **Expo Haptics** (14.1.4) - Dokunsal geri bildirim
- **React Native Reanimated** (3.17.4) - Animasyonlar

### Storage & State
- **AsyncStorage** (2.1.2) - Yerel veri depolama
- **Context API** - Durum yönetimi

### Development Tools
- **Expo** (53.0.20) - Geliştirme platformu
- **ESLint** (9.25.0) - Kod kalitesi
- **Babel** (7.25.2) - JavaScript derleyici

## 📱 Kurulum

### Gereksinimler
- Node.js (18.0.0 veya üzeri)
- npm veya yarn
- Expo CLI
- iOS Simulator (macOS için) veya Android Studio

### Adım Adım Kurulum

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd tahmin-go
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
# veya
yarn install
```

3. **Expo CLI'yi global olarak yükleyin**
```bash
npm install -g @expo/cli
```

4. **Uygulamayı başlatın**
```bash
npm start
# veya
expo start
```

### Platform Spesifik Komutlar

```bash
# Android için
npm run android

# iOS için
npm run ios

# Web için
npm run web
```

## 🏗️ Proje Yapısı

```
tahmin-go/
├── app/                    # Ana uygulama dosyaları
│   ├── _layout.tsx        # Root layout
│   ├── auth/              # Kimlik doğrulama ekranları
│   │   ├── login.tsx      # Giriş ekranı
│   │   └── register.tsx   # Kayıt ekranı
│   ├── components/        # Yeniden kullanılabilir bileşenler
│   │   ├── CouponScreen.tsx
│   │   ├── myCoupons.tsx
│   │   └── userHeader.tsx
│   ├── detailScreens/     # Detay ekranları
│   │   ├── [key].tsx      # Dinamik maç detayı
│   │   └── blogs.tsx      # Blog ekranı
│   ├── hooks/             # Custom React hooks
│   │   ├── AuthContext.tsx # Kimlik doğrulama context'i
│   │   └── CouponContext.tsx # Kupon yönetimi context'i
│   ├── tabs/              # Tab navigasyon ekranları
│   │   ├── _layout.tsx    # Tab layout
│   │   ├── homeScreen.tsx # Ana ekran
│   │   ├── scheduleScreen.tsx # Bülten ekranı
│   │   ├── couponScreen.tsx # Kupon ekranı
│   │   ├── tribunScreen.tsx # Tribün ekranı
│   │   └── profileScreen.tsx # Profil ekranı
│   └── utils/             # Yardımcı fonksiyonlar
│       └── timeStamp.tsx  # Zaman damgası işlemleri
├── assets/                 # Görsel varlıklar
├── package.json           # Proje bağımlılıkları
├── tsconfig.json          # TypeScript konfigürasyonu
├── babel.config.js        # Babel konfigürasyonu
├── app.json               # Expo konfigürasyonu
└── README.md              # Bu dosya
```

## 🔧 Geliştirme

### Kod Kalitesi
```bash
# Linting çalıştırın
npm run lint

```

### Environment Variables
`.env` dosyası oluşturarak gerekli environment variable'ları tanımlayın:

```env
API_BASE_URL=your_api_url
API_KEY=your_api_key
```

## 📱 Build ve Deployment

### Expo Build
```bash
# Android APK build
expo build:android

# iOS IPA build
expo build:ios

# Web build
expo build:web
```

### EAS Build (Önerilen)
```bash
# EAS CLI kurulumu
npm install -g @expo/eas-cli

# Build konfigürasyonu
eas build:configure

# Build başlatma
eas build --platform android
eas build --platform ios
```

## 🧪 Test

```bash
# Test çalıştırma (test framework kurulu ise)
npm test

# Test coverage
npm run test:coverage
```

## 📊 Performans

- **Bundle Size**: Optimize edilmiş bundle boyutu
- **Memory Usage**: Verimli bellek kullanımı
- **Battery Life**: Düşük pil tüketimi
- **Network**: Akıllı cache stratejileri

## 🔒 Güvenlik

- JWT tabanlı kimlik doğrulama
- Güvenli API iletişimi
- Veri şifreleme
- XSS ve CSRF koruması

## 🌐 Desteklenen Platformlar

- **iOS**: 13.0+
- **Android**: 6.0+ (API level 23+)
- **Web**: Modern tarayıcılar (Chrome, Firefox, Safari, Edge)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

### Kod Standartları
- TypeScript kullanın
- ESLint kurallarına uyun
- Component'ler için JSDoc yorumları ekleyin
- Test coverage'ı koruyun

## 📈 Roadmap

### v1.1.0 (Yakında)
- [ ] Push notification desteği
- [ ] Canlı maç takibi
- [ ] Gelişmiş forum moderasyon araçları

### v1.2.0 (Gelecek)
- [ ] İstatistik analizi
- [ ] Çoklu dil desteği

### v2.0.0 (Uzun vadeli)
- [ ] AI destekli tahmin önerileri
- [ ] Blockchain tabanlı ödül sistemi
- [ ] VR/AR deneyimi

---

**TahminGO** ile futbol tahminlerinizi bir üst seviyeye taşıyın ve toplulukla aktif etkileşim kurun! ⚽💬🎯

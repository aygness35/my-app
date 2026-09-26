# Frontend Proje Mimarisi

Bu proje, modüler, ölçeklenebilir ve tip güvenli bir mimari hedeflenerek **React**, **TypeScript** ve **React Router** ile kurgulanmıştır.

---

## 📁 Proje Klasör Yapısı (Folder Structure)

```text
my-app/
├── public/                  # Statik dosyalar (favicon, görseller vb.)
├── src/
│   ├── assets/              # Görseller, ikonlar ve genel stiller
│   ├── components/          # UI ve Düzen Bileşenleri
│   │   ├── ui/              # Atomik/Genel bileşenler (Button, Input, Loader, Toast)
│   │   └── layout/          # Sayfa iskeletleri (Navbar, Header, Footer)
│   ├── hooks/               # Özel React Hook'ları (Örn: useFetch.ts)
│   ├── pages/               # Uygulama Sayfaları (Home, Login, ItemList, ItemDetail)
│   ├── routes/              # React Router yönlendirme yapılandırması (AppRouter.tsx)
│   ├── services/            # API Katmanı ve Veri Anahtarı
│   │   ├── api.ts           # Gerçek Fetch / Axios istemcisi
│   │   ├── mockData.ts      # Sahte veriler (Mock Data)
│   │   └── index.ts         # Mock / Gerçek API seçim anahtarı (Switch)
│   ├── types/               # TypeScript arayüz ve tip tanımlamaları
│   └── utils/               # Form doğrulama (Validation) ve yardımcı fonksiyonlar
├── README.md                # Proje dokümantasyonu
├── package.json             # Bağımlılıklar ve kütüphaneler
└── tsconfig.json            # TypeScript konfigürasyonu
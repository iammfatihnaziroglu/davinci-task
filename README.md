## Davinci Task — React + TypeScript + Tailwindcss + Vite
### Frontend Dev. Phase1

Canlı Demo: [https://davincitask.vercel.app](https://davincitask.vercel.app)

React + TypeScript + Tailwindcss + Vite ile geliştirilen bir frontend uygulamasıdır. JSONPlaceholder API’sinden kullanıcı ve gönderi verilerini çeker, listeler ve istemci tarafında CRUD (oluşturma, güncelleme, silme) işlemlerini destekler. Arayüz basit ve erişilebilir olacak şekilde tasarlanmıştır; kod tabanı TypeScript ve ESLint kurallarıyla uyumludur.

### İçindekiler
- Kurulum ve Çalıştırma
- Özellikler
- API ve Veri Modeli
- Geliştirme Script’leri
- Lint ve Kod Kalitesi
- Deploy (Vercel)

## Kurulum ve Çalıştırma

Gereksinimler:
- Node.js 18+ ve npm 9+
- Git

Kurulum:
```bash
git clone https://github.com/iammfatihnaziroglu/davinci-task.git
cd davinci-task
npm install
```

Geliştirme sunucusu:
```bash
npm run dev
# Uygulama: http://localhost:3000
```

Lint Kontrolü:
```bash
npm run lint
```

Prod build:
```bash
npm run build
# Çıktı: ./dist
```

Yerel önizleme (prod build sonrası):
```bash
npm run preview
# Varsayılan: http://localhost:4173
```

## Özellikler
- Ana sayfa `Homepage`: Kullanıcılar ve Gönderiler sayfalarına bağlantılar
- Kullanıcı Listesi: `id`, `name`, `username`, `email`
- Gönderi Listesi: `userId`, `id`, `title`
- İlişki: Gönderiler kullanıcıya `userId` ile bağlı
- CRUD: Kullanıcı ve gönderiler için ekleme, düzenleme, silme (istemci tarafında, durum yönetimiyle)
- Kısmi güncelleme: `PATCH` ile minimal payload göndererek hızlı "Quick Edit" akışı
- Yeniden yükleme olmadan silme: Optimistic UI ile anında listeden düşürme, bildirim desteği
- Form doğrulama: Basit kurallar ve geri bildirimler
- Bildirimler: Başarılı/hata durumları için kullanıcı dostu uyarılar
- UI/UX: Temiz ve anlaşılır arayüz (TailwindCSS v4.1)
  - ID ve `userId` badge gösterimi (renkli küçük rozetler)
  - Hover durumlarında buton ve kartlarda görsel geri bildirim
  - Form validation ve error 
- TypeScript tipleri ve ESLint uyumu

## Mimari ve Dizin Yapısı
```
src/
  components/
    posts/
    users/
    common/
  hooks/
  pages/
  services/
  types/
```
- `components/`: Tekil bileşenler (kartlar, listeler, formlar, modallar)
- `hooks/`: Özel hook’lar (`useFormValidation`, `useNotification`)
- `pages/`: Sayfa düzeyindeki bileşenler (`Homepage`, `UsersPage`, `PostsPage`)
- `services/`: API erişimi ve istek soyutlamaları (`userService`, `postService`)
- `types/`: Uygulama tür tanımları (`user.ts`, `post.ts`)

## API ve Veri Modeli
- Kaynak: `https://jsonplaceholder.typicode.com/`
- Uç noktalar: `/users`, `/posts`
- Not: JSONPlaceholder yazma işlemlerini gerçek DB’ye yansıtmaz. Bu projede CRUD işlemleri istemci tarafında (local state) yönetilir; uzak API çağrıları örnek veri çekimi için kullanılır.

## Geliştirme Script’leri
- `npm run dev`: Vite geliştirme sunucusu (port: 3000)
- `npm run build`: TypeScript build + üretim derlemesi
- `npm run preview`: Üretim derlemesini yerel sunucuda önizleme
- `npm run lint`: ESLint ile kod kalitesi kontrolü

## Lint ve Kod Kalitesi
- Proje ESLint ile yapılandırılmıştır. Kurallara uyum için:
```bash
npm run lint
```

# Hastane Randevu Sistemi (Hospital Appointment System) 🏥

Bu proje, modern yazılım prensipleri (Domain-Driven Design - DDD) kullanılarak geliştirilmiş tam kapsamlı bir Hastane Randevu ve Yönetim Sistemidir.

## 🚀 Yeni Özellikler (Premium Güncelleme)

Proje, standart bir yönetim panelinden ziyade son kullanıcı deneyimini (UX) merkeze alan **"Premium"** bir web uygulamasına dönüştürülmüştür.

### 1. Modern Arayüz ve Tasarım (UI/UX)
- **Glassmorphism (Cam Efekti):** Uygulama genelinde premium hissiyatı veren derinlikli gölgeler (shadows) ve yarı saydam yüzeyler kullanıldı.
- **Koyu Tema (Dark Mode):** Uygulamanın varsayılan (default) teması, göz yormayan, son derece şık ve modern Gece Modu olarak ayarlandı.
- **Dinamik Renk Temaları:** Sadece karanlık/aydınlık değil, tam 12 farklı vurgu rengi (İndigo, Gül, Zümrüt, Kehribar vb.) ile kullanıcıların sistemi kişiselleştirmesi sağlandı. Tüm seçimler tarayıcı hafızasında (`localStorage`) tutulur.

### 2. Çoklu Dil Desteği (i18n)
- Sistem tam **8 farklı dilde** (Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, Rusça, Arapça ve Çince) çalışacak şekilde tasarlandı.
- Gelişmiş dil yönetim sistemi (Context API tabanlı) sayesinde çeviriler, sayfa yenilenmeden anlık olarak değişir. Ekrana yansıyan tüm statik metinler (Hatta "Göz Polikliniği" gibi dinamik veriler bile) anlık çevrilir.

### 3. Gelişmiş Güvenlik ve Kimlik Doğrulama (Spring Security & JWT)
- **Güvenlik Duvarı:** Backend API uç noktaları dış dünyaya tamamen kapatılarak yetkisiz erişimler engellendi.
- **JWT (JSON Web Token):** Kullanıcı girişleri token mimarisi üzerinden güvenli hale getirildi. 
- **Veritabanı Destekli Kayıt (Registration):** Sistemi kullanmak isteyen yöneticiler için yepyeni bir Kayıt Ekranı geliştirildi. `User` Entity'si üzerinden veritabanına kayıt atılır.
- **BCrypt Şifreleme:** Kullanıcı şifreleri veritabanına ASLA düz metin olarak kaydedilmez. BCrypt algoritması ile geri döndürülemez şekilde şifrelenir (Hash).
- **Yönlendirme:** Geçersiz bir token ile işlem yapmaya çalışan kullanıcı, sistem tarafından saniyesinde güvenli `Login` ekranına yönlendirilir.

### 4. Domain-Driven Design (DDD) Mimarisi
- Backend; `api`, `impl` ve `web` paketlerine bölünerek, bileşenlerin birbirinden bağımsız, test edilebilir ve genişletilebilir olması sağlandı. 
- Katı kurallı mimari yapı sayesinde (Örneğin `User` domain'inin ayrılması) projenin ilerleyen yıllarda bile kolayca yönetilebilmesi hedeflendi.

---

## 🛠 Teknolojiler

### Backend
- **Java 17 & Spring Boot 3**
- **Spring Security & JWT (io.jsonwebtoken)**
- **Spring Data JPA & Hibernate**
- **MySQL Veritabanı**
- **Maven**

### Frontend
- **Next.js (App Router) & React 18**
- **Vanilla CSS (CSS Modules & CSS Variables)**
- **Context API (State Yönetimi)**

---

## ⚙️ Kurulum ve Çalıştırma

### 1. Veritabanı (MySQL)
Uygulamayı çalıştırmadan önce yerel makinenizde MySQL sunucusunun çalıştığından emin olun. `application.properties` içerisinde:
```properties
spring.datasource.username=root
spring.datasource.password=12345678
```
gibi bilgilerinizi kendi sisteminize göre ayarlayın. Hibernate `users`, `doctors`, `patients` tablolarını otomatik oluşturacaktır.

### 2. Backend'i Başlatmak
Proje dizininde (HastaneRandevuSistm) komut satırını açıp şu komutu çalıştırın:
```bash
mvnw clean spring-boot:run
```
veya doğrudan IDE'niz üzerinden `HospitalAppointmentApplication.java` dosyasını çalıştırın.

### 3. Frontend'i Başlatmak
Yeni bir komut satırında (frontend klasörünün içinde) şu komutları çalıştırın:
```bash
cd frontend
npm install
npm run dev
```

### 4. Kullanım
- Tarayıcıda `http://localhost:3000` adresine gidin.
- Güvenlik duvarı sizi doğrudan **Login** ekranına yönlendirecektir.
- İlk kez giriyorsanız alttaki "Kayıt Ol" butonuna basarak yeni bir yönetici hesabı oluşturun.
- Ardından belirlediğiniz şifreyle sisteme giriş yaparak muhteşem arayüzün keyfini çıkarın! 🎉

# Adım 1: Maven ile projeyi derleme (Build Stage)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Sadece pom.xml dosyasını kopyalayıp bağımlılıkları indiriyoruz (Docker cache için)
COPY pom.xml .
RUN mvn dependency:go-offline

# Kaynak kodları kopyalayıp jar dosyasını oluşturuyoruz
COPY src ./src
RUN mvn clean package -DskipTests

# Adım 2: Çalıştırma Aşaması (Run Stage)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# İlk aşamada üretilen JAR dosyasını bu hafif imaja kopyalıyoruz
COPY --from=build /app/target/*.jar app.jar

# Uygulamanın çalışacağı port
EXPOSE 8080

# Uygulamayı başlat
ENTRYPOINT ["java", "-jar", "app.jar"]

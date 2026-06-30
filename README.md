# 🏥 Hospital Appointment System

A modern, full-stack Hospital Appointment System built with a clean **Domain-Driven Design (DDD)** architecture. 

This project demonstrates a fully functional REST API back-end and a responsive Next.js front-end, designed to manage hospital departments, doctors, patients, and their appointments seamlessly.

---

## ✨ Features

- **🏢 Department Management:** Add, update, and remove hospital departments.
- **👨‍⚕️ Doctor Roster:** Register doctors and assign them to specific departments.
- **🧑 Patient Records:** Securely store patient information (including National ID/TC and contact details).
- **📅 Appointment Scheduling:** Book appointments between patients and doctors with real-time status tracking (Scheduled, Completed, Cancelled, No-Show).
- **🔗 Cross-Origin Support:** Fully configured CORS allowing independent frontend/backend deployment.

---

## 🛠️ Tech Stack

**Backend:**
- **Java 17+**
- **Spring Boot 3** (Web, Data JPA)
- **MySQL 8** (Database)
- **Maven** (Dependency Management)

**Frontend:**
- **Next.js 14+** (App Router)
- **React.js**
- **Vanilla CSS Modules** (Custom modern hospital-themed UI)

---

## 🚀 How to Run Locally

### 1. Database Setup (MySQL)
Create a new database in MySQL named `hospitaldb`:
```sql
CREATE DATABASE hospitaldb;
```
*(Ensure your MySQL credentials match `application.properties` - default is root / 12345678).*

### 2. Run the Backend (Spring Boot)
Navigate to the root folder and run the Maven wrapper:
```bash
mvn clean spring-boot:run
```
The API will be available at `http://localhost:8080`. (Database tables will be created automatically).

### 3. Run the Frontend (Next.js)
Open a new terminal, navigate to the `frontend` folder, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The web application will be available at `http://localhost:3000`.

---

## 🏗️ Architecture (DDD-Lite)

The backend is structured using a Domain-Driven Design (DDD) approach to ensure clean code and separation of concerns. Each domain is self-contained:
- `api/` (DTOs, Requests, Responses)
- `impl/` (Entities, Repositories, Services)
- `web/` (REST Controllers)

Current Domains: `Department`, `Patient`, `Doctor`, `Appointment`.

---
*Developed for educational purposes to demonstrate clean architecture and modern full-stack development.*

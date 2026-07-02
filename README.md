# Hospital Appointment System 🏥

A comprehensive, multi-language Hospital Appointment and Management System developed using modern software principles (Domain-Driven Design - DDD).

## 🚀 Key Features

This project goes beyond a standard dashboard by delivering a **"Premium"** web application standard focused deeply on user experience (UX).

### 1. Modern Interface & Design (UI/UX)
- **Role-Based Dashboards:** Distinct, fluid, and tailor-made panels for Patients, Doctors, and Administrators.
- **Glassmorphism:** Deep shadows and translucent surfaces that provide a premium feel across the entire application.
- **Dynamic Color Themes:** 12 different accent colors (Indigo, Rose, Emerald, etc.) and sleek dark/light mode support. All selections are preserved in local storage.
- **Responsive Layout:** An "App-Like" full-height layout specifically crafted for a seamless experience on all screens.

### 2. Multi-Language Support (i18n)
- The system operates flawlessly in **8 different languages** (Turkish, English, German, French, Spanish, Russian, Arabic, and Chinese).
- Thanks to the advanced language management system, menus, tables, and info screens update instantly without reloading.

### 3. Advanced Security & Authentication (Spring Security & JWT)
- **JWT (JSON Web Token):** User logins and authorizations are strictly token-based.
- **Role Management (ROLE_PATIENT, ROLE_DOCTOR, ROLE_ADMIN):** API endpoints are secured and access is granted based on specific roles.
- **Smart Registration System (Doctor Requests):** Doctors wishing to join the system create a "Registration Request". Administrators can approve or reject these requests through a sleek UI.
- **BCrypt Encryption:** User passwords are encrypted with an irreversible hash rather than plain text.

### 4. Enterprise Architecture (Production-Ready)
- **Optimistic Locking:** Eliminates race conditions entirely via database versioning. If two patients attempt to book the exact same slot at the exact same millisecond, the system safely handles the collision and notifies the user.
- **JPA Auditing (Audit Logs):** Every transaction in the system is automatically tracked (Who created it and When). This provides strict historical accountability and auditing.
- **HttpOnly Cookies:** We moved away from vulnerable `localStorage` tokens. JWTs are now transmitted directly via secure, unreadable-by-JS `HttpOnly` cookies, nullifying Cross-Site Scripting (XSS) risks.

### 5. Domain-Driven Design (DDD) Architecture
- The backend is cleanly separated into `api`, `impl`, and `web` packages to maintain modularity.
- This strict architectural pattern prevents spaghetti code and ensures long-term maintainability.

---

## 📁 Project Architecture & Folder Structure

Here is a simplified overview of how the files and directories are organized for both the Frontend and Backend:

```text
HastaneRandevuSistm/
├── src/                                  # Backend (Spring Boot Java) Root
│   ├── main/java/com/hospital/appointmentsystem/
│   │   ├── appointment/                  # Appointment Module
│   │   │   ├── api/                      # DTOs, Requests, Responses
│   │   │   ├── impl/                     # Entities, Repositories, Services
│   │   │   └── web/                      # Controllers
│   │   ├── auth/                         # Authentication & Roles
│   │   ├── config/                       # Web & CORS Configurations
│   │   ├── department/                   # Hospital Departments
│   │   ├── doctor/                       # Doctor Profiles & Requests
│   │   ├── patient/                      # Patient Profiles
│   │   ├── security/                     # Spring Security & JWT Filters
│   │   └── HospitalAppointmentApplication.java
│   └── main/resources/
│       └── application.properties        # Database & Server Settings
├── frontend/                             # Frontend (Next.js & React) Root
│   ├── public/                           # Static Assets
│   ├── src/
│   │   ├── app/                          # Next.js App Router (Pages)
│   │   │   ├── login/, register/         # Auth Pages
│   │   │   ├── patient-dashboard/        # Patient Views
│   │   │   ├── doctor-dashboard/         # Doctor Views
│   │   │   ├── admin-dashboard/          # Admin Views
│   │   │   ├── settings/                 # Theme & Language Settings
│   │   │   ├── ClientLayout.js           # Main Global Layout wrapper
│   │   │   └── globals.css               # Global Styles & Theme Variables
│   │   ├── components/                   # Reusable React Components
│   │   │   ├── DoctorDashboard.js, .css  # Dashboard Component
│   │   │   ├── PatientDashboard.js, .css # Dashboard Component
│   │   │   ├── AdminDashboard.js         # Dashboard Component
│   │   │   ├── Header.js, Sidebar.js     # Navigations
│   │   │   ├── ConfirmModal.js           # Global Confirm UI
│   │   │   └── EmptyState.js             # Global Empty State UI
│   │   ├── context/
│   │   │   └── SettingsContext.js        # Global Theme & Translation Provider
│   │   ├── locales/
│   │   │   └── index.js                  # 8 Languages Translations JSON
│   │   └── services/
│   │       └── api.js                    # Fetch Wrappers for Backend APIs
│   ├── package.json                      # Node Dependencies
│   └── next.config.js                    # Next.js Config
├── pom.xml                               # Maven Dependencies
└── README.md                             # Documentation
```

---

## 🛠 Technologies Used

### Backend
- **Java 17 & Spring Boot 3**
- **Spring Security & JWT**
- **Spring Data JPA & Hibernate**
- **MySQL Database**
- **Maven** (Build Tool)

### Frontend
- **Next.js (App Router) & React 18**
- **Vanilla CSS** (CSS Modules & Global CSS Variables)
- **Context API** (For Theme and Language Management)

---

## ⚙️ Installation & Running Guide

The application consists of two separate parts: Backend (Java) and Frontend (Next.js). You must start both sequentially.

### 1. Database (MySQL) Setup
Before running the application, ensure that your local MySQL server is active. Update your database credentials in `src/main/resources/application.properties` to match your system:
```properties
spring.datasource.username=root
spring.datasource.password=12345678
```
*Note: Once the project runs, tables (`users`, `doctors`, `patients`, etc.) will be automatically generated by Hibernate.*

### 2. Starting the Backend (via Terminal)
Open a new command prompt (Terminal/PowerShell) in the main project directory (`HastaneRandevuSistm`) and run the following command using Apache Maven:
```bash
mvn clean spring-boot:run
```
*(If the command fails, check your Maven Path settings or run `HospitalAppointmentApplication.java` directly from your IDE.)*

When the server starts successfully, you will see a message like `Tomcat started on port(s): 8080`. Leave this terminal open.

### 3. Starting the Frontend
Now, open a **new** command prompt, navigate to the `frontend` folder, install the packages, and start the development server:
```bash
cd frontend
npm install
npm run dev
```

### 4. Default Accounts & Usage
- Open your browser and navigate to `http://localhost:3000`.
- The system automatically creates a default administrator account upon first startup.
- **Admin Login:**
  - **Username/TC No:** `admin`
  - **Password:** `admin123`
- Once logged in as an admin, you can view the Admin Dashboard, approve doctor requests, and manage the system. Click the "Settings (Gear ⚙️)" icon in the top right corner to switch between 12 different color themes and languages, and enjoy the premium design! 🎉

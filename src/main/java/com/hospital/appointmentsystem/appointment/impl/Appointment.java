package com.hospital.appointmentsystem.appointment.impl;

import com.hospital.appointmentsystem.doctor.impl.Doctor;
import com.hospital.appointmentsystem.patient.impl.Patient;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  📅 APPOINTMENT ENTITY — Randevu Tablosu (EN KARMAŞIK ENTITY!) ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║                                                                  ║
 * ║  🆕 YENİ KAVRAMLAR:                                             ║
 * ║                                                                  ║
 * ║  1. ÇOKLU @ManyToOne İLİŞKİ                                    ║
 * ║     → Randevu hem Hasta'ya hem Doktor'a bağlı                  ║
 * ║     → İki tane foreign key var!                                 ║
 * ║                                                                  ║
 * ║  2. @Enumerated                                                  ║
 * ║     → Enum tipini veritabanında saklamak için kullanılır         ║
 * ║                                                                  ║
 * ║  3. LocalDateTime                                                ║
 * ║     → Tarih ve saat bilgisini tutar                              ║
 * ║                                                                  ║
 * ║  Veritabanında oluşacak tablo:                                   ║
 * ║  ┌────┬────────────┬───────────┬─────────────────┬────────┐     ║
 * ║  │ id │ patient_id │ doctor_id │ appointment_date│ status │     ║
 * ║  ├────┼────────────┼───────────┼─────────────────┼────────┤     ║
 * ║  │ 1  │ 1 (Ahmet)  │ 2 (Dr.X)  │ 2026-07-15 10:00│SCHEDULED│   ║
 * ║  │ 2  │ 1 (Ahmet)  │ 3 (Dr.Y)  │ 2026-07-20 14:30│COMPLETED│   ║
 * ║  └────┴────────────┴───────────┴─────────────────┴────────┘     ║
 * ║                                                                  ║
 * ║  Dikkat: Bir hasta birden fazla randevu alabilir!               ║
 * ║  Bir doktorun birden fazla randevusu olabilir!                  ║
 * ║                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ══════════════════════════════════════════════════════════
    //  ⭐ ÇOKLU İLİŞKİLER — İki tane @ManyToOne
    // ══════════════════════════════════════════════════════════

    // ──────────────────────────────────────────────────────────
    // 📌 İLİŞKİ 1: Randevu → Hasta (Many-to-One)
    // Birçok randevu, bir hastaya ait olabilir
    // (Bir hasta birden fazla randevu alabilir)
    // ──────────────────────────────────────────────────────────
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // ──────────────────────────────────────────────────────────
    // 📌 İLİŞKİ 2: Randevu → Doktor (Many-to-One)
    // Birçok randevu, bir doktora ait olabilir
    // (Bir doktorun birden fazla randevusu olabilir)
    // ──────────────────────────────────────────────────────────
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // ──────────────────────────────────────────────────────────
    // 📌 LocalDateTime — Tarih ve Saat
    //
    // Java'da tarih/saat için LocalDateTime kullanılır.
    // Örnek: 2026-07-15T10:30:00 → 15 Temmuz 2026, saat 10:30
    //
    // Veritabanında TIMESTAMP olarak saklanır.
    // ──────────────────────────────────────────────────────────
    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;

    // ──────────────────────────────────────────────────────────
    // 📌 @Enumerated(EnumType.STRING)
    //
    // Enum'u veritabanında NASIL saklayacağını belirler:
    //
    // EnumType.STRING  → "SCHEDULED", "COMPLETED" gibi METİN olarak
    //                    (Önerilen! Okunabilir ve güvenli)
    //
    // EnumType.ORDINAL → 0, 1, 2, 3 gibi SAYI olarak
    //                    (Tehlikeli! Enum sırası değişirse veri bozulur)
    //
    // Örnek:
    // STRING  → veritabanında "SCHEDULED" yazar
    // ORDINAL → veritabanında "0" yazar (anlaşılmaz!)
    // ──────────────────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AppointmentStatus status;

    @Column(name = "notes", length = 500)
    private String notes;

    // JPA için ZORUNLU
    public Appointment() {
    }

    // ── Getter ve Setter ──

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

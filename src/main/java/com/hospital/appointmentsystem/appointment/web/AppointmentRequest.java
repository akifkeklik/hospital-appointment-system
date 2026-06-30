package com.hospital.appointmentsystem.appointment.web;

import java.time.LocalDateTime;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 📥 Appointment Request — Randevu oluşturma/güncelleme isteği.
 *
 * Örnek JSON:
 * {
 *   "patientId": 1,
 *   "doctorId": 2,
 *   "appointmentDate": "2026-07-15T10:30:00",
 *   "notes": "Göğüs ağrısı şikayeti"
 * }
 *
 * 📌 Tarih formatı: "YYYY-MM-DDTHH:MM:SS"
 * T harfi, tarih ile saati ayırır (ISO 8601 standardı)
 */
public class AppointmentRequest {

    @NotNull(message = "Hasta seçimi zorunludur")
    private Long patientId;

    @NotNull(message = "Doktor seçimi zorunludur")
    private Long doctorId;

    @NotNull(message = "Randevu tarihi zorunludur")
    @FutureOrPresent(message = "Randevu tarihi geçmiş bir zaman olamaz")
    private LocalDateTime appointmentDate;

    @Size(max = 500, message = "Notlar en fazla 500 karakter olabilir")
    private String notes;

    public AppointmentRequest() {
    }

    // ── Getter ve Setter ──

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

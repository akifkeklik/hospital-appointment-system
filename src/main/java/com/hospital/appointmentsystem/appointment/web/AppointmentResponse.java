package com.hospital.appointmentsystem.appointment.web;

import java.time.LocalDateTime;

/**
 * 📤 Appointment Response — Randevu API yanıt modeli.
 *
 * Yanıtta hasta adı, doktor adı ve bölüm adı var →
 * İstemci tüm bilgiyi tek seferde alır, ek istek yapmasına gerek kalmaz!
 */
public class AppointmentResponse {

    private Long id;
    private Long patientId;
    private String patientFullName;
    private Long doctorId;
    private String doctorFullName;
    private String departmentName;
    private LocalDateTime appointmentDate;
    private String status;
    private String notes;

    public AppointmentResponse() {
    }

    // ── Getter ve Setter ──

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientFullName() {
        return patientFullName;
    }

    public void setPatientFullName(String patientFullName) {
        this.patientFullName = patientFullName;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorFullName() {
        return doctorFullName;
    }

    public void setDoctorFullName(String doctorFullName) {
        this.doctorFullName = doctorFullName;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

package com.hospital.appointmentsystem.doctor.api;

/**
 * 📦 Doctor DTO — Doktor veri transfer objesi.
 *
 * 📌 ÖNEMLİ FARK:
 * Entity'de department alanı "Department" objesi olarak tutulur (ilişki).
 * Ama DTO'da sadece departmentId (Long) ve departmentName (String) tutuyoruz.
 *
 * Neden?
 * → DTO'lar basit olmalı, iç içe karmaşık objeler içermemeli
 * → İstemciye sadece "hangi bölümde" bilgisini veriyoruz
 * → İstemci bölüm detayını merak ederse /api/departments/{id} ile alır
 */
public class DoctorDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String tcIdentityNumber;
    private String specialization;
    private String phoneNumber;
    private String email;

    // İlişkili entity'nin sadece ID ve adı
    private Long departmentId;
    private String departmentName;

    public DoctorDto() {
    }

    // ── Getter ve Setter ──

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getTcIdentityNumber() {
        return tcIdentityNumber;
    }

    public void setTcIdentityNumber(String tcIdentityNumber) {
        this.tcIdentityNumber = tcIdentityNumber;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }
}

package com.hospital.appointmentsystem.doctor.web;

/**
 * 📥 Doctor Request — Doktor oluşturma/güncelleme isteği.
 *
 * ⭐ departmentId alanına dikkat!
 * İstemci doktor oluştururken, hangi bölüme ait olduğunu
 * departmentId ile belirtir.
 *
 * Örnek JSON:
 * {
 *   "firstName": "Ahmet",
 *   "lastName": "Yılmaz",
 *   "specialization": "Cardiologist",
 *   "phoneNumber": "05551234567",
 *   "email": "ahmet@hospital.com",
 *   "departmentId": 1
 * }
 */
public class DoctorRequest {

    private String firstName;
    private String lastName;
    private String specialization;
    private String phoneNumber;
    private String email;
    private Long departmentId; // ⭐ Hangi bölüme ait?

    public DoctorRequest() {
    }

    // ── Getter ve Setter ──

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
}

package com.hospital.appointmentsystem.patient.api;

/**
 * 📦 Patient DTO — Hasta verisi taşıma objesi.
 * Service katmanında kullanılır, katmanlar arası veri aktarır.
 */
public class PatientDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String tcIdentityNumber;
    private String phoneNumber;
    private String email;

    public PatientDto() {
    }

    public PatientDto(Long id, String firstName, String lastName,
                      String tcIdentityNumber, String phoneNumber, String email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.tcIdentityNumber = tcIdentityNumber;
        this.phoneNumber = phoneNumber;
        this.email = email;
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
}

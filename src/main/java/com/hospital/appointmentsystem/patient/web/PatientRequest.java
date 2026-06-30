package com.hospital.appointmentsystem.patient.web;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 📥 Patient Request — Hasta oluşturma/güncelleme isteği.
 */
public class PatientRequest {

    @NotBlank(message = "Ad alanı zorunludur")
    @Size(max = 50, message = "Ad en fazla 50 karakter olabilir")
    private String firstName;

    @NotBlank(message = "Soyad alanı zorunludur")
    @Size(max = 50, message = "Soyad en fazla 50 karakter olabilir")
    private String lastName;

    @NotBlank(message = "TC Kimlik numarası zorunludur")
    @Size(min = 11, max = 11, message = "TC Kimlik numarası tam olarak 11 haneli olmalıdır")
    private String tcIdentityNumber;

    @Size(max = 15, message = "Telefon numarası en fazla 15 karakter olabilir")
    private String phoneNumber;

    @Email(message = "Geçerli bir e-posta adresi giriniz")
    @Size(max = 100, message = "E-posta adresi çok uzun")
    private String email;

    public PatientRequest() {
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

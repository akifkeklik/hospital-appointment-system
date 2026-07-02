package com.hospital.appointmentsystem.user.impl;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // Örn: "ROLE_ADMIN", "ROLE_DOCTOR", "ROLE_PATIENT"

    // İlgili tablodaki asıl kaydın ID'si (Örn: doctors tablosundaki id veya patients tablosundaki id)
    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "needs_password_change", nullable = false)
    private Boolean needsPasswordChange = false;

    public User() {}

    public User(String username, String email, String password, String role, Long referenceId) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.referenceId = referenceId;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Long getReferenceId() { return referenceId; }
    public void setReferenceId(Long referenceId) { this.referenceId = referenceId; }
    public Boolean getNeedsPasswordChange() { return needsPasswordChange; }
    public void setNeedsPasswordChange(Boolean needsPasswordChange) { this.needsPasswordChange = needsPasswordChange; }
}

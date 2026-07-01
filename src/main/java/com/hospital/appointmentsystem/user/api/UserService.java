package com.hospital.appointmentsystem.user.api;

public interface UserService {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    void registerUser(String username, String email, String password, String role, Long referenceId);
}

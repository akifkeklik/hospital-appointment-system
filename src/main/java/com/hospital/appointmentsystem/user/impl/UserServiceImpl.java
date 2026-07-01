package com.hospital.appointmentsystem.user.impl;

import com.hospital.appointmentsystem.user.api.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Override
    public void registerUser(String username, String email, String password) {
        User newUser = new User(
                username,
                email,
                passwordEncoder.encode(password),
                "ADMIN" // Şimdilik tüm kayıt olanlar ADMIN rolüne sahip.
        );
        userRepository.save(newUser);
    }
}

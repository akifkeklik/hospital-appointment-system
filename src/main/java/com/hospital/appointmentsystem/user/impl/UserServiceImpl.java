package com.hospital.appointmentsystem.user.impl;

import com.hospital.appointmentsystem.user.api.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

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
    public void registerUser(String username, String email, String password, String role, Long referenceId) {
        User newUser = new User(
                username,
                email,
                passwordEncoder.encode(password),
                role,
                referenceId
        );
        userRepository.save(newUser);
    }

    @Override
    public boolean resetPassword(String username, String email, String newPassword) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            // Güvenlik: Eğer kullanıcının kaydındaki email ile formdaki email aynıysa sıfırla
            if (user.getEmail().equalsIgnoreCase(email)) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }
}

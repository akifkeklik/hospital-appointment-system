package com.hospital.appointmentsystem.security;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, 
                          UserDetailsService userDetailsService, UserRepository userRepository,
                          org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public record AuthRequest(String username, String password) {}
    public record AuthResponse(String token) {}
    public record RegisterRequest(String username, String email, String password) {}

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.username(), authRequest.password())
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Giriş bilgileri hatalı.");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.username());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());

        return ResponseEntity.ok(new AuthResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByUsername(registerRequest.username()).isPresent()) {
            return ResponseEntity.badRequest().body("Hata: Bu kullanıcı adı zaten alınmış.");
        }
        if (userRepository.findByEmail(registerRequest.email()).isPresent()) {
            return ResponseEntity.badRequest().body("Hata: Bu e-posta adresi zaten kullanılıyor.");
        }

        User newUser = new User(
                registerRequest.username(),
                registerRequest.email(),
                passwordEncoder.encode(registerRequest.password()),
                "ADMIN" // Şimdilik tüm kayıt olanlar ADMIN rolüne sahip.
        );

        userRepository.save(newUser);
        return ResponseEntity.ok("Kullanıcı başarıyla kaydedildi.");
    }
}

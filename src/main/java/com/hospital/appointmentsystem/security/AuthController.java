package com.hospital.appointmentsystem.security;

import com.hospital.appointmentsystem.user.api.UserService;
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
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, 
                          UserDetailsService userDetailsService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userService = userService;
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
        if (userService.existsByUsername(registerRequest.username())) {
            return ResponseEntity.badRequest().body("Hata: Bu kullanıcı adı zaten alınmış.");
        }
        if (userService.existsByEmail(registerRequest.email())) {
            return ResponseEntity.badRequest().body("Hata: Bu e-posta adresi zaten kullanılıyor.");
        }
        if (registerRequest.password() == null || registerRequest.password().length() < 6) {
            return ResponseEntity.badRequest().body("Hata: Şifreniz en az 6 karakter olmalıdır.");
        }

        userService.registerUser(registerRequest.username(), registerRequest.email(), registerRequest.password());

        return ResponseEntity.ok("Kullanıcı başarıyla kaydedildi.");
    }
}

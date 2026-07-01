package com.hospital.appointmentsystem.security;

import com.hospital.appointmentsystem.user.api.UserService;
import com.hospital.appointmentsystem.patient.api.PatientService;
import com.hospital.appointmentsystem.patient.api.PatientDto;
import com.hospital.appointmentsystem.user.impl.User;
import com.hospital.appointmentsystem.user.impl.UserRepository; // needed to get the user for role
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
    private final PatientService patientService;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, 
                          UserDetailsService userDetailsService, UserService userService,
                          PatientService patientService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userService = userService;
        this.patientService = patientService;
        this.userRepository = userRepository;
    }

    public record AuthRequest(String username, String password) {}
    public record AuthResponse(String token) {}
    public record RegisterRequest(String tcIdentityNumber, String firstName, String lastName, String email, String phoneNumber, String password) {}
    public record ResetPasswordRequest(String tcIdentityNumber, String email, String newPassword) {}
    public record MessageResponse(String message) {}

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.username(), authRequest.password())
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new MessageResponse("Giriş bilgileri hatalı."));
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.username());
        
        // Rol ve Referans Id'yi veritabanından çekelim
        User user = userRepository.findByUsername(authRequest.username()).orElseThrow();
        
        final String jwt = jwtUtil.generateToken(userDetails, user.getRole(), user.getReferenceId());

        return ResponseEntity.ok(new AuthResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (userService.existsByUsername(registerRequest.tcIdentityNumber())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Hata: Bu TC Kimlik Numarası zaten kayıtlı."));
        }
        if (userService.existsByEmail(registerRequest.email())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Hata: Bu e-posta adresi zaten kullanılıyor."));
        }
        if (registerRequest.password() == null || registerRequest.password().length() < 6) {
            return ResponseEntity.badRequest().body(new MessageResponse("Hata: Şifreniz en az 6 karakter olmalıdır."));
        }

        // Önce hastayı kaydet
        PatientDto patientDto = new PatientDto(null, registerRequest.firstName(), registerRequest.lastName(), 
                                                registerRequest.tcIdentityNumber(), registerRequest.phoneNumber(), 
                                                registerRequest.email());
        PatientDto savedPatient = patientService.createPatient(patientDto);

        // Sonra kullanıcıyı oluştur (ROLE_PATIENT) - TC Kimlik Numarasını kullanıcı adı olarak kullanıyoruz.
        userService.registerUser(registerRequest.tcIdentityNumber(), registerRequest.email(), registerRequest.password(), 
                                 "ROLE_PATIENT", savedPatient.getId());

        return ResponseEntity.ok(new MessageResponse("Kullanıcı başarıyla kaydedildi."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request.newPassword() == null || request.newPassword().length() < 6) {
            return ResponseEntity.badRequest().body(new MessageResponse("Hata: Yeni şifreniz en az 6 karakter olmalıdır."));
        }
        
        boolean success = userService.resetPassword(request.tcIdentityNumber(), request.email(), request.newPassword());
        
        if (success) {
            return ResponseEntity.ok(new MessageResponse("Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz."));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Hata: Girdiğiniz TC Kimlik Numarası veya E-Posta adresi sistemimizle eşleşmiyor."));
        }
    }

    // GEÇİCİ: Geliştirme aşamasında kilitli kalan TC'leri silmek için
    @GetMapping("/force-delete/{tc}")
    public ResponseEntity<?> forceDelete(@PathVariable String tc) {
        userRepository.findByUsername(tc).ifPresent(userRepository::delete);
        return ResponseEntity.ok(new MessageResponse(tc + " numaralı kayıt veritabanından tamamen silindi. Şimdi baştan kayıt olabilirsiniz!"));
    }
}

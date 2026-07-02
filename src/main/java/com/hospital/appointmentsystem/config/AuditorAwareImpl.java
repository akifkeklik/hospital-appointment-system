package com.hospital.appointmentsystem.config;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("auditorAware")
public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return Optional.of("SYSTEM"); // Eğer sisteme giriş yapılmamışsa SYSTEM olarak kaydet
        }

        // Spring Security'deki Username (Biz TC Kimlik veya admin kullanıcı adı kullanıyoruz)
        return Optional.of(authentication.getName());
    }
}

package com.hospital.appointmentsystem.setting.web;

import com.hospital.appointmentsystem.setting.api.SystemSettingDto;
import com.hospital.appointmentsystem.setting.api.SystemSettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings")
public class SystemSettingController {

    private final SystemSettingService systemSettingService;

    public SystemSettingController(SystemSettingService systemSettingService) {
        this.systemSettingService = systemSettingService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemSettingDto> getSettings() {
        return ResponseEntity.ok(systemSettingService.getSettings());
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemSettingDto> updateSettings(@RequestBody SystemSettingDto dto) {
        return ResponseEntity.ok(systemSettingService.updateSettings(dto));
    }
}

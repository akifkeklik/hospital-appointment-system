package com.hospital.appointmentsystem.setting.impl;

import com.hospital.appointmentsystem.setting.api.SystemSettingDto;
import com.hospital.appointmentsystem.setting.api.SystemSettingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SystemSettingServiceImpl implements SystemSettingService {

    private final SystemSettingRepository repository;

    public SystemSettingServiceImpl(SystemSettingRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public SystemSettingDto getSettings() {
        SystemSetting setting = repository.findById(1L).orElseGet(() -> {
            SystemSetting defaultSetting = new SystemSetting(15, "09:00", "17:00", false);
            return repository.save(defaultSetting);
        });
        return mapToDto(setting);
    }

    @Override
    @Transactional
    public SystemSettingDto updateSettings(SystemSettingDto dto) {
        SystemSetting setting = repository.findById(1L).orElseGet(() -> new SystemSetting());
        
        setting.setAppointmentDuration(dto.getAppointmentDuration());
        setting.setWorkStartTime(dto.getWorkStartTime());
        setting.setWorkEndTime(dto.getWorkEndTime());
        setting.setMaintenanceMode(dto.getMaintenanceMode());

        setting = repository.save(setting);
        return mapToDto(setting);
    }

    private SystemSettingDto mapToDto(SystemSetting setting) {
        return new SystemSettingDto(
                setting.getAppointmentDuration(),
                setting.getWorkStartTime(),
                setting.getWorkEndTime(),
                setting.getMaintenanceMode()
        );
    }
}

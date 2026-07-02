package com.hospital.appointmentsystem.setting.api;

public interface SystemSettingService {
    SystemSettingDto getSettings();
    SystemSettingDto updateSettings(SystemSettingDto systemSettingDto);
}

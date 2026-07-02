package com.hospital.appointmentsystem.setting.api;

public class SystemSettingDto {
    private Integer appointmentDuration;
    private String workStartTime;
    private String workEndTime;
    private Boolean maintenanceMode;

    public SystemSettingDto() {
    }

    public SystemSettingDto(Integer appointmentDuration, String workStartTime, String workEndTime, Boolean maintenanceMode) {
        this.appointmentDuration = appointmentDuration;
        this.workStartTime = workStartTime;
        this.workEndTime = workEndTime;
        this.maintenanceMode = maintenanceMode;
    }

    public Integer getAppointmentDuration() {
        return appointmentDuration;
    }

    public void setAppointmentDuration(Integer appointmentDuration) {
        this.appointmentDuration = appointmentDuration;
    }

    public String getWorkStartTime() {
        return workStartTime;
    }

    public void setWorkStartTime(String workStartTime) {
        this.workStartTime = workStartTime;
    }

    public String getWorkEndTime() {
        return workEndTime;
    }

    public void setWorkEndTime(String workEndTime) {
        this.workEndTime = workEndTime;
    }

    public Boolean getMaintenanceMode() {
        return maintenanceMode;
    }

    public void setMaintenanceMode(Boolean maintenanceMode) {
        this.maintenanceMode = maintenanceMode;
    }
}

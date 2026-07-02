package com.hospital.appointmentsystem.setting.api;

public class SystemSettingDto {
    private Integer appointmentDuration;
    private String workStartTime;
    private String workEndTime;
    private String lunchBreakStart;
    private String lunchBreakEnd;
    private Boolean maintenanceMode;

    public SystemSettingDto() {
    }

    public SystemSettingDto(Integer appointmentDuration, String workStartTime, String workEndTime, String lunchBreakStart, String lunchBreakEnd, Boolean maintenanceMode) {
        this.appointmentDuration = appointmentDuration;
        this.workStartTime = workStartTime;
        this.workEndTime = workEndTime;
        this.lunchBreakStart = lunchBreakStart;
        this.lunchBreakEnd = lunchBreakEnd;
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

    public String getLunchBreakStart() {
        return lunchBreakStart;
    }

    public void setLunchBreakStart(String lunchBreakStart) {
        this.lunchBreakStart = lunchBreakStart;
    }

    public String getLunchBreakEnd() {
        return lunchBreakEnd;
    }

    public void setLunchBreakEnd(String lunchBreakEnd) {
        this.lunchBreakEnd = lunchBreakEnd;
    }

    public Boolean getMaintenanceMode() {
        return maintenanceMode;
    }

    public void setMaintenanceMode(Boolean maintenanceMode) {
        this.maintenanceMode = maintenanceMode;
    }
}

package com.hospital.appointmentsystem.setting.impl;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "system_settings")
public class SystemSetting {

    @Id
    private Long id = 1L;

    @Column(name = "appointment_duration", nullable = false)
    private Integer appointmentDuration = 15;

    @Column(name = "work_start_time", nullable = false)
    private String workStartTime = "09:00";

    @Column(name = "work_end_time", nullable = false)
    private String workEndTime = "17:00";

    @Column(name = "lunch_break_start", nullable = false)
    private String lunchBreakStart = "12:00";

    @Column(name = "lunch_break_end", nullable = false)
    private String lunchBreakEnd = "13:00";

    @Column(name = "maintenance_mode", nullable = false)
    private Boolean maintenanceMode = false;

    public SystemSetting() {
    }

    public SystemSetting(Integer appointmentDuration, String workStartTime, String workEndTime, String lunchBreakStart, String lunchBreakEnd, Boolean maintenanceMode) {
        this.id = 1L;
        this.appointmentDuration = appointmentDuration;
        this.workStartTime = workStartTime;
        this.workEndTime = workEndTime;
        this.lunchBreakStart = lunchBreakStart;
        this.lunchBreakEnd = lunchBreakEnd;
        this.maintenanceMode = maintenanceMode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

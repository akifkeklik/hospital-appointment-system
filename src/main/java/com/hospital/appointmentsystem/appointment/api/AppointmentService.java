package com.hospital.appointmentsystem.appointment.api;

import java.util.List;

/**
 * 📋 Appointment Service Interface — Randevu iş mantığı sözleşmesi.
 */
public interface AppointmentService {

    AppointmentDto createAppointment(AppointmentDto appointmentDto);

    AppointmentDto getAppointmentById(Long id);

    List<AppointmentDto> getAllAppointments();

    /** Hastanın tüm randevularını getir */
    List<AppointmentDto> getAppointmentsByPatientId(Long patientId);

    /** Doktorun tüm randevularını getir */
    List<AppointmentDto> getAppointmentsByDoctorId(Long doctorId);

    AppointmentDto updateAppointment(Long id, AppointmentDto appointmentDto);

    /** Randevu durumunu güncelle (ör: SCHEDULED → COMPLETED) */
    AppointmentDto updateAppointmentStatus(Long id, String status);

    void deleteAppointment(Long id);
}

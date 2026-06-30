package com.hospital.appointmentsystem.doctor.api;

import java.util.List;

/**
 * 📋 Doctor Service Interface — Doktor iş mantığı sözleşmesi.
 */
public interface DoctorService {

    DoctorDto createDoctor(DoctorDto doctorDto);

    DoctorDto getDoctorById(Long id);

    List<DoctorDto> getAllDoctors();

    /**
     * Belirli bir bölümdeki doktorları getirir.
     * Örneğin: Kardiyoloji bölümündeki tüm doktorlar
     */
    List<DoctorDto> getDoctorsByDepartmentId(Long departmentId);

    DoctorDto updateDoctor(Long id, DoctorDto doctorDto);

    void deleteDoctor(Long id);
}

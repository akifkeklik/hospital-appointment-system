package com.hospital.appointmentsystem.patient.api;

import java.util.List;

/**
 * 📋 Patient Service Interface — Hasta iş mantığı sözleşmesi.
 */
public interface PatientService {

    PatientDto createPatient(PatientDto patientDto);

    PatientDto getPatientById(Long id);

    List<PatientDto> getAllPatients();

    PatientDto updatePatient(Long id, PatientDto patientDto);

    void deletePatient(Long id);
}

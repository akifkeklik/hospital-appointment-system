package com.hospital.appointmentsystem.patient.impl;

import com.hospital.appointmentsystem.patient.api.PatientDto;
import com.hospital.appointmentsystem.patient.api.PatientService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ⚙️ Patient Service Impl — Hasta iş mantığı implementasyonu.
 * Department ile aynı pattern'i takip eder.
 */
@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public PatientDto createPatient(PatientDto patientDto) {
        // İş kuralı: Aynı TC ile hasta var mı?
        if (patientRepository.existsByTcIdentityNumber(patientDto.getTcIdentityNumber())) {
            throw new RuntimeException(
                    "Bu TC Kimlik No ile kayıtlı hasta zaten var: " + patientDto.getTcIdentityNumber()
            );
        }

        Patient patient = mapToEntity(patientDto);
        Patient savedPatient = patientRepository.save(patient);
        return mapToDto(savedPatient);
    }

    @Override
    public PatientDto getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı! ID: " + id));
        return mapToDto(patient);
    }

    @Override
    public List<PatientDto> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PatientDto updatePatient(Long id, PatientDto patientDto) {
        Patient existingPatient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Güncellenecek hasta bulunamadı! ID: " + id));

        existingPatient.setFirstName(patientDto.getFirstName());
        existingPatient.setLastName(patientDto.getLastName());
        existingPatient.setTcIdentityNumber(patientDto.getTcIdentityNumber());
        existingPatient.setPhoneNumber(patientDto.getPhoneNumber());
        existingPatient.setEmail(patientDto.getEmail());

        Patient updatedPatient = patientRepository.save(existingPatient);
        return mapToDto(updatedPatient);
    }

    @Override
    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Silinecek hasta bulunamadı! ID: " + id));
        patientRepository.deleteById(id);
    }

    // ── Dönüşüm Metotları ──

    private PatientDto mapToDto(Patient patient) {
        PatientDto dto = new PatientDto();
        dto.setId(patient.getId());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setTcIdentityNumber(patient.getTcIdentityNumber());
        dto.setPhoneNumber(patient.getPhoneNumber());
        dto.setEmail(patient.getEmail());
        return dto;
    }

    private Patient mapToEntity(PatientDto dto) {
        Patient patient = new Patient();
        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setTcIdentityNumber(dto.getTcIdentityNumber());
        patient.setPhoneNumber(dto.getPhoneNumber());
        patient.setEmail(dto.getEmail());
        return patient;
    }
}

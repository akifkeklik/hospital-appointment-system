package com.hospital.appointmentsystem.patient.web;

import com.hospital.appointmentsystem.patient.api.PatientDto;
import com.hospital.appointmentsystem.patient.api.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 🌐 Patient Controller — Hasta REST API Endpoint'leri
 *
 * Department Controller ile aynı pattern'i takip eder.
 * Artık bu yapıya aşina olmalısın! 😊
 */
@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // POST /api/patients — Yeni hasta oluştur
    @PostMapping
    public ResponseEntity<PatientResponse> createPatient(
            @RequestBody PatientRequest request) {

        PatientDto dto = mapRequestToDto(request);
        PatientDto createdDto = patientService.createPatient(dto);
        PatientResponse response = mapDtoToResponse(createdDto);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // GET /api/patients/{id} — ID ile hasta getir
    @GetMapping("/{id}")
    public ResponseEntity<PatientResponse> getPatientById(@PathVariable Long id) {

        PatientDto dto = patientService.getPatientById(id);
        PatientResponse response = mapDtoToResponse(dto);

        return ResponseEntity.ok(response);
    }

    // GET /api/patients — Tüm hastaları listele
    @GetMapping
    public ResponseEntity<List<PatientResponse>> getAllPatients() {

        List<PatientDto> dtos = patientService.getAllPatients();
        List<PatientResponse> responses = dtos.stream()
                .map(this::mapDtoToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    // PUT /api/patients/{id} — Hasta güncelle
    @PutMapping("/{id}")
    public ResponseEntity<PatientResponse> updatePatient(
            @PathVariable Long id,
            @RequestBody PatientRequest request) {

        PatientDto dto = mapRequestToDto(request);
        PatientDto updatedDto = patientService.updatePatient(id, dto);
        PatientResponse response = mapDtoToResponse(updatedDto);

        return ResponseEntity.ok(response);
    }

    // DELETE /api/patients/{id} — Hasta sil
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {

        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

    // ── Dönüşüm Metotları ──

    private PatientDto mapRequestToDto(PatientRequest request) {
        PatientDto dto = new PatientDto();
        dto.setFirstName(request.getFirstName());
        dto.setLastName(request.getLastName());
        dto.setTcIdentityNumber(request.getTcIdentityNumber());
        dto.setPhoneNumber(request.getPhoneNumber());
        dto.setEmail(request.getEmail());
        return dto;
    }

    private PatientResponse mapDtoToResponse(PatientDto dto) {
        PatientResponse response = new PatientResponse();
        response.setId(dto.getId());
        response.setFirstName(dto.getFirstName());
        response.setLastName(dto.getLastName());
        response.setTcIdentityNumber(dto.getTcIdentityNumber());
        response.setPhoneNumber(dto.getPhoneNumber());
        response.setEmail(dto.getEmail());
        return response;
    }
}

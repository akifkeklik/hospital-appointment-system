package com.hospital.appointmentsystem.appointment.impl;

import com.hospital.appointmentsystem.appointment.api.AppointmentDto;
import com.hospital.appointmentsystem.appointment.api.AppointmentService;
import com.hospital.appointmentsystem.doctor.impl.Doctor;
import com.hospital.appointmentsystem.doctor.impl.DoctorRepository;
import com.hospital.appointmentsystem.patient.impl.Patient;
import com.hospital.appointmentsystem.patient.impl.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ⚙️ APPOINTMENT SERVICE IMPL — En Karmaşık Servis!              ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║                                                                  ║
 * ║  Bu serviste 3 repository kullanıyoruz:                         ║
 * ║  - AppointmentRepository → Randevu işlemleri                    ║
 * ║  - PatientRepository     → Hasta bilgisini çekmek için         ║
 * ║  - DoctorRepository      → Doktor bilgisini çekmek için        ║
 * ║                                                                  ║
 * ║  Randevu oluştururken:                                           ║
 * ║  1. İstemci patientId ve doctorId gönderir                      ║
 * ║  2. Biz bu ID'lerle Patient ve Doctor objelerini buluruz        ║
 * ║  3. Appointment'a bağlarız                                      ║
 * ║                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    // ⭐ ÜÇ repository enjeksiyonu
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  PatientRepository patientRepository,
                                  DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @Override
    public AppointmentDto createAppointment(AppointmentDto appointmentDto) {

        // 1. Hastayı bul
        Patient patient = patientRepository.findById(appointmentDto.getPatientId())
                .orElseThrow(() -> new RuntimeException(
                        "Hasta bulunamadı! ID: " + appointmentDto.getPatientId()
                ));

        // 2. Doktoru bul
        Doctor doctor = doctorRepository.findById(appointmentDto.getDoctorId())
                .orElseThrow(() -> new RuntimeException(
                        "Doktor bulunamadı! ID: " + appointmentDto.getDoctorId()
                ));

        // 3. Randevu oluştur ve ilişkileri kur
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);                          // ⭐ Hasta ilişkisi
        appointment.setDoctor(doctor);                            // ⭐ Doktor ilişkisi
        appointment.setAppointmentDate(appointmentDto.getAppointmentDate());
        appointment.setStatus(AppointmentStatus.SCHEDULED);       // ⭐ Varsayılan durum
        appointment.setNotes(appointmentDto.getNotes());

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToDto(savedAppointment);
    }

    @Override
    public AppointmentDto getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Randevu bulunamadı! ID: " + id));
        return mapToDto(appointment);
    }

    @Override
    public List<AppointmentDto> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDto> getAppointmentsByPatientId(Long patientId) {
        if (!patientRepository.existsById(patientId)) {
            throw new RuntimeException("Hasta bulunamadı! ID: " + patientId);
        }
        return appointmentRepository.findByPatientId(patientId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDto> getAppointmentsByDoctorId(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new RuntimeException("Doktor bulunamadı! ID: " + doctorId);
        }
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentDto updateAppointment(Long id, AppointmentDto appointmentDto) {
        Appointment existingAppointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Randevu bulunamadı! ID: " + id));

        Patient patient = patientRepository.findById(appointmentDto.getPatientId())
                .orElseThrow(() -> new RuntimeException(
                        "Hasta bulunamadı! ID: " + appointmentDto.getPatientId()
                ));

        Doctor doctor = doctorRepository.findById(appointmentDto.getDoctorId())
                .orElseThrow(() -> new RuntimeException(
                        "Doktor bulunamadı! ID: " + appointmentDto.getDoctorId()
                ));

        existingAppointment.setPatient(patient);
        existingAppointment.setDoctor(doctor);
        existingAppointment.setAppointmentDate(appointmentDto.getAppointmentDate());
        existingAppointment.setNotes(appointmentDto.getNotes());

        // Durum gönderildiyse güncelle
        if (appointmentDto.getStatus() != null) {
            existingAppointment.setStatus(AppointmentStatus.valueOf(appointmentDto.getStatus()));
        }

        Appointment updatedAppointment = appointmentRepository.save(existingAppointment);
        return mapToDto(updatedAppointment);
    }

    // ──────────────────────────────────────────────────────────
    // ⭐ DURUM GÜNCELLEME — Sadece durumu değiştir
    //
    // Randevuyu iptal etmek veya tamamlandı olarak işaretlemek
    // için tüm bilgileri göndermek yerine sadece durumu
    // güncelleyebilirsin.
    //
    // AppointmentStatus.valueOf("COMPLETED")
    // → String'i Enum'a çevirir
    // → Eğer geçersiz bir değer gelirse hata fırlatır
    // ──────────────────────────────────────────────────────────
    @Override
    public AppointmentDto updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Randevu bulunamadı! ID: " + id));

        // String → Enum dönüşümü
        // "COMPLETED" → AppointmentStatus.COMPLETED
        try {
            AppointmentStatus newStatus = AppointmentStatus.valueOf(status.toUpperCase());
            appointment.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(
                    "Geçersiz randevu durumu: " + status +
                    ". Geçerli değerler: SCHEDULED, COMPLETED, CANCELLED, NO_SHOW"
            );
        }

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapToDto(updatedAppointment);
    }

    @Override
    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Silinecek randevu bulunamadı! ID: " + id));
        appointmentRepository.deleteById(id);
    }

    // ── Dönüşüm Metotları ──

    private AppointmentDto mapToDto(Appointment appointment) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getId());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setStatus(appointment.getStatus().name()); // Enum → String
        dto.setNotes(appointment.getNotes());

        // ⭐ İlişkili entity'lerden bilgi çekme
        // Hasta bilgisi
        dto.setPatientId(appointment.getPatient().getId());
        dto.setPatientFullName(
                appointment.getPatient().getFirstName() + " " +
                appointment.getPatient().getLastName()
        );

        // Doktor bilgisi
        dto.setDoctorId(appointment.getDoctor().getId());
        dto.setDoctorFullName(
                appointment.getDoctor().getFirstName() + " " +
                appointment.getDoctor().getLastName()
        );

        // Doktorun bölümü
        dto.setDepartmentName(appointment.getDoctor().getDepartment().getName());

        return dto;
    }
}

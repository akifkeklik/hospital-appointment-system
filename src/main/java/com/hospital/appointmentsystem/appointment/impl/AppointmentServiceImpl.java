package com.hospital.appointmentsystem.appointment.impl;

import com.hospital.appointmentsystem.appointment.api.AppointmentDto;
import com.hospital.appointmentsystem.appointment.api.AppointmentService;
import com.hospital.appointmentsystem.doctor.impl.Doctor;
import com.hospital.appointmentsystem.doctor.impl.DoctorRepository;
import com.hospital.appointmentsystem.patient.impl.Patient;
import com.hospital.appointmentsystem.patient.impl.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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

        // ⭐ Randevu saati uygunluk kontrolü
        LocalDate date = appointmentDto.getAppointmentDate().toLocalDate();
        LocalTime time = appointmentDto.getAppointmentDate().toLocalTime();
        
        List<String> availableSlots = getAvailableSlots(doctor.getId(), date);
        
        // saniyeleri atıp saat:dakika formatında kontrol et (örn: "09:15")
        String timeString = String.format("%02d:%02d", time.getHour(), time.getMinute());
        if (!availableSlots.contains(timeString)) {
            throw new RuntimeException("Seçilen randevu saati dolu veya mesai saatleri dışında!");
        }

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
    public Page<AppointmentDto> getAllAppointments(Pageable pageable) {
        Page<Appointment> appointments = appointmentRepository.findAll(pageable);
        return appointments.map(this::mapToDto);
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
    public List<String> getAvailableSlots(Long doctorId, LocalDate date) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new RuntimeException("Doktor bulunamadı! ID: " + doctorId);
        }

        // Tüm günün randevularını çek
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        
        List<Appointment> existingAppointments = appointmentRepository.findByDoctorId(doctorId).stream()
            .filter(app -> app.getStatus() == AppointmentStatus.SCHEDULED)
            .filter(app -> app.getAppointmentDate().isAfter(startOfDay) && app.getAppointmentDate().isBefore(endOfDay))
            .collect(Collectors.toList());

        // Dolu saatlerin listesi
        List<LocalTime> bookedTimes = existingAppointments.stream()
            .map(app -> app.getAppointmentDate().toLocalTime())
            .collect(Collectors.toList());

        List<String> availableSlots = new ArrayList<>();
        LocalTime currentTime = LocalTime.of(9, 0); // Mesai başlangıcı
        LocalTime endOfWork = LocalTime.of(17, 0); // Mesai bitişi

        while (currentTime.isBefore(endOfWork)) {
            // Öğle arası kontrolü (12:00 - 13:00)
            if (!(currentTime.isAfter(LocalTime.of(11, 59)) && currentTime.isBefore(LocalTime.of(13, 0)))) {
                // Eğer bu saatte randevu yoksa ve saat geçmişte değilse ekle
                if (!bookedTimes.contains(currentTime)) {
                    // Eğer bugün seçildiyse, geçmiş saatleri gösterme
                    if (!(date.isEqual(LocalDate.now()) && currentTime.isBefore(LocalTime.now()))) {
                        availableSlots.add(currentTime.toString());
                    }
                }
            }
            currentTime = currentTime.plusMinutes(15);
        }

        return availableSlots;
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

        // ⭐ Randevu saati değiştiyse veya doktor değiştiyse uygunluk kontrolü yap
        boolean timeOrDoctorChanged = !existingAppointment.getAppointmentDate().equals(appointmentDto.getAppointmentDate()) || 
                                      !existingAppointment.getDoctor().getId().equals(doctor.getId());
                                      
        if (timeOrDoctorChanged) {
            LocalDate date = appointmentDto.getAppointmentDate().toLocalDate();
            LocalTime time = appointmentDto.getAppointmentDate().toLocalTime();
            
            List<String> availableSlots = getAvailableSlots(doctor.getId(), date);
            String timeString = String.format("%02d:%02d", time.getHour(), time.getMinute());
            
            if (!availableSlots.contains(timeString)) {
                throw new RuntimeException("Seçilen randevu saati dolu veya mesai saatleri dışında!");
            }
        }

        existingAppointment.setAppointmentDate(appointmentDto.getAppointmentDate());
        existingAppointment.setNotes(appointmentDto.getNotes());

        // Durum gönderildiyse güncelle
        if (appointmentDto.getStatus() != null) {
            AppointmentStatus newStatus = AppointmentStatus.valueOf(appointmentDto.getStatus());
            if ((newStatus == AppointmentStatus.COMPLETED || newStatus == AppointmentStatus.NO_SHOW) 
                && appointmentDto.getAppointmentDate().isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Gelecekteki bir randevu 'Tamamlandı' veya 'Gelmedi' olarak işaretlenemez!");
            }
            existingAppointment.setStatus(newStatus);
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
            
            // ⭐ İŞ KURALI: Gelecekteki bir randevu 'Tamamlandı' veya 'Gelmedi' yapılamaz
            if ((newStatus == AppointmentStatus.COMPLETED || newStatus == AppointmentStatus.NO_SHOW) 
                && appointment.getAppointmentDate().isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Gelecekteki bir randevu 'Tamamlandı' veya 'Gelmedi' olarak işaretlenemez!");
            }
            
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

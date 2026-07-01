package com.hospital.appointmentsystem.doctor.impl;

import com.hospital.appointmentsystem.department.impl.Department;
import com.hospital.appointmentsystem.department.impl.DepartmentRepository;
import com.hospital.appointmentsystem.doctor.api.DoctorDto;
import com.hospital.appointmentsystem.doctor.api.DoctorService;
import com.hospital.appointmentsystem.user.api.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ⚙️ DOCTOR SERVICE IMPL — İlişkili Servis İmplementasyonu       ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║                                                                  ║
 * ║  🆕 YENİ KAVRAM: BİRDEN FAZLA REPOSITORY KULLANMAK             ║
 * ║                                                                  ║
 * ║  Doctor, Department'a bağlı olduğu için bu serviste             ║
 * ║  HEM DoctorRepository HEM DepartmentRepository kullanıyoruz.    ║
 * ║                                                                  ║
 * ║  Neden?                                                          ║
 * ║  → Doktor oluşturulurken, bağlı olacağı bölümü veritabanından  ║
 * ║    çekip doktora bağlamamız gerekiyor.                          ║
 * ║  → İstemci bize sadece departmentId gönderiyor (sayı).          ║
 * ║  → Biz o ID ile Department objesini bulup Doctor'a atıyoruz.   ║
 * ║                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
@Service
public class DoctorServiceImpl implements DoctorService {

    // ⭐ İKİ repository — çünkü iki tabloyla işimiz var
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final UserService userService;

    // Constructor Injection — Spring ikisini de otomatik verir
    public DoctorServiceImpl(DoctorRepository doctorRepository,
                             DepartmentRepository departmentRepository,
                             UserService userService) {
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.userService = userService;
    }

    @Override
    public DoctorDto createDoctor(DoctorDto doctorDto) {

        // ⭐ İLİŞKİ KURMA AŞAMASI
        // 1. İstemci bize departmentId gönderdi (örneğin: 1)
        // 2. Bu ID ile Department objesini veritabanından çekiyoruz
        // 3. Department objesini Doctor'a bağlıyoruz
        Department department = departmentRepository.findById(doctorDto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException(
                        "Bölüm bulunamadı! ID: " + doctorDto.getDepartmentId()
                ));

        // DTO → Entity dönüşümü + Department bağlama
        Doctor doctor = mapToEntity(doctorDto);
        doctor.setDepartment(department); // ⭐ İlişkiyi kuruyoruz!

        Doctor savedDoctor = doctorRepository.save(doctor);

        // ⭐ Doktor için otomatik Kullanıcı hesabı oluştur
        // Şifre olarak TC'nin ilk 6 hanesini varsayılan olarak veriyoruz
        String tc = doctorDto.getTcIdentityNumber();
        String defaultPassword = tc != null && tc.length() >= 6 ? tc.substring(0, 6) : "123456";
        userService.registerUser(tc, doctorDto.getEmail(), defaultPassword, "ROLE_DOCTOR", savedDoctor.getId());

        return mapToDto(savedDoctor);
    }

    @Override
    public DoctorDto getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doktor bulunamadı! ID: " + id));
        return mapToDto(doctor);
    }

    @Override
    public Page<DoctorDto> getAllDoctors(Pageable pageable) {
        Page<Doctor> doctors = doctorRepository.findAll(pageable);
        return doctors.map(this::mapToDto);
    }

    @Override
    public List<DoctorDto> getDoctorsByDepartmentId(Long departmentId) {
        // Önce bölümün var olduğunu kontrol et
        if (!departmentRepository.existsById(departmentId)) {
            throw new RuntimeException("Bölüm bulunamadı! ID: " + departmentId);
        }

        return doctorRepository.findByDepartmentId(departmentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorDto updateDoctor(Long id, DoctorDto doctorDto) {
        Doctor existingDoctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Güncellenecek doktor bulunamadı! ID: " + id));

        // Bölüm değişmiş olabilir, yeni bölümü çek
        Department department = departmentRepository.findById(doctorDto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException(
                        "Bölüm bulunamadı! ID: " + doctorDto.getDepartmentId()
                ));

        existingDoctor.setFirstName(doctorDto.getFirstName());
        existingDoctor.setLastName(doctorDto.getLastName());
        existingDoctor.setSpecialization(doctorDto.getSpecialization());
        existingDoctor.setPhoneNumber(doctorDto.getPhoneNumber());
        existingDoctor.setEmail(doctorDto.getEmail());
        existingDoctor.setDepartment(department);

        Doctor updatedDoctor = doctorRepository.save(existingDoctor);
        return mapToDto(updatedDoctor);
    }

    @Override
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Silinecek doktor bulunamadı! ID: " + id));
        doctorRepository.deleteById(id);
    }

    // ── Dönüşüm Metotları ──

    private DoctorDto mapToDto(Doctor doctor) {
        DoctorDto dto = new DoctorDto();
        dto.setId(doctor.getId());
        dto.setFirstName(doctor.getFirstName());
        dto.setLastName(doctor.getLastName());
        dto.setTcIdentityNumber(doctor.getTcIdentityNumber());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setPhoneNumber(doctor.getPhoneNumber());
        dto.setEmail(doctor.getEmail());

        // ⭐ İlişkili entity'den bilgi alma
        // doctor.getDepartment() → Department objesini verir
        // onun getId() ve getName() metotlarıyla bilgiye ulaşırız
        dto.setDepartmentId(doctor.getDepartment().getId());
        dto.setDepartmentName(doctor.getDepartment().getName());

        return dto;
    }

    private Doctor mapToEntity(DoctorDto dto) {
        Doctor doctor = new Doctor();
        doctor.setFirstName(dto.getFirstName());
        doctor.setLastName(dto.getLastName());
        doctor.setTcIdentityNumber(dto.getTcIdentityNumber());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setPhoneNumber(dto.getPhoneNumber());
        doctor.setEmail(dto.getEmail());
        // Department burada SET EDİLMEZ — createDoctor/updateDoctor'da yapılır
        return doctor;
    }
}

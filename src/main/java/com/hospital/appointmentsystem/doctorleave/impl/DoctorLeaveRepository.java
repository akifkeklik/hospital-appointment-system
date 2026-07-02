package com.hospital.appointmentsystem.doctorleave.impl;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoctorLeaveRepository extends JpaRepository<DoctorLeave, Long> {
    
    List<DoctorLeave> findByDoctorId(Long doctorId);

    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM DoctorLeave d WHERE d.doctorId = :doctorId AND :date BETWEEN d.startDate AND d.endDate")
    boolean isDoctorOnLeave(Long doctorId, LocalDate date);
}

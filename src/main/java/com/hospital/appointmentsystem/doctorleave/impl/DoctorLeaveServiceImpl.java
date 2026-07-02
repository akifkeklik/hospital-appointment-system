package com.hospital.appointmentsystem.doctorleave.impl;

import com.hospital.appointmentsystem.doctorleave.api.DoctorLeaveDto;
import com.hospital.appointmentsystem.doctorleave.api.DoctorLeaveService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorLeaveServiceImpl implements DoctorLeaveService {

    private final DoctorLeaveRepository repository;

    public DoctorLeaveServiceImpl(DoctorLeaveRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<DoctorLeaveDto> getAllLeaves() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<DoctorLeaveDto> getLeavesByDoctorId(Long doctorId) {
        return repository.findByDoctorId(doctorId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public DoctorLeaveDto createLeave(DoctorLeaveDto dto) {
        DoctorLeave leave = new DoctorLeave(dto.getDoctorId(), dto.getStartDate(), dto.getEndDate(), dto.getReason());
        leave = repository.save(leave);
        return mapToDto(leave);
    }

    @Override
    public void deleteLeave(Long id) {
        repository.deleteById(id);
    }

    private DoctorLeaveDto mapToDto(DoctorLeave leave) {
        return new DoctorLeaveDto(leave.getId(), leave.getDoctorId(), leave.getStartDate(), leave.getEndDate(), leave.getReason());
    }
}

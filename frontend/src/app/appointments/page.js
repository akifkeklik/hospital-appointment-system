'use client';
import { useState, useEffect } from 'react';
import { AppointmentService, PatientService, DoctorService } from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import styles from '../shared.module.css';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    patientId: '', doctorId: '', appointmentDate: '', notes: '' 
  });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const [appts, pats, docs] = await Promise.all([
        AppointmentService.getAll(),
        PatientService.getAll(),
        DoctorService.getAll()
      ]);
      setAppointments(appts);
      setPatients(pats);
      setDoctors(docs);
    } catch (error) {
      alert('Veriler yüklenemedi.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.appointmentDate) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    
    try {
      if (editingId) {
        await AppointmentService.update(editingId, formData);
      } else {
        await AppointmentService.create(formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchData();
    } catch (error) {
      alert('Randevu işlemi başarısız oldu.');
    }
  };

  const handleEdit = (appt) => {
    setFormData({ 
      patientId: appt.patientId,
      doctorId: appt.doctorId,
      appointmentDate: appt.appointmentDate.slice(0, 16), // YYYY-MM-DDTHH:MM için kırp
      notes: appt.notes || ''
    });
    setEditingId(appt.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Bu randevuyu iptal edip sistemden silmek istediğinize emin misiniz?')) {
      try {
        await AppointmentService.delete(id);
        fetchData();
      } catch (error) {
        alert('Silme işlemi başarısız.');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await AppointmentService.updateStatus(id, newStatus);
      fetchData();
    } catch (error) {
      alert('Durum güncellenemedi.');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      SCHEDULED: { label: 'Planlandı', color: '#3b82f6', bg: '#eff6ff' },
      COMPLETED: { label: 'Tamamlandı', color: '#10b981', bg: '#ecfdf5' },
      CANCELLED: { label: 'İptal', color: '#ef4444', bg: '#fef2f2' },
      NO_SHOW: { label: 'Gelmedi', color: '#f59e0b', bg: '#fffbeb' }
    };
    
    const conf = statusConfig[status] || { label: status, color: '#64748b', bg: '#f1f5f9' };
    return (
      <span style={{ 
        padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600',
        color: conf.color, backgroundColor: conf.bg 
      }}>
        {conf.label}
      </span>
    );
  };

  const columns = [
    { header: 'Hasta', accessor: 'patientFullName' },
    { header: 'Doktor', render: (row) => `${row.doctorFullName} (${row.departmentName})` },
    { header: 'Tarih', render: (row) => new Date(row.appointmentDate).toLocaleString('tr-TR') },
    { header: 'Durum', render: (row) => getStatusBadge(row.status) }
  ];

  const renderActions = (row) => (
    <select 
      value={row.status} 
      onChange={(e) => handleStatusChange(row.id, e.target.value)}
      style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.75rem', marginRight: '5px' }}
    >
      <option value="SCHEDULED">Planlandı</option>
      <option value="COMPLETED">Tamamlandı</option>
      <option value="CANCELLED">İptal</option>
      <option value="NO_SHOW">Gelmedi</option>
    </select>
  );

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Randevular</h1>
        <button 
          className={styles.primaryBtn} 
          onClick={() => {
            setFormData({ patientId: '', doctorId: '', appointmentDate: '', notes: '' });
            setEditingId(null);
            setIsModalOpen(true);
          }}
        >
          + Randevu Oluştur
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={appointments} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        actions={renderActions}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'Randevuyu Düzenle' : 'Yeni Randevu Oluştur'}
      >
        <form onSubmit={handleSubmit}>
          
          <div className={styles.formGroup}>
            <label>Hasta</label>
            <select 
              required 
              value={formData.patientId} 
              onChange={(e) => setFormData({...formData, patientId: e.target.value})}
            >
              <option value="">-- Hasta Seçin --</option>
              {patients.map(pat => (
                <option key={pat.id} value={pat.id}>{pat.tcIdentityNumber} - {pat.firstName} {pat.lastName}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Doktor</label>
            <select 
              required 
              value={formData.doctorId} 
              onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
            >
              <option value="">-- Doktor Seçin --</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.specialization} {doc.firstName} {doc.lastName} ({doc.departmentName})</option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Randevu Tarihi ve Saati</label>
            <input 
              type="datetime-local" 
              required 
              value={formData.appointmentDate} 
              onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})} 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Notlar (Şikayet vb.)</label>
            <textarea 
              rows="3"
              value={formData.notes} 
              onChange={(e) => setFormData({...formData, notes: e.target.value})} 
            />
          </div>
          
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>İptal</button>
            <button type="submit" className={styles.primaryBtn}>Kaydet</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

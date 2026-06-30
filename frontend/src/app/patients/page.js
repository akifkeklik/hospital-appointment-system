'use client';
import { useState, useEffect } from 'react';
import { PatientService } from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import styles from '../shared.module.css';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', tcIdentityNumber: '', phoneNumber: '', email: '' 
  });
  const [editingId, setEditingId] = useState(null);

  const fetchPatients = async () => {
    try {
      const data = await PatientService.getAll();
      setPatients(data);
    } catch (error) {
      alert('Hastalar yüklenemedi.');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await PatientService.update(editingId, formData);
      } else {
        await PatientService.create(formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchPatients();
    } catch (error) {
      alert('İşlem başarısız oldu. TC kimlik numarası zaten kullanılıyor olabilir.');
    }
  };

  const handleEdit = (patient) => {
    setFormData({ 
      firstName: patient.firstName, 
      lastName: patient.lastName,
      tcIdentityNumber: patient.tcIdentityNumber,
      phoneNumber: patient.phoneNumber || '',
      email: patient.email || ''
    });
    setEditingId(patient.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Bu hastayı silmek istediğinize emin misiniz?')) {
      try {
        await PatientService.delete(id);
        fetchPatients();
      } catch (error) {
        alert('Silme işlemi başarısız. Hastanın randevuları olabilir.');
      }
    }
  };

  const columns = [
    { header: 'Ad Soyad', render: (row) => `${row.firstName} ${row.lastName}` },
    { header: 'TC Kimlik', accessor: 'tcIdentityNumber' },
    { header: 'Telefon', accessor: 'phoneNumber' },
    { header: 'E-Posta', accessor: 'email' }
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Hastalar</h1>
        <button 
          className={styles.primaryBtn} 
          onClick={() => {
            setFormData({ firstName: '', lastName: '', tcIdentityNumber: '', phoneNumber: '', email: '' });
            setEditingId(null);
            setIsModalOpen(true);
          }}
        >
          + Yeni Hasta Kaydı
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={patients} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'Hasta Düzenle' : 'Yeni Hasta Kaydı'}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label>Ad</label>
              <input required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label>Soyad</label>
              <input required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>TC Kimlik Numarası (11 Haneli)</label>
            <input required minLength="11" maxLength="11" value={formData.tcIdentityNumber} onChange={(e) => setFormData({...formData, tcIdentityNumber: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label>Telefon Numarası</label>
            <input maxLength="15" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label>E-Posta</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
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

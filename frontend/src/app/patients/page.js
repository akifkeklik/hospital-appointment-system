'use client';
import { useState, useEffect } from 'react';
import { PatientService } from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { toast } from '../../components/Toast';
import { useSettings } from '../../context/SettingsContext';
import styles from '../shared.module.css';

export default function PatientsPage() {
  const { t } = useSettings();
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', tcIdentityNumber: '', phoneNumber: '', email: '' 
  });
  const [editingId, setEditingId] = useState(null);

  const fetchPatients = async () => {
    try {
      const data = await PatientService.getAll(page);
      setPatients(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      toast.error('Hastalar yüklenemedi.');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page]);

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
      toast.success(editingId ? 'Hasta başarıyla güncellendi.' : 'Hasta başarıyla eklendi.');
    } catch (error) {
      toast.error(`İşlem başarısız oldu:\n${error.message}`);
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
        toast.success('Hasta başarıyla silindi.');
      } catch (error) {
        toast.error('Silme işlemi başarısız. Hastanın randevuları olabilir.');
      }
    }
  };

  const columns = [
    { header: t('name'), render: (row) => `${row.firstName} ${row.lastName}` },
    { header: t('tc_id'), accessor: 'tcIdentityNumber' },
    { header: t('phone'), accessor: 'phoneNumber' },
    { header: t('email'), accessor: 'email' }
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('patients')}</h1>
        <button 
          className={styles.primaryBtn} 
          onClick={() => {
            setFormData({ tcIdentityNumber: '', firstName: '', lastName: '', phoneNumber: '', email: '' });
            setEditingId(null);
            setIsModalOpen(true);
          }}
        >
          + {t('add_patient')}
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={patients} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
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
            <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>{t('cancel')}</button>
            <button type="submit" className={styles.primaryBtn}>{t('save')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

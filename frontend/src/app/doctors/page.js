'use client';
import { useState, useEffect } from 'react';
import { DoctorService, DepartmentService } from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { toast } from '../../components/Toast';
import { useSettings } from '../../context/SettingsContext';
import styles from '../shared.module.css';

export default function DoctorsPage() {
  const { t } = useSettings();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', specialization: '', phoneNumber: '', email: '', departmentId: '' 
  });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const [docs, depts] = await Promise.all([
        DoctorService.getAll(page),
        DepartmentService.getAll(0, 1000)
      ]);
      setDoctors(docs.content || []);
      setTotalPages(docs.totalPages || 0);
      setDepartments(depts.content || []);
    } catch (error) {
      toast.error('Veriler yüklenemedi.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.departmentId) {
      toast.error('Lütfen bir bölüm seçin.');
      return;
    }
    
    try {
      if (editingId) {
        await DoctorService.update(editingId, formData);
      } else {
        await DoctorService.create(formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchData();
      toast.success(editingId ? 'Doktor başarıyla güncellendi.' : 'Doktor başarıyla eklendi.');
    } catch (error) {
      toast.error(`İşlem başarısız oldu:\n${error.message}`);
    }
  };

  const handleEdit = (doctor) => {
    setFormData({ 
      firstName: doctor.firstName, 
      lastName: doctor.lastName,
      specialization: doctor.specialization,
      phoneNumber: doctor.phoneNumber || '',
      email: doctor.email || '',
      departmentId: doctor.departmentId
    });
    setEditingId(doctor.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Bu doktoru silmek istediğinize emin misiniz?')) {
      try {
        await DoctorService.delete(id);
        fetchData();
        toast.success('Doktor başarıyla silindi.');
      } catch (error) {
        toast.error('Silme işlemi başarısız. Doktorun randevuları olabilir.');
      }
    }
  };

  const columns = [
    { header: t('title_desc'), render: (row) => `${row.specialization} ${row.firstName} ${row.lastName}` },
    { header: t('department'), render: (row) => t(row.departmentName) },
    { header: t('phone'), accessor: 'phoneNumber' },
    { header: t('email'), accessor: 'email' }
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('doctors')}</h1>
        <button 
          className={styles.primaryBtn} 
          onClick={() => {
            setFormData({ firstName: '', lastName: '', specialization: '', phoneNumber: '', email: '', departmentId: '' });
            setEditingId(null);
            setIsModalOpen(true);
          }}
        >
          + {t('add_doctor')}
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={doctors} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'Doktor Düzenle' : 'Yeni Doktor Ekle'}
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
            <label>Bölüm</label>
            <select 
              required 
              value={formData.departmentId} 
              onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
            >
              <option value="">-- Bölüm Seçin --</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Uzmanlık (Örn: Uzm. Dr., Prof. Dr.)</label>
            <input required value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} />
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

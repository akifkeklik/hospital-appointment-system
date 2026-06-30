'use client';
import { useState, useEffect } from 'react';
import { DoctorService, DepartmentService } from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import styles from '../shared.module.css';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', specialization: '', phoneNumber: '', email: '', departmentId: '' 
  });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const [docs, depts] = await Promise.all([
        DoctorService.getAll(),
        DepartmentService.getAll()
      ]);
      setDoctors(docs);
      setDepartments(depts);
    } catch (error) {
      alert('Veriler yüklenemedi.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.departmentId) {
      alert('Lütfen bir bölüm seçin.');
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
    } catch (error) {
      alert('İşlem başarısız oldu.');
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
      } catch (error) {
        alert('Silme işlemi başarısız. Doktorun randevuları olabilir.');
      }
    }
  };

  const columns = [
    { header: 'Unvan/Ad Soyad', render: (row) => `${row.specialization} ${row.firstName} ${row.lastName}` },
    { header: 'Bölüm', accessor: 'departmentName' },
    { header: 'Telefon', accessor: 'phoneNumber' },
    { header: 'E-Posta', accessor: 'email' }
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Doktorlar</h1>
        <button 
          className={styles.primaryBtn} 
          onClick={() => {
            setFormData({ firstName: '', lastName: '', specialization: '', phoneNumber: '', email: '', departmentId: '' });
            setEditingId(null);
            setIsModalOpen(true);
          }}
        >
          + Yeni Doktor Ekle
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={doctors} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
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
            <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>İptal</button>
            <button type="submit" className={styles.primaryBtn}>Kaydet</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

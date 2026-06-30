'use client';
import { useState, useEffect } from 'react';
import { DepartmentService } from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import styles from '../shared.module.css';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchDepartments = async () => {
    try {
      const data = await DepartmentService.getAll();
      setDepartments(data);
    } catch (error) {
      alert('Bölümler yüklenemedi.');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await DepartmentService.update(editingId, formData);
      } else {
        await DepartmentService.create(formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      setEditingId(null);
      fetchDepartments();
    } catch (error) {
      alert('İşlem başarısız oldu.');
    }
  };

  const handleEdit = (dept) => {
    setFormData({ name: dept.name, description: dept.description });
    setEditingId(dept.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Bu bölümü silmek istediğinize emin misiniz?')) {
      try {
        await DepartmentService.delete(id);
        fetchDepartments();
      } catch (error) {
        alert('Silme işlemi başarısız. Bu bölüme bağlı doktorlar olabilir.');
      }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Bölüm Adı', accessor: 'name' },
    { header: 'Açıklama', accessor: 'description' }
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Hastane Bölümleri</h1>
        <button 
          className={styles.primaryBtn} 
          onClick={() => {
            setFormData({ name: '', description: '' });
            setEditingId(null);
            setIsModalOpen(true);
          }}
        >
          + Yeni Bölüm Ekle
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={departments} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'Bölümü Düzenle' : 'Yeni Bölüm Ekle'}
      >
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Bölüm Adı</label>
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Açıklama</label>
            <textarea 
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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

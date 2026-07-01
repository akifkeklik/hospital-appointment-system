'use client';
import { useState, useEffect } from 'react';
import { DepartmentService } from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { toast } from '../../components/Toast';
import { useSettings } from '../../context/SettingsContext';
import styles from '../shared.module.css';

export default function DepartmentsPage() {
  const { t } = useSettings();
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchDepartments = async () => {
    try {
      const data = await DepartmentService.getAll(page);
      setDepartments(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      toast.error('Bölümler yüklenemedi.');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [page]);

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
      toast.success(editingId ? 'Bölüm başarıyla güncellendi.' : 'Bölüm başarıyla eklendi.');
    } catch (error) {
      toast.error(`İşlem başarısız oldu:\n${error.message}`);
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
        toast.success('Bölüm başarıyla silindi.');
      } catch (error) {
        toast.error('Silme işlemi başarısız. Bölüme kayıtlı doktorlar olabilir.');
      }
    }
  };

  const columns = [
    { header: t('id'), accessor: 'id' },
    { header: t('dept_name'), render: (row) => t(row.name) },
    { header: t('description'), render: (row) => t(row.description) }
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('departments')}</h1>
        <button 
          className={styles.primaryBtn} 
          onClick={() => {
            setFormData({ name: '', description: '' });
            setEditingId(null);
            setIsModalOpen(true);
          }}
        >
          + {t('add_dept')}
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={departments} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
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
            <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>{t('cancel')}</button>
            <button type="submit" className={styles.primaryBtn}>{t('save')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

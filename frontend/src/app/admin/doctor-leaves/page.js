'use client';
import { useEffect, useState } from 'react';
import { DoctorLeaveService, DoctorService } from '../../../services/api';
import styles from '../../shared.module.css';

export default function DoctorLeavesPage() {
  const [leaves, setLeaves] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // New leave form state
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('Yıllık İzin');

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leavesData, doctorsData] = await Promise.all([
        DoctorLeaveService.getAll(),
        DoctorService.getAll(0, 100)
      ]);
      setLeaves(leavesData);
      setDoctors(doctorsData.content || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeave = async (e) => {
    e.preventDefault();
    try {
      await DoctorLeaveService.create({
        doctorId: selectedDoctor,
        startDate: startDate,
        endDate: endDate,
        reason: reason
      });
      alert('İzin başarıyla eklendi!');
      setStartDate('');
      setEndDate('');
      fetchData();
    } catch (error) {
      alert('İzin eklenirken hata oluştu.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Bu izni silmek istediğinize emin misiniz?')) {
      try {
        await DoctorLeaveService.delete(id);
        fetchData();
      } catch (error) {
        alert('İzin silinemedi.');
      }
    }
  };

  if (!mounted) return null;

  const getDoctorName = (id) => {
    const doc = doctors.find(d => d.id === parseInt(id));
    return doc ? `${doc.firstName} ${doc.lastName}` : 'Bilinmeyen Doktor';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Doktor İzin Yönetimi (Enterprise)</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '2rem' }}>
        
        {/* İzin Ekleme Formu */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Yeni İzin Tanımla</h2>
          <form onSubmit={handleAddLeave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label>Doktor Seçin</label>
              <select required value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                <option value="">-- Doktor Seç --</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.firstName} {doc.lastName} ({doc.specialty})</option>
                ))}
              </select>
            </div>
            <div>
              <label>Başlangıç Tarihi</label>
              <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label>Bitiş Tarihi</label>
              <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div>
              <label>İzin Sebebi / Türü</label>
              <select required value={reason} onChange={(e) => setReason(e.target.value)}>
                <option value="Yıllık İzin">Yıllık İzin</option>
                <option value="Hastalık İzni">Hastalık İzni</option>
                <option value="Ücretsiz İzin">Ücretsiz İzin</option>
                <option value="Kongre / Seminer">Kongre / Eğitim</option>
              </select>
            </div>
            <button type="submit" style={{ padding: '0.8rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
              İzni Kaydet
            </button>
          </form>
        </div>

        {/* İzin Listesi */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Mevcut İzinler</h2>
          {loading ? (
            <p>Yükleniyor...</p>
          ) : leaves.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Sistemde kayıtlı doktor izni bulunmamaktadır.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Doktor</th>
                  <th>Başlangıç</th>
                  <th>Bitiş</th>
                  <th>Sebep</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(leave => (
                  <tr key={leave.id}>
                    <td>{getDoctorName(leave.doctorId)}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td><span style={{ padding: '4px 8px', backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#eab308', borderRadius: '4px', fontSize: '0.85rem' }}>{leave.reason}</span></td>
                    <td>
                      <button onClick={() => handleDelete(leave.id)} style={{ padding: '4px 8px', backgroundColor: 'var(--danger)', color: 'white', border: 'none', borderRadius: '4px' }}>Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

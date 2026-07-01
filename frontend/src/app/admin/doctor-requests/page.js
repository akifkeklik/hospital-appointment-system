'use client';
import { useState, useEffect } from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { toast } from '../../../components/Toast';
import ConfirmModal from '../../../components/ConfirmModal';
import styles from './page.module.css';

export default function DoctorRequestsPage() {
  const { t } = useSettings();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [confirmModal, setConfirmModal] = useState({ show: false, type: '', reqId: null, message: '' });

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/doctor-requests', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('İstekler alınamadı');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/doctor-requests/${id}/${action}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) {
        let errorMsg = 'İşlem başarısız';
        try {
          const data = await res.json();
          errorMsg = data.message || errorMsg;
        } catch (e) {
          const text = await res.text();
          errorMsg = text || errorMsg;
        }
        throw new Error(errorMsg);
      }
      setConfirmModal({ show: false, type: '', reqId: null, message: '' });
      toast.success(action === 'approve' ? 'Doktor onaylandı!' : 'İstek reddedildi.');
      fetchRequests(); // Refresh list
    } catch (err) {
      setConfirmModal({ show: false, type: '', reqId: null, message: '' });
      toast.error(err.message);
    }
  };

  const executeConfirm = () => {
    if (confirmModal.reqId && confirmModal.type) {
      handleAction(confirmModal.reqId, confirmModal.type);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Doktor Kayıt İstekleri</h1>
      
      {requests.length === 0 ? (
        <p>Bekleyen doktor kayıt isteği bulunmamaktadır.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Ad Soyad</th>
                <th>TC No</th>
                <th>Uzmanlık</th>
                <th>E-Posta</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                  <td>{req.firstName} {req.lastName}</td>
                  <td>{req.tcIdentityNumber}</td>
                  <td>{req.specialization || '-'}</td>
                  <td>{req.email}</td>
                  <td>
                    <button 
                      onClick={() => setConfirmModal({
                        show: true,
                        type: 'approve',
                        reqId: req.id,
                        message: `${req.firstName} ${req.lastName} isimli doktoru onaylıyor musunuz? Şifresi otomatik olarak hesaba atanacaktır.`
                      })}
                      className={styles.approveBtn}
                    >
                      Onayla
                    </button>
                    <button 
                      onClick={() => setConfirmModal({
                        show: true,
                        type: 'reject',
                        reqId: req.id,
                        message: 'Bu isteği reddetmek istediğinize emin misiniz?'
                      })}
                      className={styles.rejectBtn}
                    >
                      Reddet
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Modern Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.show}
        title="Onay Bekliyor"
        message={confirmModal.message}
        onConfirm={executeConfirm}
        onCancel={() => setConfirmModal({...confirmModal, show: false})}
        confirmText={confirmModal.type === 'approve' ? 'Evet, Onayla' : 'Evet, Reddet'}
        type={confirmModal.type === 'approve' ? 'approve' : 'danger'}
      />
    </div>
  );
}

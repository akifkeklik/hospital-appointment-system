'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DepartmentService, PatientService, DoctorService, AppointmentService } from '../services/api';
import DashboardCharts from '../components/DashboardCharts';
import styles from './page.module.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    departments: 0,
    patients: 0,
    doctors: 0,
    appointments: 0
  });
  const [chartData, setChartData] = useState({
    departments: [],
    doctors: [],
    appointments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [depts, pats, docs, appts] = await Promise.all([
          DepartmentService.getAll(),
          PatientService.getAll(),
          DoctorService.getAll(),
          AppointmentService.getAll()
        ]);
        
        setStats({
          departments: depts.length,
          patients: pats.length,
          doctors: docs.length,
          appointments: appts.length
        });

        setChartData({
          departments: depts,
          doctors: docs,
          appointments: appts
        });
      } catch (error) {
        console.error("Dashboard istatistikleri alınamadı", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className={styles.title}>Hoş Geldiniz, Sistem Özeti</h1>
      <p className={styles.subtitle}>Hastane Randevu Sistemi yönetim paneline hoş geldiniz.</p>
      
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className={styles.grid}>
          <Link href="/departments" className={styles.card}>
            <div className={styles.cardIcon}>🏢</div>
            <div className={styles.cardInfo}>
              <h3>Bölümler</h3>
              <p className={styles.count}>{stats.departments}</p>
            </div>
          </Link>
          
          <Link href="/patients" className={styles.card}>
            <div className={styles.cardIcon}>🧑</div>
            <div className={styles.cardInfo}>
              <h3>Kayıtlı Hastalar</h3>
              <p className={styles.count}>{stats.patients}</p>
            </div>
          </Link>
          
          <Link href="/doctors" className={styles.card}>
            <div className={styles.cardIcon}>👨‍⚕️</div>
            <div className={styles.cardInfo}>
              <h3>Doktorlar</h3>
              <p className={styles.count}>{stats.doctors}</p>
            </div>
          </Link>
          
          <Link href="/appointments" className={styles.card}>
            <div className={styles.cardIcon}>📅</div>
            <div className={styles.cardInfo}>
              <h3>Toplam Randevu</h3>
              <p className={styles.count}>{stats.appointments}</p>
            </div>
          </Link>
        </div>
      )}

      {!loading && (
        <DashboardCharts 
          departments={chartData.departments}
          doctors={chartData.doctors}
          appointments={chartData.appointments}
        />
      )}
    </div>
  );
}

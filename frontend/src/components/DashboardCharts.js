'use client';
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend as BarLegend,
  ResponsiveContainer
} from 'recharts';
import styles from './DashboardCharts.module.css';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function DashboardCharts({ departments, doctors, appointments }) {
  
  // 1. Veri Hazırlığı: Bölümlere Göre Doktor Sayısı
  const doctorDistribution = departments.map(dept => {
    // Bu bölüme ait doktorları say
    const count = doctors.filter(doc => doc.departmentId === dept.id).length;
    return { name: dept.name, value: count };
  }).filter(item => item.value > 0); // Sadece doktoru olan bölümleri göster

  // 2. Veri Hazırlığı: Günlük Randevu Yoğunluğu
  const appointmentsByDate = {};
  appointments.forEach(app => {
    // Tarihin sadece YYYY-MM-DD kısmını al
    const dateStr = app.appointmentDate ? app.appointmentDate.split('T')[0] : 'Bilinmeyen';
    appointmentsByDate[dateStr] = (appointmentsByDate[dateStr] || 0) + 1;
  });

  const appointmentData = Object.keys(appointmentsByDate)
    .sort() // Tarihe göre sırala
    .map(date => ({
      date,
      Randevu: appointmentsByDate[date]
    }))
    .slice(-7); // Son 7 günü göster

  return (
    <div className={styles.chartsContainer}>
      
      <div className={styles.chartBox}>
        <h3 className={styles.chartTitle}>Bölümlere Göre Doktor Dağılımı</h3>
        {doctorDistribution.length === 0 ? (
          <p className={styles.noData}>Yeterli veri yok.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={doctorDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {doctorDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className={styles.chartBox}>
        <h3 className={styles.chartTitle}>Günlük Randevu Yoğunluğu (Son 7 Gün)</h3>
        {appointmentData.length === 0 ? (
          <p className={styles.noData}>Yeterli veri yok.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={appointmentData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <BarTooltip />
              <BarLegend />
              <Bar dataKey="Randevu" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}

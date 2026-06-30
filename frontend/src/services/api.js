const API_BASE_URL = 'http://localhost:8080/api';

/**
 * 🌐 Ortak API İsteği Yapan Fonksiyon
 * 
 * Neden bunu kullanıyoruz?
 * - Her sayfada uzun uzun fetch, then, catch yazmamak için.
 * - Hataları tek bir yerden yönetmek için.
 * - JSON dönüşümlerini otomatik yapmak için.
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Eğer başarılı değilse hata fırlat
    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        if (errorData.details) {
          // Validation error
          const detailsStr = Object.values(errorData.details).join('\\n');
          errorMessage = `${errorData.error}:\\n${detailsStr}`;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // Not JSON, just use raw text
        const rawText = await response.text();
        if (rawText) errorMessage = rawText;
      }
      throw new Error(errorMessage);
    }

    // 204 No Content ise boş dön (Örn: DELETE işleminde)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error on ${url}:`, error);
    throw error;
  }
}

// ── BÖLÜM (DEPARTMENT) API ──
export const DepartmentService = {
  getAll: () => fetchAPI('/departments'),
  getById: (id) => fetchAPI(`/departments/${id}`),
  create: (data) => fetchAPI('/departments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/departments/${id}`, { method: 'DELETE' }),
};

// ── HASTA (PATIENT) API ──
export const PatientService = {
  getAll: () => fetchAPI('/patients'),
  getById: (id) => fetchAPI(`/patients/${id}`),
  create: (data) => fetchAPI('/patients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/patients/${id}`, { method: 'DELETE' }),
};

// ── DOKTOR (DOCTOR) API ──
export const DoctorService = {
  getAll: () => fetchAPI('/doctors'),
  getById: (id) => fetchAPI(`/doctors/${id}`),
  create: (data) => fetchAPI('/doctors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/doctors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/doctors/${id}`, { method: 'DELETE' }),
};

// ── RANDEVU (APPOINTMENT) API ──
export const AppointmentService = {
  getAll: () => fetchAPI('/appointments'),
  getById: (id) => fetchAPI(`/appointments/${id}`),
  create: (data) => fetchAPI('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, status) => fetchAPI(`/appointments/${id}/status`, { 
    method: 'PATCH', 
    body: JSON.stringify({ status }) 
  }),
  delete: (id) => fetchAPI(`/appointments/${id}`, { method: 'DELETE' }),
};

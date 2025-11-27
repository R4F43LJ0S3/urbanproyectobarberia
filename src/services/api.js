// src/services/api.js
// Configuración de la URL base de la API
const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7255/api';

// Helper para manejar respuestas de la API
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Error en la petición');
  }
  return response.json();
};

// Helper para obtener headers con autenticación
const getHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('urbanbarber_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// ==========================================
// SERVICIOS DE AUTENTICACIÓN
// ==========================================

export const authService = {
  // Login
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password })
    });
    const data = await handleResponse(response);
    
    // Guardar token y usuario en localStorage
    if (data.token) {
      localStorage.setItem('urbanbarber_token', data.token);
      localStorage.setItem('urbanbarber_user', JSON.stringify(data.usuario));
    }
    
    return data;
  },

  // Registro
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // Obtener perfil del usuario autenticado
  getProfile: async () => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: getHeaders(true)
    });
    return handleResponse(response);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('urbanbarber_token');
    localStorage.removeItem('urbanbarber_user');
  },

  // Verificar si hay sesión activa
  isAuthenticated: () => {
    return !!localStorage.getItem('urbanbarber_token');
  },

  // Obtener usuario actual del localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('urbanbarber_user');
    return user ? JSON.parse(user) : null;
  }
};

// ==========================================
// SERVICIOS DE BARBEROS
// ==========================================

export const barberosService = {
  // Obtener todos los barberos
  getAll: async () => {
    const response = await fetch(`${API_URL}/barberos`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Obtener un barbero específico por ID
  getById: async (id) => {
    const response = await fetch(`${API_URL}/barberos/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// ==========================================
// SERVICIOS DE SERVICIOS
// ==========================================

export const serviciosService = {
  // Obtener todos los servicios
  getAll: async () => {
    const response = await fetch(`${API_URL}/servicios`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Obtener un servicio específico por ID
  getById: async (id) => {
    const response = await fetch(`${API_URL}/servicios/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// ==========================================
// SERVICIOS DE CITAS
// ==========================================

export const citasService = {
  // Obtener mis citas (requiere autenticación)
  getMyCitas: async () => {
    const response = await fetch(`${API_URL}/citas`, {
      headers: getHeaders(true)
    });
    return handleResponse(response);
  },

  // Crear una nueva cita
  create: async (citaData) => {
    const response = await fetch(`${API_URL}/citas`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(citaData)
    });
    return handleResponse(response);
  },

  // Obtener cita por ID
  getById: async (id) => {
    const response = await fetch(`${API_URL}/citas/${id}`, {
      headers: getHeaders(true)
    });
    return handleResponse(response);
  },

  // Eliminar cita
  delete: async (id) => {
    const response = await fetch(`${API_URL}/citas/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return handleResponse(response);
  },

  // Marcar cita como pagada
  marcarPagada: async (id) => {
    const response = await fetch(`${API_URL}/citas/${id}/pagar`, {
      method: 'PUT',
      headers: getHeaders(true)
    });
    return handleResponse(response);
  }
};

// Exportar todo junto
export default {
  auth: authService,
  barberos: barberosService,
  servicios: serviciosService,
  citas: citasService
};
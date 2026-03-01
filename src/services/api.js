const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api';

function authHeader() {
  const token = localStorage.getItem('coracao_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro na requisição');
  return data;
}

export const api = {
  // Auth usuário
  register: (body) => request('POST', '/auth/register', body),
  login: (body) => request('POST', '/auth/login', body),
  me: () => request('GET', '/auth/me'),

  // Auth comerciante
  businessRegister: (body) => request('POST', '/business-auth/register', body),
  businessLogin: (body) => request('POST', '/business-auth/login', body),
  businessMe: () => request('GET', '/business-auth/me'),

  // Negócios
  getBusinesses: (params) => request('GET', `/businesses?${new URLSearchParams(params)}`),
  getBusiness: (id) => request('GET', `/businesses/${id}`),

  // Categorias
  getCategories: () => request('GET', '/categories'),

  // Favoritos
  getFavorites: () => request('GET', '/favorites'),
  addFavorite: (id) => request('POST', `/favorites/${id}`),
  removeFavorite: (id) => request('DELETE', `/favorites/${id}`),

  // Avaliações
  getReviews: (businessId) => request('GET', `/businesses/${businessId}/reviews`),
  addReview: (businessId, body) => request('POST', `/businesses/${businessId}/reviews`, body),

  // Upload de logo
  uploadBusinessLogo: async (businessId, file) => {
    const formData = new FormData();
    formData.append('logo', file);
    const res = await fetch(`${BASE}/businesses/${businessId}/logo`, {
      method: 'PATCH',
      headers: authHeader(),
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao enviar logo');
    return data;
  },
};

import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

export const employeeAPI = {
  getAll: () => API.get('/employees'),
  getLeaderboard: () => API.get('/employees/leaderboard'),
  getOne: (id) => API.get(`/employees/${id}`),
  update: (id, data) => API.put(`/employees/${id}`, data),
};

export const attendanceAPI = {
  checkIn: () => API.post('/attendance/checkin'),
  checkOut: () => API.post('/attendance/checkout'),
  getMine: () => API.get('/attendance/me'),
  getToday: () => API.get('/attendance/today'),
  getAll: () => API.get('/attendance/all'),
};

export const performanceAPI = {
  submit: (data) => API.post('/performance', data),
  getMine: () => API.get('/performance/me'),
  getAll: () => API.get('/performance/all'),
};

export const feedbackAPI = {
  submit: (data) => API.post('/feedback', data),
  getMine: () => API.get('/feedback/me'),
  getAll: () => API.get('/feedback/all'),
};

export const rewardAPI = {
  calculate: (data) => API.post('/rewards/calculate', data),
  redeem: (data) => API.post('/rewards/redeem', data),
  giftPoints: (data) => API.post('/rewards/gift', data),
  giveBonus: (data) => API.post('/rewards/bonus', data),
  getRedemptions: () => API.get('/rewards/redemptions'),
  getMine: () => API.get('/rewards/me'),
  getAll: () => API.get('/rewards/all'),
  getStats: () => API.get('/rewards/stats'),
  approve: (id) => API.patch(`/rewards/${id}/approve`),
  approveRedemption: (id) => API.patch(`/rewards/redemptions/${id}/approve`),
};

export const messageAPI = {
  send: (data) => API.post('/messages', data),
  getList: () => API.get('/messages/list'),
  getConversation: (userId) => API.get(`/messages/${userId}`),
};

export const shoutoutAPI = {
  create: (data) => API.post('/shoutouts', data),
  getAll: () => API.get('/shoutouts'),
};

export const aiAPI = {
  getAudit: () => API.get('/ai/audit'),
};

export default API;

import { http, HttpResponse } from 'msw';

export const handlers = [
  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  // User API
  http.get('/api/user', () => {
    return HttpResponse.json({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    });
  }),

  // Welcome API
  http.get('/api/welcome', () => {
    return HttpResponse.json({
      message: 'Welcome to Kaptain\'s React Template',
      version: '1.0.0',
      contributors: ['Developer 1', 'Developer 2'],
    });
  }),
];

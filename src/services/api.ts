const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let authToken: string | null = localStorage.getItem('realm_jwt_token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('realm_jwt_token', token);
  } else {
    localStorage.removeItem('realm_jwt_token');
  }
};

export const getAuthToken = () => authToken;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    const errorMsg = json.error?.message || json.message || 'An API error occurred';
    const err = new Error(errorMsg);
    (err as any).code = json.error?.code || 'API_ERROR';
    (err as any).status = response.status;
    throw err;
  }

  return json.data as T;
}

export const api = {
  auth: {
    register: (name: string, email: string, password: string) => 
      request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      }),
    login: (email: string, password: string) => 
      request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),
    getMe: () => request<{ user: any; character: any }>('/auth/me'),
    logout: () => request('/auth/logout', { method: 'POST' })
  },
  dashboard: {
    getDashboard: () => request<any>('/dashboard')
  },
  character: {
    getCharacter: () => request<any>('/character'),
    updateCharacter: (updates: any) => request<any>('/character', {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),
    rest: () => request<any>('/character/rest', { method: 'POST' })
  },
  quests: {
    getQuests: () => request<any[]>('/quests'),
    createQuest: (questData: any) => request<any>('/quests', {
      method: 'POST',
      body: JSON.stringify(questData)
    }),
    updateQuest: (id: string, updates: any) => request<any>(`/quests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),
    deleteQuest: (id: string) => request<any>(`/quests/${id}`, {
      method: 'DELETE'
    }),
    continueQuest: (id: string) => request<any>(`/quests/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ is_step: true })
    }),
    completeQuest: (id: string) => request<any>(`/quests/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ is_step: false })
    })
  },
  inventory: {
    getInventory: () => request<any[]>('/inventory'),
    useItem: (id: string) => request<any>(`/inventory/${id}/use`, { method: 'POST' }),
    equipItem: (id: string) => request<any>(`/inventory/${id}/equip`, { method: 'POST' }),
    sellItem: (id: string) => request<any>(`/inventory/${id}/sell`, { method: 'POST' }),
    buyItem: (id: string) => request<any>(`/inventory/${id}/buy`, { method: 'POST' })
  },
  achievements: {
    getAchievements: () => request<any[]>('/achievements')
  },
  history: {
    getHistory: () => request<any[]>('/history')
  },
  streak: {
    getStreak: () => request<any>('/streak'),
    checkIn: (day_index?: number) => request<any>('/streak/check-in', {
      method: 'POST',
      body: JSON.stringify({ day_index })
    })
  },
  settings: {
    getSettings: () => request<any>('/settings'),
    updateSettings: (settingsData: any) => request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    }),
    changePassword: (old_password: string, new_password: string) => request<any>('/settings/change-password', {
      method: 'POST',
      body: JSON.stringify({ old_password, new_password })
    }),
    deleteAccount: () => request<any>('/settings/account', {
      method: 'DELETE'
    }),
    exportData: () => request<any>('/settings/export-data')
  }
};

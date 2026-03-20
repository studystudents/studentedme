import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'STUDENT' | 'STAFF' | 'PARTNER' | 'UNIVERSITY';
  phone?: string;
}

export interface Student extends User {
  dateOfBirth?: string;
  nationality?: string;
  countryOfResidence?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  countryOfResidence?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Application {
  id: string;
  applicationNumber: string;
  status: string;
    opportunity: {
      id: string;
      name: string;
      opportunityType?: string;
      institution?: {
        id: string;
        name: string;
        country: string;
        city?: string;
        logoUrl?: string;
        ranking?: number;
      };
      degreeLevel?: string;
      duration?: number;
      tuitionFee?: number;
      currency?: string;
      deadline?: string;
    };
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Opportunity {
  id: string;
  name: string;
  opportunityType: 'UNIVERSITY_PROGRAM' | 'SCHOLARSHIP' | 'LANGUAGE_COURSE';
  institution?: {
    id: string;
    name: string;
    country: string;
    city?: string;
    logoUrl?: string;
    ranking?: number;
  };
  degreeLevel?: string;
  duration?: number;
  tuitionFee?: number;
  currency?: string;
  deadline?: string;
  description?: string;
}

export interface Document {
  id: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedAt: string;
  expiresAt?: string;
}

// Auth API
export const authApi = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// Users API
export const usersApi = {
  async updateProfile(data: Partial<Student>): Promise<Student> {
    const response = await api.patch<Student>('/users/me/student-profile', data);
    return response.data;
  },
};

// Applications API
export const applicationsApi = {
  async getAll(): Promise<Application[]> {
    const response = await api.get<Application[]>('/applications');
    return response.data;
  },

  async getOne(id: string): Promise<Application> {
    const response = await api.get<Application>(`/applications/${id}`);
    return response.data;
  },

  async create(data: { opportunityId: string }): Promise<Application> {
    const response = await api.post<Application>('/applications', data);
    return response.data;
  },

  async submit(id: string): Promise<Application> {
    const response = await api.post<Application>(`/applications/${id}/submit`);
    return response.data;
  },
};

// Opportunities API
export const opportunitiesApi = {
  async search(params?: {
    country?: string;
    degreeLevel?: string;
    opportunityType?: string;
  }): Promise<Opportunity[]> {
    const response = await api.get<Opportunity[]>('/opportunities', { params });
    return response.data;
  },

  async getOne(id: string): Promise<Opportunity> {
    const response = await api.get<Opportunity>(`/opportunities/${id}`);
    return response.data;
  },
};

// Documents API
export const documentsApi = {
  async getAll(): Promise<Document[]> {
    const response = await api.get<Document[]>('/documents');
    return response.data;
  },

  async requestUploadUrl(data: {
    documentType: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }): Promise<{ documentId: string; uploadUrl: string; fileKey: string; versionId: string }> {
    const response = await api.post('/documents/upload-url', data);
    return response.data;
  },

  async confirmUpload(documentId: string, data: { fileKey: string; versionId: string }): Promise<Document> {
    const response = await api.post<Document>(`/documents/${documentId}/confirm`, data);
    return response.data;
  },

  async getDownloadUrl(documentId: string): Promise<{ downloadUrl: string }> {
    const response = await api.get(`/documents/${documentId}/download-url`);
    return response.data;
  },
};

// API utility functions

import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from '@/constants';
import { ApiResponse, ApiError } from '@/types';
import { getAuthToken } from './storage';

/**
 * Create API error
 */
export const createApiError = (message: string, code?: string, status?: number): ApiError => {
  return { message, code, status };
};

/**
 * Build query string from object
 */
export const buildQueryString = (params: Record<string, unknown>): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  return queryParams.toString();
};

/**
 * Build full URL with query params
 */
export const buildUrl = (endpoint: string, params?: Record<string, unknown>): string => {
  const baseUrl = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.BASE_URL}${endpoint}`;
  
  if (params && Object.keys(params).length > 0) {
    const queryString = buildQueryString(params);
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
  }
  
  return baseUrl;
};

/**
 * Get default headers
 */
export const getDefaultHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handle API response
 */
export const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!response.ok) {
    let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
    
    if (isJson) {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } else {
      errorMessage = response.statusText || (ERROR_MESSAGES.UNKNOWN_ERROR as string);
    }

    throw createApiError(
      errorMessage,
      response.status.toString(),
      response.status
    );
  }

  if (response.status === HTTP_STATUS.NO_CONTENT) {
    return { data: null as T, success: true };
  }

  const data = isJson ? await response.json() : await response.text();
  return { data, success: true };
};

/**
 * API request with retry logic
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  retries: number = API_CONFIG.RETRY_ATTEMPTS
): Promise<ApiResponse<T>> => {
  const url = buildUrl(endpoint);
  const headers = { ...getDefaultHeaders(), ...options.headers };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    return await handleApiResponse<T>(response);
  } catch (error) {
    if (retries > 0 && error instanceof TypeError) {
      // Network error, retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      return apiRequest<T>(endpoint, options, retries - 1);
    }

    if (error instanceof Error) {
      throw createApiError(error.message);
    }

    throw createApiError(ERROR_MESSAGES.UNKNOWN_ERROR);
  }
};

/**
 * GET request
 */
export const get = <T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> => {
  const url = params ? buildUrl(endpoint, params) : endpoint;
  return apiRequest<T>(url, { method: 'GET' });
};

/**
 * POST request
 */
export const post = <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PUT request
 */
export const put = <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PATCH request
 */
export const patch = <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * DELETE request
 */
export const del = <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
};


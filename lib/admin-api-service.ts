/**
 * Admin API Service
 * Functions for admin panel operations
 */

import {
  User,
  Report,
  Announcement,
  AdminOverviewStats,
  UserAnalytics,
  PostAnalytics,
  ReportAnalytics,
  ReportStatus,
  ReportAction,
  AnnouncementStatus,
  AnnouncementPriority,
  UserRole,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function for API requests
async function adminRequest<T>(
  endpoint: string,
  method: string = 'GET',
  token: string,
  body?: unknown
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Request failed');
  }

  return response.json();
}

// ============================================
// USER MANAGEMENT
// ============================================

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: 'active' | 'banned' | 'suspended';
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getAdminUsers(
  token: string,
  params: GetUsersParams = {}
): Promise<UsersResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.search) queryParams.set('search', params.search);
  if (params.role) queryParams.set('role', params.role);
  if (params.status) queryParams.set('status', params.status);

  const query = queryParams.toString();
  return adminRequest<UsersResponse>(
    `/admin/users${query ? `?${query}` : ''}`,
    'GET',
    token
  );
}

export async function getAdminUserById(token: string, userId: string): Promise<User> {
  return adminRequest<User>(`/admin/users/${userId}`, 'GET', token);
}

export async function updateAdminUser(
  token: string,
  userId: string,
  data: { role?: UserRole; isVerified?: boolean }
): Promise<User> {
  return adminRequest<User>(`/admin/users/${userId}`, 'PUT', token, data);
}

export async function banUser(
  token: string,
  userId: string,
  reason?: string
): Promise<{ message: string }> {
  return adminRequest<{ message: string }>(
    `/admin/users/${userId}/ban`,
    'POST',
    token,
    { reason }
  );
}

export async function unbanUser(
  token: string,
  userId: string
): Promise<{ message: string }> {
  return adminRequest<{ message: string }>(
    `/admin/users/${userId}/unban`,
    'POST',
    token
  );
}

export async function suspendUser(
  token: string,
  userId: string,
  days: number,
  reason?: string
): Promise<{ message: string }> {
  return adminRequest<{ message: string }>(
    `/admin/users/${userId}/suspend`,
    'POST',
    token,
    { days, reason }
  );
}

export async function deleteAdminUser(
  token: string,
  userId: string
): Promise<{ message: string }> {
  return adminRequest<{ message: string }>(
    `/admin/users/${userId}`,
    'DELETE',
    token
  );
}

export async function resetUserPassword(
  token: string,
  userId: string,
  newPassword: string
): Promise<{ message: string }> {
  return adminRequest<{ message: string }>(
    `/admin/users/${userId}/reset-password`,
    'POST',
    token,
    { newPassword }
  );
}

// ============================================
// REPORTS MANAGEMENT
// ============================================

interface GetReportsParams {
  page?: number;
  limit?: number;
  status?: ReportStatus;
  reason?: string;
}

interface ReportsResponse {
  reports: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getAdminReports(
  token: string,
  params: GetReportsParams = {}
): Promise<ReportsResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.status) queryParams.set('status', params.status);
  if (params.reason) queryParams.set('reason', params.reason);

  const query = queryParams.toString();
  return adminRequest<ReportsResponse>(
    `/admin/reports${query ? `?${query}` : ''}`,
    'GET',
    token
  );
}

export async function getAdminReportById(token: string, reportId: string): Promise<Report> {
  return adminRequest<Report>(`/admin/reports/${reportId}`, 'GET', token);
}

export async function reviewReport(
  token: string,
  reportId: string,
  data: { status: ReportStatus; action?: ReportAction }
): Promise<Report> {
  return adminRequest<Report>(`/admin/reports/${reportId}`, 'PUT', token, data);
}

export async function deleteAdminReport(
  token: string,
  reportId: string
): Promise<{ message: string }> {
  return adminRequest<{ message: string }>(
    `/admin/reports/${reportId}`,
    'DELETE',
    token
  );
}

// ============================================
// ANNOUNCEMENTS MANAGEMENT
// ============================================

interface GetAnnouncementsParams {
  page?: number;
  limit?: number;
  status?: AnnouncementStatus;
}

interface AnnouncementsResponse {
  announcements: Announcement[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getAdminAnnouncements(
  token: string,
  params: GetAnnouncementsParams = {}
): Promise<AnnouncementsResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.status) queryParams.set('status', params.status);

  const query = queryParams.toString();
  return adminRequest<AnnouncementsResponse>(
    `/admin/announcements${query ? `?${query}` : ''}`,
    'GET',
    token
  );
}

export async function createAnnouncement(
  token: string,
  data: {
    title: string;
    content: string;
    department?: string;
    priority?: AnnouncementPriority;
    audience?: string;
    scheduledFor?: string;
  }
): Promise<Announcement> {
  return adminRequest<Announcement>('/admin/announcements', 'POST', token, data);
}

export async function updateAnnouncement(
  token: string,
  announcementId: string,
  data: {
    title?: string;
    content?: string;
    department?: string;
    priority?: AnnouncementPriority;
    audience?: string;
    scheduledFor?: string;
    status?: AnnouncementStatus;
  }
): Promise<Announcement> {
  return adminRequest<Announcement>(
    `/admin/announcements/${announcementId}`,
    'PUT',
    token,
    data
  );
}

export async function deleteAnnouncement(
  token: string,
  announcementId: string
): Promise<{ message: string }> {
  return adminRequest<{ message: string }>(
    `/admin/announcements/${announcementId}`,
    'DELETE',
    token
  );
}

export async function publishAnnouncement(
  token: string,
  announcementId: string
): Promise<Announcement> {
  return adminRequest<Announcement>(
    `/admin/announcements/${announcementId}/publish`,
    'POST',
    token
  );
}

// ============================================
// ANALYTICS
// ============================================

export async function getOverviewStats(token: string): Promise<AdminOverviewStats> {
  return adminRequest<AdminOverviewStats>('/admin/analytics/overview', 'GET', token);
}

export async function getUserAnalytics(
  token: string,
  days: number = 30
): Promise<UserAnalytics> {
  return adminRequest<UserAnalytics>(
    `/admin/analytics/users?days=${days}`,
    'GET',
    token
  );
}

export async function getPostAnalytics(
  token: string,
  days: number = 30
): Promise<PostAnalytics> {
  return adminRequest<PostAnalytics>(
    `/admin/analytics/posts?days=${days}`,
    'GET',
    token
  );
}

export async function getReportAnalytics(token: string): Promise<ReportAnalytics> {
  return adminRequest<ReportAnalytics>('/admin/analytics/reports', 'GET', token);
}

// ============================================
// PUBLIC ENDPOINTS (for users)
// ============================================

export async function createReport(
  token: string,
  data: {
    postId?: string;
    commentId?: string;
    reason: string;
    description?: string;
  }
): Promise<{ message: string; report: { id: string; reason: string; status: string; createdAt: string } }> {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to create report');
  }

  return response.json();
}

export async function getMyReports(token: string): Promise<Report[]> {
  const response = await fetch(`${API_BASE_URL}/reports/my-reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch reports');
  }

  return response.json();
}

export async function getPublicAnnouncements(audience?: string): Promise<Announcement[]> {
  const queryParams = audience ? `?audience=${encodeURIComponent(audience)}` : '';
  const response = await fetch(`${API_BASE_URL}/announcements${queryParams}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch announcements');
  }

  return response.json();
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

export interface ApiError {
  detail: string;
  code?: string;
  field_errors?: Record<string, string[]>;
}

export interface BulkActionResponse {
  success_count: number;
  error_count: number;
  errors?: Array<{ id: string; error: string }>;
}

export interface ExportParams {
  format: "csv" | "pdf" | "xlsx";
  filters?: FilterParams;
  columns?: string[];
}

export interface UploadResponse {
  id: string;
  url: string;
  filename: string;
  size: number;
  content_type: string;
}

export interface StatsResponse {
  label: string;
  value: number;
  change?: number;
  change_percent?: number;
  period?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

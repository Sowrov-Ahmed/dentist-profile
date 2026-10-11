export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, string[]>;
};

export type ApiMeta = {
  requestId: string;
  generatedAt: string;
  source: "bundled-content" | "remote-api";
  count?: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta: ApiMeta;
};

export class ApiClientError extends Error {
  code: string;
  status?: number;
  details?: Record<string, string[]>;

  constructor(message: string, options: { code: string; status?: number; details?: Record<string, string[]> }) {
    super(message);
    this.name = "ApiClientError";
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
  }
}

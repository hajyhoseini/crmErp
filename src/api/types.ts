export interface UserRole {
  name: string;
  title?: string;
  strategy?: string;
  snippets?: string[];
  [key: string]: unknown;
}

export interface AuthUser {
  id: number | string;
  nickname?: string;
  username?: string;
  email?: string;
  roles?: UserRole[];
  [key: string]: unknown;
}

export interface SignInResponse {
  data: {
    user: AuthUser;
    token: string;
  };
}

export interface RolesCheckData {
  role?: string;
  roles: string[];
  snippets: string[];
  allowAll: boolean;
  actions?: Record<string, unknown>;
}

export interface RolesCheckResponse {
  data: RolesCheckData;
}

export interface ApiErrorBody {
  errors?: Array<{ message?: string }>;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

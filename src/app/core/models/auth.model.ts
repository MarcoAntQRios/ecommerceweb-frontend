export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  tokenType: string;
}

export interface IJwtPayload {
  sub: string;
  nombre: string;
  correo: string;
  roles?: string[];
  scope?: string;
  exp?: number;
  iat?: number;
}
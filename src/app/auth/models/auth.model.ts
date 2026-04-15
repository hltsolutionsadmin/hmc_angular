export interface LoginRequest {
  username: string;
  password: string;
  deviceId: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface SendOtpRequest {
  primaryContact: string;
}

export interface OtpLoginRequest {
  primaryContact: string;
  otp: string;
  deviceId: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string | null;
  student: boolean;
}

export interface VerifyOtpRequest {
  userId: string;
  otp: string;
}

export interface ResendOtpRequest {
  userId: string;
}

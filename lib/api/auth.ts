import { apiFetch } from "../api-client";
import {
  LoginDto,
  RegisterDto,
  ResendVerificationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponseDto,
  MessageResponseDto,
} from "@/types/auth";

const endpoint = "auth";

export const registerUser = (data: RegisterDto) => {
  return apiFetch<AuthResponseDto["user"]>(`${endpoint}/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const loginUser = (data: LoginDto) => {
  return apiFetch<AuthResponseDto>(`${endpoint}/login`, {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  });
};

export const logoutUser = () => {
  return apiFetch<MessageResponseDto>(`${endpoint}/logout`, {
    method: "POST",
    credentials: "include",
    requiresAuth: false,
  });
};

export const refreshToken = () => {
  return apiFetch<AuthResponseDto>(`${endpoint}/refresh`, {
    method: "POST",
    credentials: "include",
  });
};

export const verifyEmail = (token: string) => {
  return apiFetch<MessageResponseDto>(
    `${endpoint}/verify-email?token=${token}`,
  );
};

export const resendVerification = (email: string) => {
  return apiFetch<MessageResponseDto>(`${endpoint}/resend-verification`, {
    method: "POST",
    body: JSON.stringify({ email } satisfies ResendVerificationDto),
  });
};

export const forgotPassword = (email: string) => {
  return apiFetch<MessageResponseDto>(`${endpoint}/forgot-password`, {
    method: "POST",
    body: JSON.stringify({ email } satisfies ForgotPasswordDto),
  });
};

export const resetPassword = (token: string, password: string) => {
  return apiFetch<MessageResponseDto>(`${endpoint}/reset-password`, {
    method: "POST",
    body: JSON.stringify({
      token,
      password,
    } satisfies ResetPasswordDto),
  });
};

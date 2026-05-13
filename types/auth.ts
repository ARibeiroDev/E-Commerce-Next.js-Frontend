import { AuthUserDto } from "./user";

// Requests DTOS
export type RegisterDto = {
  username: string;
  email: string;
  password: string;
};

export type LoginDto = {
  identifier: string;
  password: string;
};

export type VerifyEmailDto = {
  token: string;
};

export type ResendVerificationDto = {
  email: string;
};

export type ForgotPasswordDto = {
  email: string;
};

export type ResetPasswordDto = {
  token: string;
  password: string;
};

// Response DTOS

export type AuthResponseDto = {
  accessToken: string;
  user: AuthUserDto;
};

export type MessageResponseDto = {
  message: string;
};

export type Role = "SUPERADMIN" | "ADMIN" | "USER";

// Minimal user returned in auth flows (login/register/refresh)
export type AuthUserDto = {
  id: string;
  username: string;
  role: Role;
};

// Full user profile (admin, settings page)
export type PrivateUserDto = {
  id: string;
  username: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
};

// Public user (lists, comments)
export type PublicUserDto = {
  id: string;
  username: string;
  role: Role;
};

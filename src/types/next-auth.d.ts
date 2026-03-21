import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email?: string | null;
      name: string;
      className?: string | null;
      role: string;
      mustChangePassword: boolean;
      image?: string | null;
      preferredLanguage?: string | null;
      preferredTheme?: string | null;
      editorTheme?: string | null;
    };
  }

  interface User {
    id?: string;
    username: string;
    email?: string | null;
    name?: string | null;
    className?: string | null;
    role: string;
    mustChangePassword?: boolean;
    preferredLanguage?: string | null;
    preferredTheme?: string | null;
    editorTheme?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    username?: string;
    email?: string | null;
    className?: string | null;
    mustChangePassword?: boolean;
    authenticatedAt?: number;
    uaHash?: string;
    preferredLanguage?: string | null;
    preferredTheme?: string | null;
    editorTheme?: string | null;
  }
}

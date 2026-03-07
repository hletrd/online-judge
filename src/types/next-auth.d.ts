import type { UserRole } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email?: string | null;
      name: string;
      role: UserRole;
      mustChangePassword: boolean;
      image?: string | null;
    };
  }

  interface User {
    role: UserRole;
    mustChangePassword?: boolean;
  }
}

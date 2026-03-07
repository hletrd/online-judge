import type { UserRole } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
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

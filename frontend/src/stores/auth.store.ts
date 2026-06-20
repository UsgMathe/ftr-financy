import type { SigninInput, SigninOutput } from "@/schemas/auth/signin.schema";
import type { SignupInput, SignupOutput } from "@/schemas/auth/signup.schema";
import type { UserOutput } from "@/schemas/users/users.schema";
import { authService } from "@/services/auth.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  user: UserOutput | null;
  isAuthenticated: boolean;

  checkAuth: () => Promise<void>;

  signin: (data: SigninInput) => Promise<SigninOutput>;
  signup: (data: SignupInput) => Promise<SignupOutput>;
  signout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      checkAuth: async () => {
        try {
          const response = await authService.checkAuth();

          set({
            user: response,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      signup: async (dto) => {
        const response = await authService.signup(dto);
        return response;
      },

      signin: async (dto) => {
        const response = await authService.signin(dto);

        if (response) {
          set({
            user: response,
            isAuthenticated: true,
          });
        }

        return response;
      },

      signout: () => {
        set({
          user: null,
          isAuthenticated: null,
        });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

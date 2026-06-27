import type { UserModel } from "@/graphql/users/user.model";
import type { SigninInput, SigninOutput } from "@/schemas/auth/signin.schema";
import type { SignupInput, SignupOutput } from "@/schemas/auth/signup.schema";
import { authService } from "@/services/auth.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  user: UserModel | null;
  isAuthenticated: boolean | null;

  checkAuth: () => Promise<void>;

  signin: (data: SigninInput) => Promise<SigninOutput | undefined>;
  signup: (data: SignupInput) => Promise<SignupOutput | undefined>;
  signout: () => Promise<boolean | undefined>;

  setUser: (data?: UserModel) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (data?: UserModel) => {
        set({ user: data });
      },

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
            user: response.user,
            isAuthenticated: true,
          });
        }

        return response;
      },

      signout: async () => {
        const response = await authService.signout();

        set({
          user: null,
          isAuthenticated: null,
        });

        return response;
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

import type { SigninInput, SigninOutput } from "@/schemas/auth/signin.schema";
import type { SignupInput, SignupOutput } from "@/schemas/auth/signup.schema";

export interface SignupMutationData {
  signup: SignupOutput;
}

export interface SignupMutationVariables {
  data: SignupInput;
}

export interface SigninMutationData {
  signin: SigninOutput;
}

export interface SigninMutationVariables {
  data: SigninInput;
}

export interface SiginoutMutationData {
  signout: boolean;
}

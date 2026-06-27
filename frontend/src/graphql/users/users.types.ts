import type { UserModel } from "@/graphql/users/user.model";
import type { UpdateUserInput } from "@/schemas/user/user.schama";

export interface GetUserQueryData {
  getUser: UserModel;
}

export interface UpdateUserMutationData {
  updateUser: UserModel;
}

export interface UpdateUserMutationVariables {
  data: UpdateUserInput;
}

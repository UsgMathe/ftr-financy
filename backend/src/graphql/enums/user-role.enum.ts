import { UserRole } from "@/generated/prisma/enums";
import { registerEnumType } from "type-graphql";

registerEnumType(UserRole, {
  name: "UserRole",
});

export { UserRole };

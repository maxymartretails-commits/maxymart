import { NextApiRequest, NextApiResponse } from "next";
import { ROLES } from "./roles";
import { prisma } from "../prisma";

type Action = "view" | "create" | "update" | "delete";

type ValidateAccessArgs = {
  resource: keyof (typeof ROLES)[keyof typeof ROLES];
  action: Action;
  userId: string;
};

export const validateAccess = async ({
  resource,
  action,
  userId,
}: ValidateAccessArgs): Promise<boolean> => {
  const [existingUser] = await prisma.user.findMany({
    where: { id: userId },
    include: { roles: true },
  });
  if (!existingUser) {
    throw Error("User not found");
  }
  const role = existingUser.roles.name as keyof typeof ROLES;

  const isAllowed = await hasAccess(resource, action, role);
  console.log("isAllowed", isAllowed);

  return isAllowed;
};

export async function hasAccess(
  resource: keyof (typeof ROLES)[keyof typeof ROLES],
  action: Action,
  role: keyof typeof ROLES
): Promise<boolean> {
  return ROLES[role]?.[resource]?.[action] || false;
}

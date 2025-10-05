import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const lockRowForUpdate = async (
  id: string,
  tableName: string,
  tx: Prisma.TransactionClient = prisma
) => {
  await tx.$queryRawUnsafe(
    `SELECT * FROM "${tableName}" WHERE id = $1 FOR UPDATE`,
    id
  );
};

export const lockRowForDelete = async (
  tx: Prisma.TransactionClient,
  id: string,
  tableName: string
) => {
  await tx.$queryRawUnsafe(`
          SELECT * FROM ${tableName}
          WHERE id = ${id}
          FOR DELETE
        `);
};

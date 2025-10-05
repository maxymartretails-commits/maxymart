// lib/middleware/validateRequest.ts
import { ZodType } from "zod";

export async function validateRequest<T>(body: unknown, schema: ZodType<T>) {
  const result = schema.safeParse(body);

  console.log("result", result.error);
  if (!result.success) {
    const errorMsg = result.error.issues.map((err) => {
      const cleanedPath = err.path
        .filter((segment) => isNaN(Number(segment))) // remove index numbers like 0, 1
        .join(".");

      return {
        field: cleanedPath,
        message: err.message,
      };
    });

    return {
      success: false,
      error: errorMsg,
    };
  }

  return {
    success: true,
    data: result.data as T,
  };
}

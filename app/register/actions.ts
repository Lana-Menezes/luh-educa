"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {
  hasAuthFieldErrors,
  normalizeEmail,
  readPassword,
  validateRegisterCredentials,
} from "@/lib/auth-validation";

export async function registerUser(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = normalizeEmail(formData.get("email"));
  const password = readPassword(formData.get("password"));
  const confirmPassword = readPassword(formData.get("confirmPassword"));

  const errors = validateRegisterCredentials(
    name,
    email,
    password,
    confirmPassword,
  );

  if (hasAuthFieldErrors(errors)) {
    return {
      error:
        errors.name ||
        errors.email ||
        errors.password ||
        errors.confirmPassword ||
        "Dados inválidos",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Já existe uma conta com este e-mail" };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
    },
  });

  return { success: true };
}

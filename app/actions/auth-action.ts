"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

const SignUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export async function signUpAction(values: z.infer<typeof SignUpSchema>) {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields provided." };
  }

  const { email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return { success: "User created successfully!", user };

  } catch (error) {
    console.error("SIGNUP_ACTION_ERROR", error);
    return { error: "An unexpected error occurred." };
  }
}
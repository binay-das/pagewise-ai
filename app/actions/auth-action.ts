"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/types/result";
import { logger, maskEmail } from "@/lib/logger";

const SignUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

type SignUpData = {
  id: string;
  email: string;
  createdAt: Date;
};

export async function signUpAction(values: z.infer<typeof SignUpSchema>): Promise<Result<SignUpData>> {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields provided." };
  }

  const { email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "User with this email already exists." };
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

    return { success: true, data: user };

  } catch (error) {
    logger.error({ error, email: maskEmail(email) }, "Signup action error");
    return { success: false, error: "An unexpected error occurred." };
  }
}
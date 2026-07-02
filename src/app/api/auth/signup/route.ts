import { NextResponse } from "next/server";
import { z } from "zod";

import { createUser, findUserByEmail, isValidEmail, isValidPassword } from "@/lib/auth/users";

export const runtime = "nodejs";

const SignupSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),
});

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = SignupSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid signup details." },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (!isValidPassword(password)) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const existing = await findUserByEmail(email);

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  try {
    const user = await createUser(email, password);

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to create account right now. Please try again." },
      { status: 500 },
    );
  }
}

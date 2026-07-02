import bcrypt from "bcryptjs";

export type AuthUser = {
  id: string;
  email: string;
  passwordHash: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isPostgresStoreEnabled() {
  return Boolean(
    process.env.POSTGRES_URL ??
      process.env.DATABASE_URL?.startsWith("postgres"),
  );
}

async function ensurePostgresUsersTable() {
  const { sql } = await import("@vercel/postgres");

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

async function findUserByEmailPostgres(email: string): Promise<AuthUser | null> {
  await ensurePostgresUsersTable();

  const { sql } = await import("@vercel/postgres");
  const normalized = normalizeEmail(email);
  const { rows } = await sql<{
    id: string;
    email: string;
    password_hash: string;
  }>`
    SELECT id, email, password_hash
    FROM users
    WHERE email = ${normalized}
    LIMIT 1
  `;

  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
  };
}

async function createUserPostgres(
  email: string,
  passwordHash: string,
): Promise<AuthUser> {
  await ensurePostgresUsersTable();

  const { sql } = await import("@vercel/postgres");
  const normalized = normalizeEmail(email);
  const id = crypto.randomUUID();

  await sql`
    INSERT INTO users (id, email, password_hash)
    VALUES (${id}, ${normalized}, ${passwordHash})
  `;

  return { id, email: normalized, passwordHash };
}

async function findUserByEmailSqlite(email: string): Promise<AuthUser | null> {
  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    passwordHash: user.passwordHash,
  };
}

async function createUserSqlite(
  email: string,
  passwordHash: string,
): Promise<AuthUser> {
  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.create({
    data: {
      email: normalizeEmail(email),
      passwordHash,
    },
  });

  return {
    id: user.id,
    email: user.email,
    passwordHash: user.passwordHash,
  };
}

export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  if (isPostgresStoreEnabled()) {
    return findUserByEmailPostgres(email);
  }

  return findUserByEmailSqlite(email);
}

export async function createUser(
  email: string,
  password: string,
): Promise<AuthUser> {
  const passwordHash = await bcrypt.hash(password, 12);

  if (isPostgresStoreEnabled()) {
    return createUserPostgres(email, passwordHash);
  }

  return createUserSqlite(email, passwordHash);
}

export async function verifyPassword(
  user: AuthUser,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPassword(password: string) {
  return password.length >= 8;
}

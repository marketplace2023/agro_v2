import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL!;
const sql = neon(DATABASE_URL);

async function main() {
  console.log("Connecting to NeonDB...");

  // Add new enum values (safe — ALTER TYPE ADD VALUE is non-destructive)
  await sql`ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'almacen'`;
  await sql`ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'representante'`;
  await sql`ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'credito'`;

  console.log("✅ Roles almacen, representante, credito added to UserRole enum");
}

main().catch(console.error);

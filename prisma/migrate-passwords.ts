import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

/**
 * Migration script to hash existing plaintext passwords
 * Run with: npx ts-node prisma/migrate-passwords.ts
 */
async function migratePasswords() {
  console.log("Starting password migration...");

  // Find all users with plaintext passwords (not starting with $2a$)
  const users = await prisma.user.findMany({
    where: {
      password: {
        not: {
          startsWith: "$2a$",
        },
      },
    },
  });

  console.log(`Found ${users.length} users with plaintext passwords`);

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    console.log(`Migrated user: ${user.email}`);
  }

  console.log("Password migration complete!");
}

migratePasswords()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

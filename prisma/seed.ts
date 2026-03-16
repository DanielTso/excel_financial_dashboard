import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "daniel@example.com";
  const password = "password123";

  // Upsert user
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password,
      name: "Daniel Tso",
    },
  });

  // Categories
  const categories = [
    { name: "Salary", group: "Income", isIncome: true, color: "#2D7D46" },
    { name: "Housing", group: "Fixed", isIncome: false, color: "#2B6CB0" },
    { name: "Food & Dining", group: "Variable", isIncome: false, color: "#2D7D46" },
    { name: "Transportation", group: "Variable", isIncome: false, color: "#B7791F" },
    { name: "Utilities", group: "Fixed", isIncome: false, color: "#C53030" },
    { name: "Entertainment", group: "Variable", isIncome: false, color: "#6B46C1" },
  ];

  for (const cat of categories) {
    await prisma.category.create({
      data: { ...cat, userId: user.id },
    });
  }

  const allCats = await prisma.category.findMany({ where: { userId: user.id } });
  const salaryCat = allCats.find(c => c.name === "Salary");
  const housingCat = allCats.find(c => c.name === "Housing");

  // Accounts
  const accounts = [
    { name: "Chase Checking", type: "CHECKING", institution: "Chase", currentBalance: 4250.00 },
    { name: "Amex Blue Cash", type: "CREDIT_CARD", institution: "American Express", currentBalance: -1240.50 },
    { name: "Vanguard 401k", type: "INVESTMENT", institution: "Vanguard", currentBalance: 125000.00 },
  ];

  for (const acc of accounts) {
    await prisma.account.create({
      data: { ...acc, userId: user.id },
    });
  }

  const allAccs = await prisma.account.findMany({ where: { userId: user.id } });
  const chaseAcc = allAccs.find(a => a.name === "Chase Checking");

  // Transactions
  await prisma.transaction.create({
    data: {
      date: new Date(),
      payee: "Employer - Payroll",
      amount: 3250.00,
      type: "INCOME",
      accountId: chaseAcc!.id,
      categoryId: salaryCat!.id,
    },
  });

  await prisma.transaction.create({
    data: {
      date: new Date(),
      payee: "Main Street Apartments",
      amount: -1800.00,
      type: "EXPENSE",
      accountId: chaseAcc!.id,
      categoryId: housingCat!.id,
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

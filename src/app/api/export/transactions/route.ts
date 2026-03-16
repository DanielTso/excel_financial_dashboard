import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { format } from "date-fns";
import { NextResponse } from "next/server";

/**
 * Export transactions as CSV
 * GET /api/export/transactions
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Fetch all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { account: { userId: user.id } },
      include: {
        account: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    });

    // Generate CSV
    const headers = [
      "Date",
      "Payee",
      "Category",
      "Account",
      "Amount",
      "Type",
      "Memo",
    ];

    const rows = transactions.map((tx) => [
      format(tx.date, "yyyy-MM-dd"),
      tx.payee,
      tx.category?.name ?? "Uncategorized",
      tx.account.name,
      tx.amount.toFixed(2),
      tx.type,
      tx.memo ?? "",
    ]);

    // Escape special characters and wrap in quotes if needed
    const escapeCsv = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    // Set headers for file download
    const filename = `transactions_${format(new Date(), "yyyy-MM-dd")}.csv`;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

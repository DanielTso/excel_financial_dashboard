import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Download, Plus, Filter } from "lucide-react";
import {
  getPaginationParams,
  getPaginationMetadata,
  parsePaginationParams,
} from "@/lib/pagination";

interface TransactionsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/login");

  // Parse pagination from URL
  const params = await searchParams;
  const { page, pageSize } = parsePaginationParams(params);
  const { skip, take } = getPaginationParams(page, pageSize);

  // Get total count for pagination
  const totalCount = await prisma.transaction.count({
    where: { account: { userId: user.id } },
  });

  // Get paginated transactions
  const transactions = await prisma.transaction.findMany({
    where: { account: { userId: user.id } },
    include: {
      account: { select: { name: true } },
      category: { select: { name: true, color: true } },
    },
    orderBy: { date: "desc" },
    skip,
    take,
  });

  const pagination = getPaginationMetadata(totalCount, page, pageSize);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-display text-foreground leading-tight">
            Transactions
          </h1>
          <p className="text-[13px] text-muted-foreground">
            View and manage all your financial activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 gap-2 border-divider hover:bg-sand/20 text-[13px] font-semibold"
          >
            <Filter size={18} />
            Filter
          </Button>
          <Button
            variant="outline"
            className="h-10 gap-2 border-divider hover:bg-sand/20 text-[13px] font-semibold"
          >
            <Download size={18} />
            Export
          </Button>
          <Button className="bg-steel-blue hover:bg-steel-blue/90 text-white font-semibold h-10 gap-2 shadow-card">
            <Plus size={18} />
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <TransactionTable transactions={transactions} />
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          baseUrl="/transactions"
        />
      </div>
    </div>
  );
}

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AccountList } from "@/components/accounts/AccountList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AccountsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const accounts = await prisma.account.findMany({
    where: { userId: user!.id },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-display text-foreground leading-tight">Accounts</h1>
          <p className="text-[13px] text-muted-foreground">Manage your banking, investment, and credit accounts.</p>
        </div>
        <Button className="bg-steel-blue hover:bg-steel-blue/90 text-white font-semibold h-10 gap-2 shadow-card">
          <Plus size={18} />
          Add Account
        </Button>
      </div>

      <AccountList accounts={accounts} />
    </div>
  );
}

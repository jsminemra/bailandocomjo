import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardClient from "@/components/DashboardClient";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // 👈 agora vai pra sua tela certa
  }

  return (
    <DashboardClient
      nome={session.user.name || "Usuária"}
      email={session.user.email || ""}
    />
  );
}

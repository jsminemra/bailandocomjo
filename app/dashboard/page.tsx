import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import DashboardClient from "@/components/DashboardClient";

export default async function Dashboard() {
  const session = await getAuthSession();

  // se não tiver sessão → manda pro login
  if (!session) {
    redirect("/login");
  }

  // se tiver sessão → vai pro dashboard normal
  return (
    <DashboardClient
      nome={session.user?.name || "Usuária"}
      email={session.user?.email || ""}
    />
  );
}

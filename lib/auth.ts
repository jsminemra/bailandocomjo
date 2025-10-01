import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export { authOptions }; // 👈 exporta de novo pra não quebrar nada
export const getAuthSession = () => getServerSession(authOptions);

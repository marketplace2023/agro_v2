import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";

export default async function PerfilRedirect() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: string }).role ?? "comprador";
  redirect(`/dashboard/${role}/perfil`);
}

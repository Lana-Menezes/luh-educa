export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { checkPostTableExists } from "@/lib/db-utils";

export default async function Home() {
  const tableExists = await checkPostTableExists();

  if (!tableExists) {
    redirect("/setup");
  }

  redirect("/dashboard");
}

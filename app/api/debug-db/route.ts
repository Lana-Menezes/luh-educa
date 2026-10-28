import prisma from "@/lib/prisma";

// Rota temporária de diagnóstico: não expõe segredos, só host/porta/nome do
// banco que o servidor está de fato usando em runtime, e o que ele encontra
// para um e-mail de teste. Remover depois de investigar.
export async function GET() {
  let dbInfo: { host: string; port: string; pathname: string } | null = null;
  try {
    const u = new URL(process.env.DATABASE_URL ?? "");
    dbInfo = { host: u.hostname, port: u.port, pathname: u.pathname };
  } catch {
    dbInfo = null;
  }

  const user = await prisma.user.findUnique({
    where: { email: "john@doe.com" },
    select: { id: true, name: true, email: true },
  });

  const count = await prisma.user.count();

  return Response.json({ dbInfo, user, totalUsers: count });
}

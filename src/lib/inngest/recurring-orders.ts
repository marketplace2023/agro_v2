import { inngest } from "./client";

export const recurringOrdersCron = inngest.createFunction(
  {
    id: "recurring-orders-cron",
    name: "Procesar pedidos recurrentes B2B",
    triggers: [{ cron: "0 6 * * *" }],
  },
  async ({ step }: { step: { run: (name: string, fn: () => Promise<unknown>) => unknown } }) => {
    const orders = await step.run("find-due-recurring-orders", async () => {
      const { prisma } = await import("@/lib/db/prisma");
      const now = new Date();

      return prisma.recurringOrder.findMany({
        where: {
          isActive: true,
          nextRunAt: { lte: now },
        },
      });
    });

    const due = orders as Array<{
      id: string; buyerId: string; name: string;
      items: unknown; frequency: string; nextRunAt: string;
    }>;

    await step.run("advance-schedules", async () => {
      const { prisma } = await import("@/lib/db/prisma");
      const now = new Date();

      for (const recurring of due) {
        const nextRun = computeNextRun(recurring.frequency, now);
        await prisma.recurringOrder.update({
          where: { id: recurring.id },
          data: { nextRunAt: nextRun },
        });
      }

      return { advanced: due.length };
    });

    return { processed: due.length };
  }
);

function computeNextRun(frequency: string, from: Date): Date {
  const d = new Date(from);
  switch (frequency) {
    case "semanal":    d.setDate(d.getDate() + 7);    break;
    case "quincenal":  d.setDate(d.getDate() + 14);   break;
    case "mensual":    d.setMonth(d.getMonth() + 1);  break;
    case "trimestral": d.setMonth(d.getMonth() + 3);  break;
    default:           d.setMonth(d.getMonth() + 1);  break;
  }
  return d;
}

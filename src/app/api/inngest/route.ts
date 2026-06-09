import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import {
  waOrdenConfirmada,
  waPagoRecibido,
  waOrdenDespachada,
  waAprobacionRequerida,
  waRFQNueva,
} from "@/lib/inngest/whatsapp-jobs";
import { regulatoryAlertScan, regulatoryManualScan } from "@/lib/inngest/regulatory-jobs";
import { recurringOrdersCron } from "@/lib/inngest/recurring-orders";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    waOrdenConfirmada,
    waPagoRecibido,
    waOrdenDespachada,
    waAprobacionRequerida,
    waRFQNueva,
    regulatoryAlertScan,
    regulatoryManualScan,
    recurringOrdersCron,
  ],
});

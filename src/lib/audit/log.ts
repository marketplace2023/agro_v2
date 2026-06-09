import { prisma } from "@/lib/db/prisma";

interface AuditParams {
  userId: string;
  userRole: string;
  module: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress?: string;
  userAgent?: string;
  fieldsBefore?: Record<string, unknown>;
  fieldsAfter?: Record<string, unknown>;
  comment?: string;
}

export async function createAuditLog(params: AuditParams) {
  return prisma.auditLog.create({
    data: {
      userId: params.userId,
      userRole: params.userRole,
      module: params.module,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fieldsBefore: params.fieldsBefore as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fieldsAfter: params.fieldsAfter as any,
      comment: params.comment,
    },
  });
}

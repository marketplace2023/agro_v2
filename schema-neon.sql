-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('comprador', 'comprador_corporativo', 'vendedor', 'fabricante', 'distribuidor', 'asesor', 'logistica', 'regulatorio', 'finanzas', 'soporte', 'marketing', 'admin');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('compradora', 'vendedora', 'fabricante', 'distribuidora');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pendiente', 'confirmada', 'en_preparacion', 'despachada', 'en_transito', 'entregada', 'cancelada', 'en_reclamo', 'devuelta');

-- CreateEnum
CREATE TYPE "RegulatoryStatus" AS ENUM ('pendiente', 'aprobado', 'rechazado', 'vencido', 'bloqueado');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('ficha_tecnica', 'sds', 'etiqueta', 'certificado_calidad', 'certificado_origen', 'registro_sanitario', 'otro');

-- CreateEnum
CREATE TYPE "RFQStatus" AS ENUM ('borrador', 'abierta', 'cerrada', 'aceptada', 'cancelada');

-- CreateEnum
CREATE TYPE "RFQType" AS ENUM ('estandar', 'sourcing');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pendiente', 'aprobado', 'rechazado', 'ajuste_solicitado');

-- CreateEnum
CREATE TYPE "CreditStatus" AS ENUM ('activo', 'suspendido', 'bloqueado');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('borrador', 'activo', 'vencido', 'cancelado');

-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('consulta', 'reclamo', 'garantia', 'tecnico');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('abierto', 'en_atencion', 'resuelto', 'cerrado');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('baja', 'media', 'alta', 'critica');

-- CreateEnum
CREATE TYPE "DiagnosticStatus" AS ENUM ('recibido', 'asignado', 'en_proceso', 'respondido', 'cerrado');

-- CreateEnum
CREATE TYPE "DiagnosticUrgency" AS ENUM ('alta', 'media', 'baja');

-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('retraso', 'danio', 'extravio', 'rechazo_destino');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('reportado', 'en_gestion', 'resuelto');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('cupon', 'descuento_directo', 'producto_destacado', 'banner');

-- CreateEnum
CREATE TYPE "SedeType" AS ENUM ('sede_central', 'finca', 'sucursal', 'deposito');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'comprador',
    "companyId" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "cropTypes" TEXT[],
    "volumeRange" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "commercialName" TEXT,
    "nit" TEXT,
    "type" "CompanyType" NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyUser" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "purchaseLimit" DOUBLE PRECISION,
    "defaultSedeId" TEXT,
    "defaultCCId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sede" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SedeType" NOT NULL DEFAULT 'finca',
    "country" TEXT NOT NULL,
    "state" TEXT,
    "city" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "cropTypes" TEXT[],
    "areaTotalHa" DOUBLE PRECISION,
    "managerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sede_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CentroCosto" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "budget" DOUBLE PRECISION,
    "currentSpend" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CentroCosto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "iconUrl" TEXT,
    "imageUrl" TEXT,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "manufacturerId" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "technicalName" TEXT,
    "activeIngredient" TEXT,
    "concentration" TEXT,
    "formulation" TEXT,
    "modeOfAction" TEXT,
    "chemicalGroup" TEXT,
    "brandId" TEXT,
    "categoryId" TEXT NOT NULL,
    "description" TEXT,
    "technicalDesc" TEXT,
    "cropTypes" TEXT[],
    "targetPests" TEXT[],
    "applicationMethods" TEXT[],
    "withdrawalPeriod" TEXT,
    "reentryInterval" TEXT,
    "compatible" TEXT[],
    "incompatible" TEXT[],
    "isRegulated" BOOLEAN NOT NULL DEFAULT true,
    "isBiological" BOOLEAN NOT NULL DEFAULT false,
    "isOrganic" BOOLEAN NOT NULL DEFAULT false,
    "status" "RegulatoryStatus" NOT NULL DEFAULT 'pendiente',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "presentation" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPriceVolume" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "minQty" INTEGER NOT NULL,
    "maxQty" INTEGER,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ProductPriceVolume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalSales" INTEGER NOT NULL DEFAULT 0,
    "fulfillmentRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "countries" TEXT[],
    "categories" TEXT[],
    "bankAccount" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVendor" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "companyId" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "deliveryDays" INTEGER NOT NULL DEFAULT 5,
    "countries" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegulatoryRecord" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "registrationNum" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" "RegulatoryStatus" NOT NULL DEFAULT 'pendiente',
    "restrictions" TEXT,
    "officialDocUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegulatoryRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "country" TEXT,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "RegulatoryStatus" NOT NULL DEFAULT 'pendiente',
    "uploadedById" TEXT NOT NULL,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'CO',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "companyId" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'pendiente',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "country" TEXT NOT NULL,
    "deliveryAddress" JSONB NOT NULL,
    "billingData" JSONB,
    "paymentMethod" TEXT,
    "paymentIntentId" TEXT,
    "creditUsed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "invoiceUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "loteId" TEXT,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "orderId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "cropUsed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RFQ" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reference" TEXT,
    "type" "RFQType" NOT NULL DEFAULT 'estandar',
    "status" "RFQStatus" NOT NULL DEFAULT 'borrador',
    "deliveryCountry" TEXT NOT NULL,
    "deliveryCity" TEXT,
    "deliveryAddress" TEXT,
    "requiredDate" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "paymentTerms" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RFQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RFQItem" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "presentation" TEXT,
    "specs" TEXT,
    "requiredDocs" TEXT[],

    CONSTRAINT "RFQItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RFQOffer" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentTerms" TEXT,
    "deliveryDays" INTEGER NOT NULL,
    "validUntil" TIMESTAMP(3),
    "status" "ApprovalStatus" NOT NULL DEFAULT 'pendiente',
    "notes" TEXT,
    "items" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RFQOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRule" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minAmount" DOUBLE PRECISION,
    "isNewVendor" BOOLEAN NOT NULL DEFAULT false,
    "ccThreshold" DOUBLE PRECISION,
    "approverId" TEXT NOT NULL,
    "escalateId" TEXT,
    "escalateMin" DOUBLE PRECISION,

    CONSTRAINT "ApprovalRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "solicitanteId" TEXT NOT NULL,
    "aprobadorId" TEXT,
    "orderId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'pendiente',
    "ruleApplied" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "buyerCompanyId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "vendorCompanyId" TEXT NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'borrador',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "paymentTerms" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "shippingTerms" TEXT,
    "warrantyTerms" TEXT,
    "specialClauses" TEXT,
    "signedDocUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractItem" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "pactedPrice" DOUBLE PRECISION NOT NULL,
    "minVolume" DOUBLE PRECISION,
    "maxVolume" DOUBLE PRECISION,
    "unit" TEXT NOT NULL,

    CONSTRAINT "ContractItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "totalLimit" DOUBLE PRECISION NOT NULL,
    "usedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentTermDays" INTEGER NOT NULL DEFAULT 30,
    "status" "CreditStatus" NOT NULL DEFAULT 'activo',
    "analystId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "nextReview" TIMESTAMP(3),
    "guaranteeType" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringOrder" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "frequency" TEXT NOT NULL,
    "nextRunAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecurringOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tracking" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "carrier" TEXT,
    "trackingNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "estimatedDate" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "recipientName" TEXT,
    "recipientId" TEXT,
    "signatureUrl" TEXT,
    "deliveryPhotoUrl" TEXT,
    "productCondition" TEXT,
    "events" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lote" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "loteCode" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "manufacturedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "certUrl" TEXT,
    "warehouseLocation" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" "IncidentType" NOT NULL,
    "status" "IncidentStatus" NOT NULL DEFAULT 'reportado',
    "description" TEXT NOT NULL,
    "evidenceUrls" TEXT[],
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "stripeIntentId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "confirmedAt" TIMESTAMP(3),
    "refundedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commission" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "settled" BOOLEAN NOT NULL DEFAULT false,
    "settlementId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "analystId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "grossAmount" DOUBLE PRECISION NOT NULL,
    "commissionAmount" DOUBLE PRECISION NOT NULL,
    "returnsAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "retentionAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "proofUrl" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "specialties" TEXT[],
    "cropTypes" TEXT[],
    "countries" TEXT[],
    "regions" TEXT[],
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalConsults" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "availability" JSONB,
    "bioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnostic" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "expertId" TEXT,
    "cropType" TEXT NOT NULL,
    "phenologicalStage" TEXT,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "areaHa" DOUBLE PRECISION,
    "problemType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "symptoms" TEXT[],
    "photoUrls" TEXT[],
    "photoDescriptions" TEXT[],
    "lastApplication" TEXT,
    "soilAnalysisUrl" TEXT,
    "urgency" "DiagnosticUrgency" NOT NULL DEFAULT 'media',
    "status" "DiagnosticStatus" NOT NULL DEFAULT 'recibido',
    "diagnosisText" TEXT,
    "cause" TEXT,
    "recommendedProducts" JSONB,
    "technicalPlan" TEXT,
    "fieldVisitRequired" BOOLEAN NOT NULL DEFAULT false,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnostic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgroKnowledge" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cropTypes" TEXT[],
    "description" TEXT,
    "symptoms" TEXT,
    "causes" TEXT,
    "conditions" TEXT,
    "photoUrls" TEXT[],
    "recommendedProductIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgroKnowledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "vendorId" TEXT,
    "orderId" TEXT,
    "assignedToId" TEXT,
    "type" "TicketType" NOT NULL,
    "priority" "TicketPriority" NOT NULL DEFAULT 'media',
    "status" "TicketStatus" NOT NULL DEFAULT 'abierto',
    "subject" TEXT NOT NULL,
    "slaHours" INTEGER NOT NULL DEFAULT 24,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketMessage" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "attachments" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "authorId" TEXT NOT NULL,
    "category" TEXT,
    "tags" TEXT[],
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "mentionedProductIds" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CampaignType" NOT NULL,
    "couponCode" TEXT,
    "discountRate" DOUBLE PRECISION,
    "discountFixed" DOUBLE PRECISION,
    "discountTarget" TEXT,
    "appliesTo" TEXT,
    "categoryIds" TEXT[],
    "productIds" TEXT[],
    "minAmount" DOUBLE PRECISION,
    "maxDiscount" DOUBLE PRECISION,
    "maxUses" INTEGER,
    "usesPerUser" INTEGER NOT NULL DEFAULT 1,
    "totalUses" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "bannerUrl" TEXT,
    "bannerLink" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "fieldsBefore" JSONB,
    "fieldsAfter" JSONB,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_companyId_idx" ON "User"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Company_type_idx" ON "Company"("type");

-- CreateIndex
CREATE INDEX "Company_country_idx" ON "Company"("country");

-- CreateIndex
CREATE INDEX "CompanyUser_companyId_idx" ON "CompanyUser"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyUser_companyId_userId_key" ON "CompanyUser"("companyId", "userId");

-- CreateIndex
CREATE INDEX "Sede_companyId_idx" ON "Sede"("companyId");

-- CreateIndex
CREATE INDEX "CentroCosto_companyId_idx" ON "CentroCosto"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CentroCosto_companyId_code_key" ON "CentroCosto"("companyId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE INDEX "Brand_slug_idx" ON "Brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_sku_idx" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductPriceVolume_variantId_idx" ON "ProductPriceVolume"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_companyId_key" ON "Vendor"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_slug_key" ON "Vendor"("slug");

-- CreateIndex
CREATE INDEX "Vendor_slug_idx" ON "Vendor"("slug");

-- CreateIndex
CREATE INDEX "Vendor_companyId_idx" ON "Vendor"("companyId");

-- CreateIndex
CREATE INDEX "ProductVendor_productId_idx" ON "ProductVendor"("productId");

-- CreateIndex
CREATE INDEX "ProductVendor_vendorId_idx" ON "ProductVendor"("vendorId");

-- CreateIndex
CREATE INDEX "ProductVendor_companyId_idx" ON "ProductVendor"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVendor_productId_vendorId_companyId_key" ON "ProductVendor"("productId", "vendorId", "companyId");

-- CreateIndex
CREATE INDEX "RegulatoryRecord_productId_idx" ON "RegulatoryRecord"("productId");

-- CreateIndex
CREATE INDEX "RegulatoryRecord_country_idx" ON "RegulatoryRecord"("country");

-- CreateIndex
CREATE INDEX "RegulatoryRecord_status_idx" ON "RegulatoryRecord"("status");

-- CreateIndex
CREATE INDEX "RegulatoryRecord_expiresAt_idx" ON "RegulatoryRecord"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryRecord_productId_country_key" ON "RegulatoryRecord"("productId", "country");

-- CreateIndex
CREATE INDEX "Document_productId_idx" ON "Document"("productId");

-- CreateIndex
CREATE INDEX "Document_type_idx" ON "Document"("type");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_variantId_vendorId_key" ON "CartItem"("cartId", "variantId", "vendorId");

-- CreateIndex
CREATE INDEX "Order_buyerId_idx" ON "Order"("buyerId");

-- CreateIndex
CREATE INDEX "Order_vendorId_idx" ON "Order"("vendorId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_companyId_idx" ON "Order"("companyId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE INDEX "Review_productId_idx" ON "Review"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_productId_buyerId_orderId_key" ON "Review"("productId", "buyerId", "orderId");

-- CreateIndex
CREATE INDEX "RFQ_buyerId_idx" ON "RFQ"("buyerId");

-- CreateIndex
CREATE INDEX "RFQ_status_idx" ON "RFQ"("status");

-- CreateIndex
CREATE INDEX "RFQItem_rfqId_idx" ON "RFQItem"("rfqId");

-- CreateIndex
CREATE INDEX "RFQOffer_rfqId_idx" ON "RFQOffer"("rfqId");

-- CreateIndex
CREATE INDEX "RFQOffer_vendorId_idx" ON "RFQOffer"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "RFQOffer_rfqId_vendorId_key" ON "RFQOffer"("rfqId", "vendorId");

-- CreateIndex
CREATE INDEX "ApprovalRule_companyId_idx" ON "ApprovalRule"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Approval_orderId_key" ON "Approval"("orderId");

-- CreateIndex
CREATE INDEX "Approval_companyId_idx" ON "Approval"("companyId");

-- CreateIndex
CREATE INDEX "Approval_status_idx" ON "Approval"("status");

-- CreateIndex
CREATE INDEX "Contract_buyerCompanyId_idx" ON "Contract"("buyerCompanyId");

-- CreateIndex
CREATE INDEX "Contract_vendorId_idx" ON "Contract"("vendorId");

-- CreateIndex
CREATE INDEX "Contract_status_idx" ON "Contract"("status");

-- CreateIndex
CREATE INDEX "ContractItem_contractId_idx" ON "ContractItem"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "Credit_companyId_key" ON "Credit"("companyId");

-- CreateIndex
CREATE INDEX "Credit_companyId_idx" ON "Credit"("companyId");

-- CreateIndex
CREATE INDEX "Credit_status_idx" ON "Credit"("status");

-- CreateIndex
CREATE INDEX "RecurringOrder_buyerId_idx" ON "RecurringOrder"("buyerId");

-- CreateIndex
CREATE INDEX "RecurringOrder_nextRunAt_idx" ON "RecurringOrder"("nextRunAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tracking_orderId_key" ON "Tracking"("orderId");

-- CreateIndex
CREATE INDEX "Lote_vendorId_idx" ON "Lote"("vendorId");

-- CreateIndex
CREATE INDEX "Lote_productId_idx" ON "Lote"("productId");

-- CreateIndex
CREATE INDEX "Lote_expiresAt_idx" ON "Lote"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Lote_vendorId_loteCode_key" ON "Lote"("vendorId", "loteCode");

-- CreateIndex
CREATE INDEX "Incident_orderId_idx" ON "Incident"("orderId");

-- CreateIndex
CREATE INDEX "Incident_status_idx" ON "Incident"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Commission_orderId_key" ON "Commission"("orderId");

-- CreateIndex
CREATE INDEX "Commission_vendorId_idx" ON "Commission"("vendorId");

-- CreateIndex
CREATE INDEX "Commission_settled_idx" ON "Commission"("settled");

-- CreateIndex
CREATE INDEX "Settlement_vendorId_idx" ON "Settlement"("vendorId");

-- CreateIndex
CREATE INDEX "Settlement_status_idx" ON "Settlement"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Expert_userId_key" ON "Expert"("userId");

-- CreateIndex
CREATE INDEX "Diagnostic_buyerId_idx" ON "Diagnostic"("buyerId");

-- CreateIndex
CREATE INDEX "Diagnostic_expertId_idx" ON "Diagnostic"("expertId");

-- CreateIndex
CREATE INDEX "Diagnostic_status_idx" ON "Diagnostic"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AgroKnowledge_slug_key" ON "AgroKnowledge"("slug");

-- CreateIndex
CREATE INDEX "AgroKnowledge_type_idx" ON "AgroKnowledge"("type");

-- CreateIndex
CREATE INDEX "AgroKnowledge_slug_idx" ON "AgroKnowledge"("slug");

-- CreateIndex
CREATE INDEX "Ticket_buyerId_idx" ON "Ticket"("buyerId");

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- CreateIndex
CREATE INDEX "Ticket_assignedToId_idx" ON "Ticket"("assignedToId");

-- CreateIndex
CREATE INDEX "TicketMessage_ticketId_idx" ON "TicketMessage"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_published_idx" ON "BlogPost"("published");

-- CreateIndex
CREATE INDEX "BlogPost_publishedAt_idx" ON "BlogPost"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_couponCode_key" ON "Campaign"("couponCode");

-- CreateIndex
CREATE INDEX "Campaign_isActive_idx" ON "Campaign"("isActive");

-- CreateIndex
CREATE INDEX "Campaign_couponCode_idx" ON "Campaign"("couponCode");

-- CreateIndex
CREATE INDEX "Campaign_endsAt_idx" ON "Campaign"("endsAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_module_idx" ON "AuditLog"("module");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyUser" ADD CONSTRAINT "CompanyUser_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyUser" ADD CONSTRAINT "CompanyUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyUser" ADD CONSTRAINT "CompanyUser_defaultSedeId_fkey" FOREIGN KEY ("defaultSedeId") REFERENCES "Sede"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyUser" ADD CONSTRAINT "CompanyUser_defaultCCId_fkey" FOREIGN KEY ("defaultCCId") REFERENCES "CentroCosto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sede" ADD CONSTRAINT "Sede_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CentroCosto" ADD CONSTRAINT "CentroCosto_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPriceVolume" ADD CONSTRAINT "ProductPriceVolume_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVendor" ADD CONSTRAINT "ProductVendor_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVendor" ADD CONSTRAINT "ProductVendor_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulatoryRecord" ADD CONSTRAINT "RegulatoryRecord_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RFQ" ADD CONSTRAINT "RFQ_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RFQItem" ADD CONSTRAINT "RFQItem_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "RFQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RFQItem" ADD CONSTRAINT "RFQItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RFQOffer" ADD CONSTRAINT "RFQOffer_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "RFQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RFQOffer" ADD CONSTRAINT "RFQOffer_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_aprobadorId_fkey" FOREIGN KEY ("aprobadorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_buyerCompanyId_fkey" FOREIGN KEY ("buyerCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_vendorCompanyId_fkey" FOREIGN KEY ("vendorCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractItem" ADD CONSTRAINT "ContractItem_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_analystId_fkey" FOREIGN KEY ("analystId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expert" ADD CONSTRAINT "Expert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostic" ADD CONSTRAINT "Diagnostic_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostic" ADD CONSTRAINT "Diagnostic_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

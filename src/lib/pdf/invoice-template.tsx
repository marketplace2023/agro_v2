import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, padding: 40, color: "#1a1c1d", backgroundColor: "#ffffff" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  logo: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#005c72" },
  logoSub: { fontSize: 8, color: "#3f484c", marginTop: 2 },
  docTitle: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#005c72", textAlign: "right" },
  docNum: { fontSize: 9, color: "#3f484c", textAlign: "right", marginTop: 2 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#005c72", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  row: { flexDirection: "row", gap: 8 },
  col: { flex: 1 },
  label: { fontSize: 8, color: "#3f484c" },
  value: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  divider: { borderTop: "1px solid #E5E5E5", marginVertical: 12 },
  tableHeader: { flexDirection: "row", backgroundColor: "#005c72", padding: "6 4", gap: 4 },
  tableHeaderText: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  tableRow: { flexDirection: "row", padding: "5 4", borderBottom: "1px solid #E5E5E5", gap: 4 },
  tableRowAlt: { flexDirection: "row", padding: "5 4", borderBottom: "1px solid #E5E5E5", gap: 4, backgroundColor: "#f9f9f9" },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colUnit: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  totalsBox: { alignItems: "flex-end", marginTop: 8 },
  totalsRow: { flexDirection: "row", gap: 16, marginBottom: 3 },
  totalsLabel: { fontSize: 9, color: "#3f484c", width: 100, textAlign: "right" },
  totalsValue: { fontSize: 9, fontFamily: "Helvetica-Bold", width: 80, textAlign: "right" },
  grandTotal: { flexDirection: "row", gap: 16, marginTop: 4, paddingTop: 4, borderTop: "2px solid #005c72" },
  grandLabel: { fontSize: 11, fontFamily: "Helvetica-Bold", width: 100, textAlign: "right", color: "#005c72" },
  grandValue: { fontSize: 11, fontFamily: "Helvetica-Bold", width: 80, textAlign: "right", color: "#005c72" },
  footer: { position: "absolute", bottom: 20, left: 40, right: 40, borderTop: "1px solid #E5E5E5", paddingTop: 6, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7, color: "#3f484c" },
  badge: { backgroundColor: "#2B5F2B", padding: "2 6", borderRadius: 2 },
  badgeText: { fontSize: 7, color: "#ffffff", fontFamily: "Helvetica-Bold" },
});

interface InvoiceItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  num: string;
  fecha: string;
  fechaVence: string;
  vendedor: { nombre: string; nit: string; direccion: string; email: string; telefono: string };
  comprador: { nombre: string; nit: string; direccion: string; email: string };
  items: InvoiceItem[];
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
  moneda: string;
  notas?: string;
}

export function InvoicePDF({ data }: { data: InvoiceData }) {
  return (
    <Document title={`Factura ${data.num}`} author="Marketplace Agro">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>AgroMarket</Text>
            <Text style={styles.logoSub}>Marketplace Agro Latinoamérica</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>FACTURA</Text>
            <Text style={styles.docNum}>{data.num}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Parties */}
        <View style={[styles.row, { marginBottom: 16 }]}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Emisor</Text>
            <Text style={styles.value}>{data.vendedor.nombre}</Text>
            <Text style={styles.label}>NIT: {data.vendedor.nit}</Text>
            <Text style={styles.label}>{data.vendedor.direccion}</Text>
            <Text style={styles.label}>{data.vendedor.email}</Text>
            <Text style={styles.label}>{data.vendedor.telefono}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Receptor</Text>
            <Text style={styles.value}>{data.comprador.nombre}</Text>
            <Text style={styles.label}>NIT: {data.comprador.nit}</Text>
            <Text style={styles.label}>{data.comprador.direccion}</Text>
            <Text style={styles.label}>{data.comprador.email}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Detalles</Text>
            <Text style={styles.label}>Fecha emisión:</Text>
            <Text style={styles.value}>{data.fecha}</Text>
            <Text style={[styles.label, { marginTop: 4 }]}>Fecha vencimiento:</Text>
            <Text style={styles.value}>{data.fechaVence}</Text>
            <Text style={[styles.label, { marginTop: 4 }]}>Moneda:</Text>
            <Text style={styles.value}>{data.moneda}</Text>
          </View>
        </View>

        {/* Items table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colDesc]}>Descripción</Text>
          <Text style={[styles.tableHeaderText, styles.colQty]}>Cant.</Text>
          <Text style={[styles.tableHeaderText, styles.colUnit]}>Unidad</Text>
          <Text style={[styles.tableHeaderText, styles.colUnit]}>P. Unit.</Text>
          <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
        </View>
        {data.items.map((item, i) => (
          <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={[{ fontSize: 9 }, styles.colDesc]}>{item.description}</Text>
            <Text style={[{ fontSize: 9, textAlign: "center" }, styles.colQty]}>{item.quantity}</Text>
            <Text style={[{ fontSize: 9, textAlign: "right" }, styles.colUnit]}>{item.unit}</Text>
            <Text style={[{ fontSize: 9, textAlign: "right" }, styles.colUnit]}>{data.moneda} {item.unitPrice.toFixed(2)}</Text>
            <Text style={[{ fontSize: 9, textAlign: "right", fontFamily: "Helvetica-Bold" }, styles.colTotal]}>{data.moneda} {item.total.toFixed(2)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>{data.moneda} {data.subtotal.toFixed(2)}</Text>
          </View>
          {data.descuento > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Descuento</Text>
              <Text style={[styles.totalsValue, { color: "#2B5F2B" }]}>-{data.moneda} {data.descuento.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>IVA (19%)</Text>
            <Text style={styles.totalsValue}>{data.moneda} {data.iva.toFixed(2)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={styles.grandLabel}>TOTAL</Text>
            <Text style={styles.grandValue}>{data.moneda} {data.total.toFixed(2)}</Text>
          </View>
        </View>

        {data.notas && (
          <View style={[styles.section, { marginTop: 16 }]}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <Text style={{ fontSize: 8, color: "#3f484c" }}>{data.notas}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>AgroMarket — marketplace-agro.com · soporte@marketplace-agro.com</Text>
          <Text style={styles.footerText}>{data.num}</Text>
        </View>
      </Page>
    </Document>
  );
}

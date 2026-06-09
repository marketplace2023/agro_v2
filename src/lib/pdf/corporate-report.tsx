import {
  Document, Page, Text, View, StyleSheet, Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
  ],
});

const COLOR_PRIMARY = "#005c72";
const COLOR_GREEN = "#2B5F2B";
const COLOR_SECONDARY = "#bc000a";
const COLOR_LIGHT = "#f1f5f9";
const COLOR_BORDER = "#e2e8f0";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, padding: 36, color: "#1e293b" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: COLOR_PRIMARY },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: COLOR_PRIMARY },
  headerSub: { fontSize: 9, color: "#64748b", marginTop: 2 },
  headerRight: { alignItems: "flex-end" },
  headerMeta: { fontSize: 8, color: "#94a3b8" },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontWeight: "bold", color: COLOR_PRIMARY, marginBottom: 6, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: COLOR_BORDER },
  kpiRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  kpiCard: { flex: 1, backgroundColor: COLOR_LIGHT, borderRadius: 4, padding: 8, alignItems: "center" },
  kpiValue: { fontSize: 16, fontWeight: "bold", color: COLOR_PRIMARY },
  kpiLabel: { fontSize: 7, color: "#64748b", marginTop: 2, textAlign: "center" },
  table: { width: "100%" },
  tableHeader: { flexDirection: "row", backgroundColor: COLOR_PRIMARY, paddingVertical: 5, paddingHorizontal: 4, borderRadius: 2 },
  tableHeaderCell: { color: "white", fontWeight: "bold", fontSize: 8 },
  tableRow: { flexDirection: "row", paddingVertical: 4, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: COLOR_BORDER },
  tableRowAlt: { backgroundColor: "#f8fafc" },
  bar: { height: 6, borderRadius: 3 },
  barBg: { backgroundColor: COLOR_BORDER, borderRadius: 3 },
  footer: { position: "absolute", bottom: 24, left: 36, right: 36, flexDirection: "row", justifyContent: "space-between", fontSize: 7, color: "#94a3b8", borderTopWidth: 1, borderTopColor: COLOR_BORDER, paddingTop: 4 },
});

export interface CorporateReportData {
  companyName: string; period: string; generatedAt: string;
  totals: { spend: number; orders: number; vendors: number; products: number };
  bySede: Array<{ name: string; spend: number; orders: number; pct: number }>;
  byCultivo: Array<{ name: string; spend: number; orders: number }>;
  byVendor: Array<{ name: string; spend: number; orders: number; avgDelay: number }>;
  byCC: Array<{ name: string; budget: number; spent: number; pct: number }>;
}

function usd(n: number) {
  return `$${n.toLocaleString("es-CO")} USD`;
}

export function CorporateReportDocument({ data }: { data: CorporateReportData }) {
  return (
    <Document title={`Reporte Corporativo — ${data.companyName}`} author="Agrov2 Marketplace">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Reporte Corporativo B2B</Text>
            <Text style={styles.headerSub}>{data.companyName} · Período: {data.period}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={[styles.headerMeta, { color: COLOR_PRIMARY, fontWeight: "bold" }]}>AGROV2 MARKETPLACE</Text>
            <Text style={styles.headerMeta}>Generado: {data.generatedAt}</Text>
          </View>
        </View>

        {/* KPIs */}
        <View style={styles.kpiRow}>
          {[
            { label: "Gasto total", value: usd(data.totals.spend) },
            { label: "Órdenes", value: String(data.totals.orders) },
            { label: "Proveedores", value: String(data.totals.vendors) },
            { label: "Productos", value: String(data.totals.products) },
          ].map(k => (
            <View key={k.label} style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{k.value}</Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
            </View>
          ))}
        </View>

        {/* By Sede */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gasto por Sede / Finca</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Sede</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: "right" }]}>Gasto</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "center" }]}>Órdenes</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: "right" }]}>% del total</Text>
            </View>
            {data.bySede.map((row, i) => (
              <View key={row.name} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={{ flex: 3 }}>{row.name}</Text>
                <Text style={{ flex: 2, textAlign: "right", fontWeight: "bold" }}>{usd(row.spend)}</Text>
                <Text style={{ flex: 1, textAlign: "center" }}>{row.orders}</Text>
                <View style={{ flex: 2, paddingLeft: 4 }}>
                  <View style={[styles.barBg, { width: "100%" }]}>
                    <View style={[styles.bar, { width: `${row.pct}%`, backgroundColor: COLOR_GREEN }]} />
                  </View>
                  <Text style={{ fontSize: 7, textAlign: "right" }}>{row.pct.toFixed(1)}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* By Cultivo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gasto por Cultivo</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Cultivo</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: "right" }]}>Gasto</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "center" }]}>Órdenes</Text>
            </View>
            {data.byCultivo.map((row, i) => (
              <View key={row.name} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={{ flex: 3 }}>{row.name}</Text>
                <Text style={{ flex: 2, textAlign: "right", fontWeight: "bold" }}>{usd(row.spend)}</Text>
                <Text style={{ flex: 1, textAlign: "center" }}>{row.orders}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* By Vendor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gasto por Proveedor</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Proveedor</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: "right" }]}>Gasto</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "center" }]}>Órdenes</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1.5, textAlign: "center" }]}>Retraso prom.</Text>
            </View>
            {data.byVendor.map((row, i) => (
              <View key={row.name} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={{ flex: 3 }}>{row.name}</Text>
                <Text style={{ flex: 2, textAlign: "right", fontWeight: "bold" }}>{usd(row.spend)}</Text>
                <Text style={{ flex: 1, textAlign: "center" }}>{row.orders}</Text>
                <Text style={{ flex: 1.5, textAlign: "center", color: row.avgDelay > 3 ? COLOR_SECONDARY : COLOR_GREEN }}>
                  {row.avgDelay > 0 ? `${row.avgDelay}d` : "—"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* By Cost Center */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ejecución Centros de Costo</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Centro de Costo</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: "right" }]}>Presupuesto</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: "right" }]}>Ejecutado</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1.5, textAlign: "right" }]}>% Ejec.</Text>
            </View>
            {data.byCC.map((row, i) => (
              <View key={row.name} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={{ flex: 3 }}>{row.name}</Text>
                <Text style={{ flex: 2, textAlign: "right" }}>{usd(row.budget)}</Text>
                <Text style={{ flex: 2, textAlign: "right", fontWeight: "bold" }}>{usd(row.spent)}</Text>
                <Text style={{ flex: 1.5, textAlign: "right", color: row.pct > 90 ? COLOR_SECONDARY : COLOR_GREEN, fontWeight: "bold" }}>
                  {row.pct.toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Agrov2 Marketplace · Reporte confidencial</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

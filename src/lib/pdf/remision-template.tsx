import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, padding: 40, color: "#1a1c1d" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  logo: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#005c72" },
  docTitle: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#2B5F2B", textAlign: "right" },
  docNum: { fontSize: 9, color: "#3f484c", textAlign: "right" },
  divider: { borderTop: "1px solid #E5E5E5", marginVertical: 10 },
  row: { flexDirection: "row", gap: 12 },
  col: { flex: 1 },
  label: { fontSize: 8, color: "#3f484c", marginBottom: 1 },
  value: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  sectionTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#005c72", textTransform: "uppercase", marginBottom: 6 },
  tableHeader: { flexDirection: "row", backgroundColor: "#2B5F2B", padding: "5 4" },
  tableHeaderText: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#fff" },
  tableRow: { flexDirection: "row", padding: "4 4", borderBottom: "1px solid #eee" },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colLote: { flex: 1.5, textAlign: "center" },
  colVence: { flex: 1.5, textAlign: "center" },
  statusBox: { backgroundColor: "#d1fae5", borderRadius: 2, padding: "4 8", alignSelf: "flex-end", marginTop: 12 },
  statusText: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#065f46" },
  sigBox: { borderTop: "1px solid #000", width: 150, marginTop: 40 },
  sigLabel: { fontSize: 8, color: "#3f484c", marginTop: 2 },
});

interface RemisionItem {
  description: string;
  quantity: number;
  unit: string;
  lote: string;
  fechaVence: string;
}

interface RemisionData {
  num: string;
  fecha: string;
  ordenRef: string;
  origen: { nombre: string; direccion: string; responsable: string };
  destino: { nombre: string; direccion: string; contacto: string };
  transportista: string;
  guia: string;
  items: RemisionItem[];
  notas?: string;
}

export function RemisionPDF({ data }: { data: RemisionData }) {
  return (
    <Document title={`Remisión ${data.num}`} author="AgroMarket">
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.logo}>AgroMarket</Text>
            <Text style={{ fontSize: 8, color: "#3f484c", marginTop: 2 }}>Remisión de despacho</Text>
          </View>
          <View>
            <Text style={s.docTitle}>REMISIÓN</Text>
            <Text style={s.docNum}>{data.num}</Text>
            <Text style={[s.docNum, { marginTop: 2 }]}>Orden: {data.ordenRef}</Text>
          </View>
        </View>
        <View style={s.divider} />

        <View style={[s.row, { marginBottom: 14 }]}>
          <View style={s.col}>
            <Text style={s.sectionTitle}>Origen (Emisor)</Text>
            <Text style={s.value}>{data.origen.nombre}</Text>
            <Text style={s.label}>{data.origen.direccion}</Text>
            <Text style={s.label}>Responsable: {data.origen.responsable}</Text>
          </View>
          <View style={s.col}>
            <Text style={s.sectionTitle}>Destino (Receptor)</Text>
            <Text style={s.value}>{data.destino.nombre}</Text>
            <Text style={s.label}>{data.destino.direccion}</Text>
            <Text style={s.label}>Contacto: {data.destino.contacto}</Text>
          </View>
          <View style={s.col}>
            <Text style={s.sectionTitle}>Transporte</Text>
            <Text style={s.value}>{data.transportista}</Text>
            <Text style={s.label}>Guía: {data.guia}</Text>
            <Text style={[s.label, { marginTop: 4 }]}>Fecha despacho:</Text>
            <Text style={s.value}>{data.fecha}</Text>
          </View>
        </View>

        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderText, s.colDesc]}>Producto</Text>
          <Text style={[s.tableHeaderText, s.colQty]}>Cantidad</Text>
          <Text style={[s.tableHeaderText, { flex: 1, textAlign: "center", fontSize: 8, fontFamily: "Helvetica-Bold", color: "#fff" }]}>Unidad</Text>
          <Text style={[s.tableHeaderText, s.colLote]}>Lote</Text>
          <Text style={[s.tableHeaderText, s.colVence]}>Vence</Text>
        </View>
        {data.items.map((item, i) => (
          <View key={i} style={[s.tableRow, i % 2 !== 0 ? { backgroundColor: "#f9fafb" } : {}]}>
            <Text style={[{ fontSize: 9 }, s.colDesc]}>{item.description}</Text>
            <Text style={[{ fontSize: 9, textAlign: "center" }, s.colQty]}>{item.quantity}</Text>
            <Text style={[{ fontSize: 9, textAlign: "center", flex: 1 }]}>{item.unit}</Text>
            <Text style={[{ fontSize: 9, textAlign: "center" }, s.colLote]}>{item.lote}</Text>
            <Text style={[{ fontSize: 9, textAlign: "center" }, s.colVence]}>{item.fechaVence}</Text>
          </View>
        ))}

        {data.notas && (
          <View style={{ marginTop: 12 }}>
            <Text style={s.sectionTitle}>Observaciones</Text>
            <Text style={{ fontSize: 8, color: "#3f484c" }}>{data.notas}</Text>
          </View>
        )}

        {/* Signatures */}
        <View style={[s.row, { marginTop: 40 }]}>
          <View style={{ flex: 1 }}>
            <View style={s.sigBox} />
            <Text style={s.sigLabel}>Firma Despachador</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={s.sigBox} />
            <Text style={s.sigLabel}>Firma Transportista</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={s.sigBox} />
            <Text style={s.sigLabel}>Firma Receptor</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

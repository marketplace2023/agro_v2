"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera, PenTool, CheckCircle, Upload, Trash2 } from "lucide-react";

const MOCK_DESPACHO = {
  id: "d1", orderNum: "ORD-2026-4498", trackingCode: "SRV-2026-994521",
  buyer: "Hacienda El Palmar SAS", contact: "Carlos Ruiz", phone: "+57 310 555 1234",
  address: "Cra 45 #78-23, Zona Industrial, Medellín, CO",
  items: [{ name: "Mancozeb 80% WP Fungicida", qty: 50, unit: "kg" }],
};

export default function PruebaEntregaPage() {
  const params = useParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [receiverDoc, setReceiverDoc] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [condition, setCondition] = useState<"buena" | "con_observaciones" | "dañada">("buena");
  const [photos, setPhotos] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);

  function startDraw(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath(); ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#005c72"; ctx.lineWidth = 2; ctx.lineCap = "round";
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top); ctx.stroke();
    setHasSignature(true);
  }

  function stopDraw() { setIsDrawing(false); }

  function clearSignature() {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  }

  function addPhoto() { setPhotos(prev => [...prev, `foto_entrega_${prev.length + 1}.jpg`]); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasSignature || !receiverName) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false); setCompleted(true);
    setTimeout(() => router.push("/dashboard/logistica"), 2500);
  }

  const d = MOCK_DESPACHO;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/logistica" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={16} /></Link>
        <div><h1 className="text-headline-md font-bold">Prueba de entrega</h1><p className="text-sm text-[var(--color-on-surface-variant)]">Orden {d.orderNum}</p></div>
      </div>

      {completed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <CheckCircle size={36} className="text-green-600 mx-auto mb-2" />
          <h3 className="font-bold text-base text-green-700">Entrega confirmada</h3>
          <p className="text-sm text-green-600">La prueba de entrega fue registrada exitosamente.</p>
        </div>
      )}

      {!completed && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Order summary */}
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-3">
            <h2 className="font-semibold text-sm">Datos de la entrega</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">Destinatario</span><span className="font-medium">{d.buyer}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">Contacto</span><span>{d.contact} · {d.phone}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">Dirección</span><span className="text-right max-w-[200px]">{d.address}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">Tracking</span><span className="font-mono text-xs">{d.trackingCode}</span></div>
            </div>
            <div className="border-t border-[var(--color-border-subtle)] pt-3">
              {d.items.map(item => <div key={item.name} className="flex justify-between text-sm"><span>{item.name}</span><span className="font-semibold">{item.qty} {item.unit}</span></div>)}
            </div>
          </div>

          {/* Receiver info */}
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-sm">Datos del receptor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1.5">Nombre quien recibe *</label><input value={receiverName} onChange={e => setReceiverName(e.target.value)} required placeholder="Nombre completo" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
              <div><label className="block text-sm font-medium mb-1.5">Documento de identidad</label><input value={receiverDoc} onChange={e => setReceiverDoc(e.target.value)} placeholder="Cédula o pasaporte" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estado de la mercancía</label>
              <div className="flex gap-2 flex-wrap">
                {([["buena", "Buena condición", "bg-green-100 text-green-700 border-green-300"], ["con_observaciones", "Con observaciones", "bg-yellow-100 text-yellow-700 border-yellow-300"], ["dañada", "Mercancía dañada", "bg-red-100 text-red-700 border-red-300"]] as const).map(([val, label, cls]) => (
                  <button key={val} type="button" onClick={() => setCondition(val)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${condition === val ? cls : "border-[var(--color-border-subtle)]"}`}>{label}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Observaciones de entrega</label>
              <textarea value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)} rows={2} placeholder="Observaciones sobre la condición del producto, acuerdos, etc." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none" />
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between"><h2 className="font-semibold text-sm flex items-center gap-2"><Camera size={14} /> Fotos de entrega</h2><button type="button" onClick={addPhoto} className="flex items-center gap-1 text-sm text-[var(--color-primary)] font-medium"><Upload size={13} /> Agregar foto</button></div>
            {photos.length === 0 ? (
              <div onClick={addPhoto} className="border-2 border-dashed border-[var(--color-border-subtle)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--color-primary)]"><Camera size={24} className="mx-auto mb-2 text-[var(--color-on-surface-variant)]" /><p className="text-sm text-[var(--color-on-surface-variant)]">Tomar foto o cargar imagen</p></div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {photos.map((p, i) => <div key={i} className="relative w-20 h-20 bg-[var(--color-surface-container-low)] rounded-lg border border-[var(--color-border-subtle)] flex items-center justify-center"><Camera size={18} className="text-[var(--color-on-surface-variant)]" /><button type="button" onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5"><Trash2 size={10} /></button></div>)}
                <button type="button" onClick={addPhoto} className="w-20 h-20 border-2 border-dashed border-[var(--color-border-subtle)] rounded-lg flex items-center justify-center hover:border-[var(--color-primary)]"><Camera size={18} className="text-[var(--color-on-surface-variant)]" /></button>
              </div>
            )}
          </div>

          {/* Signature */}
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between"><h2 className="font-semibold text-sm flex items-center gap-2"><PenTool size={14} /> Firma del receptor *</h2>{hasSignature && <button type="button" onClick={clearSignature} className="text-sm text-red-500 hover:underline">Borrar firma</button>}</div>
            <div className="border-2 border-dashed border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
              <canvas ref={canvasRef} width={500} height={160} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                className="w-full cursor-crosshair block" style={{ touchAction: "none" }} />
            </div>
            <p className="text-xs text-[var(--color-on-surface-variant)]">{hasSignature ? "✓ Firma capturada" : "Dibuja la firma del receptor en el recuadro"}</p>
          </div>

          <div className="flex items-center justify-between">
            <Link href="/dashboard/logistica" className="text-sm text-[var(--color-on-surface-variant)]">Cancelar</Link>
            <button type="submit" disabled={saving || !hasSignature || !receiverName} className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60"><CheckCircle size={14} />{saving ? "Confirmando..." : "Confirmar entrega"}</button>
          </div>
        </form>
      )}
    </div>
  );
}

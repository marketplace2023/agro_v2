"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bold, Italic, List, Link2, Image, Eye, Save } from "lucide-react";

const CATEGORIES = ["Nutrición vegetal", "Protección de cultivos", "Biológicos", "Normativa", "Tecnología agrícola", "Casos de éxito", "Tendencias", "Guías técnicas"];

export default function NuevoBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [status, setStatus] = useState<"borrador" | "publicado" | "programado">("borrador");
  const [publishDate, setPublishDate] = useState("");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleTitleChange(v: string) {
    setTitle(v);
    setSlug(v.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-").slice(0, 60));
    if (!seoTitle) setSeoTitle(v);
  }

  async function handleSave() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    router.push("/dashboard/marketing");
  }

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/marketing" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={16} /></Link>
        <div className="flex-1"><h1 className="text-headline-md font-bold">Nuevo artículo</h1><p className="text-sm text-[var(--color-on-surface-variant)]">Editor de contenido del blog</p></div>
        <button onClick={() => setPreview(!preview)} className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border transition-colors ${preview ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-[var(--color-border-subtle)]"}`}><Eye size={14} /> {preview ? "Editar" : "Vista previa"}</button>
        <div className="flex items-center gap-1">
          <select value={status} onChange={e => setStatus(e.target.value as typeof status)} className="text-sm border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 outline-none">
            <option value="borrador">Borrador</option>
            <option value="publicado">Publicar ahora</option>
            <option value="programado">Programar</option>
          </select>
          <button onClick={handleSave} disabled={saving || !title} className="flex items-center gap-1.5 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-60"><Save size={14} />{saving ? "Guardando..." : "Guardar"}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {!preview ? (
            <>
              <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
                <div>
                  <input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Título del artículo..." className="w-full text-2xl font-bold outline-none bg-transparent border-b border-[var(--color-border-subtle)] pb-2 focus:border-[var(--color-primary)] transition-colors" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-on-surface-variant)]">Slug:</span>
                  <input value={slug} onChange={e => setSlug(e.target.value)} className="text-xs text-[var(--color-primary)] flex-1 outline-none bg-transparent font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Extracto / descripción corta</label>
                  <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} placeholder="Describe el artículo en 1-2 oraciones..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] resize-none" />
                </div>
              </div>

              <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
                <div className="border-b border-[var(--color-border-subtle)] px-4 py-2 flex items-center gap-1">
                  {[{ icon: <Bold size={14} />, label: "Bold" }, { icon: <Italic size={14} />, label: "Italic" }, { icon: <List size={14} />, label: "List" }, { icon: <Link2 size={14} />, label: "Link" }, { icon: <Image size={14} />, label: "Image" }].map(tool => (
                    <button key={tool.label} title={tool.label} className="p-1.5 hover:bg-gray-100 rounded text-[var(--color-on-surface-variant)]">{tool.icon}</button>
                  ))}
                </div>
                <textarea value={content} onChange={e => setContent(e.target.value)} rows={20} placeholder="Escribe el contenido del artículo aquí... (markdown soportado)" className="w-full px-4 py-3 text-sm outline-none resize-y font-mono bg-transparent min-h-[400px]" />
              </div>
            </>
          ) : (
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-8 space-y-4 min-h-[500px]">
              {title ? <h1 className="text-3xl font-bold">{title}</h1> : <p className="text-[var(--color-on-surface-variant)] italic">Sin título</p>}
              {excerpt && <p className="text-[var(--color-on-surface-variant)] text-lg">{excerpt}</p>}
              <hr className="border-[var(--color-border-subtle)]" />
              {content ? <div className="text-sm leading-relaxed whitespace-pre-wrap">{content}</div> : <p className="text-[var(--color-on-surface-variant)] italic text-sm">Sin contenido</p>}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm">Configuración</h3>
            <div><label className="block text-xs font-medium mb-1.5 text-[var(--color-on-surface-variant)]">Categoría</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"><option value="">Seleccionar...</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="block text-xs font-medium mb-1.5 text-[var(--color-on-surface-variant)]">Etiquetas (separadas por coma)</label><input value={tags} onChange={e => setTags(e.target.value)} placeholder="fertilizante, nutrición, fósforo" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" /></div>
            {status === "programado" && <div><label className="block text-xs font-medium mb-1.5 text-[var(--color-on-surface-variant)]">Fecha de publicación</label><input type="datetime-local" value={publishDate} onChange={e => setPublishDate(e.target.value)} className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" /></div>}
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm">Imagen de portada</h3>
            <div className="border-2 border-dashed border-[var(--color-border-subtle)] rounded-xl p-4 text-center">
              {coverImage ? <img src={coverImage} alt="" className="w-full h-32 object-cover rounded-lg" /> : <div className="h-24 flex flex-col items-center justify-center gap-2"><Image size={24} className="text-[var(--color-on-surface-variant)]" /><p className="text-xs text-[var(--color-on-surface-variant)]">Clic para cargar imagen</p></div>}
            </div>
            <input value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="O pega URL de imagen..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" />
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm">SEO</h3>
            <div><label className="block text-xs font-medium mb-1.5 text-[var(--color-on-surface-variant)]">Meta título</label><input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder="Título para buscadores" className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" /><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{seoTitle.length}/60</p></div>
            <div><label className="block text-xs font-medium mb-1.5 text-[var(--color-on-surface-variant)]">Meta descripción</label><textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)} rows={2} placeholder="Descripción para resultados de búsqueda..." className="w-full border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] resize-none" /><p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{seoDesc.length}/160</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

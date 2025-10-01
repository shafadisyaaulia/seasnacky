"use client";

import { useState } from "react";

type Status = { type: "idle" | "success" | "error" | "loading"; message?: string };

type ProductFormProps = {
  categories: string[];
};

type QuickActionsProps = {
  categories: string[];
  defaultFolder: string;
};

async function submitJson<T>(url: string, data: unknown, options?: RequestInit) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    ...options,
  });

  const result = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) {
    throw new Error(result?.message ?? "Terjadi kesalahan saat mengirim data.");
  }
  return result;
}

function useAsyncStatus() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const wrap = async (action: () => Promise<void>) => {
    try {
      setStatus({ type: "loading" });
      await action();
      setStatus({ type: "success", message: "Berhasil disimpan." });
    } catch (error) {
      setStatus({ type: "error", message: (error as Error).message });
    }
  };

  return { status, setStatus, wrap };
}

function ProductForm({ categories }: ProductFormProps) {
  const [form, setForm] = useState({
    name: "",
    category: categories[0] ?? "",
    price: "",
    unit: "",
    stock: "",
    imageUrl: "",
    description: "",
    tags: "",
  });
  const { status, wrap, setStatus } = useAsyncStatus();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    wrap(async () => {
      await submitJson("/api/products", {
        name: form.name,
        category: form.category,
        price: Number(form.price ?? 0),
        unit: form.unit,
        stock: Number(form.stock ?? 0),
        imageUrl: form.imageUrl,
        description: form.description,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      setForm({
        name: "",
        category: categories[0] ?? "",
        price: "",
        unit: "",
        stock: "",
        imageUrl: "",
        description: "",
        tags: "",
      });
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-600">
          Nama Produk
          <input
            required
            value={form.name}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, name: event.target.value }));
              setStatus({ type: "idle" });
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Contoh: Keripik Rumput Laut Signature"
          />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Kategori
          <input
            value={form.category}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, category: event.target.value }));
              setStatus({ type: "idle" });
            }}
            list="product-categories"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Keripik"
          />
          <datalist id="product-categories">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </label>
        <label className="text-sm font-medium text-slate-600">
          Harga (IDR)
          <input
            required
            type="number"
            min="0"
            value={form.price}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, price: event.target.value }));
              setStatus({ type: "idle" });
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="25000"
          />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Stok
          <input
            required
            type="number"
            min="0"
            value={form.stock}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, stock: event.target.value }));
              setStatus({ type: "idle" });
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="120"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-medium text-slate-600">
          Satuan
          <input
            value={form.unit}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, unit: event.target.value }));
              setStatus({ type: "idle" });
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="80g"
          />
        </label>
        <label className="text-sm font-medium text-slate-600 sm:col-span-2">
          URL Gambar
          <input
            value={form.imageUrl}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, imageUrl: event.target.value }));
              setStatus({ type: "idle" });
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="https://..."
          />
        </label>
      </div>
      <label className="text-sm font-medium text-slate-600">
        Deskripsi Singkat
        <textarea
          rows={3}
          value={form.description}
          onChange={(event) => {
            setForm((prev) => ({ ...prev, description: event.target.value }));
            setStatus({ type: "idle" });
          }}
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Highlight utama produk..."
        />
      </label>
      <label className="text-sm font-medium text-slate-600">
        Tag (pisahkan dengan koma)
        <input
          value={form.tags}
          onChange={(event) => {
            setForm((prev) => ({ ...prev, tags: event.target.value }));
            setStatus({ type: "idle" });
          }}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="rendah kalori, snacking"
        />
      </label>
      <button
        type="submit"
        disabled={status.type === "loading"}
        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status.type === "loading" ? "Menyimpan..." : "Tambah Produk"}
      </button>
      {status.type !== "idle" && status.message ? (
        <p
          className={
            status.type === "error"
              ? "text-sm font-medium text-red-600"
              : "text-sm font-medium text-blue-600"
          }
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}

function ArticleForm() {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "Artikel",
    summary: "",
    readingTime: "",
    heroImageUrl: "",
  });
  const { status, wrap, setStatus } = useAsyncStatus();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    wrap(async () => {
      await submitJson("/api/articles", {
        title: form.title,
        slug: form.slug || undefined,
        category: form.category,
        summary: form.summary,
        readingTime: form.readingTime,
        heroImageUrl: form.heroImageUrl,
      });
      setForm({
        title: "",
        slug: "",
        category: "Artikel",
        summary: "",
        readingTime: "",
        heroImageUrl: "",
      });
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-600">
          Judul Artikel
          <input
            required
            value={form.title}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, title: event.target.value }));
              setStatus({ type: "idle" });
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Resep poke bowl..."
          />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Slug (opsional)
          <input
            value={form.slug}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, slug: event.target.value }));
              setStatus({ type: "idle" });
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="slug-unik"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-600">
          Kategori
          <select
            value={form.category}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, category: event.target.value }));
              setStatus({ type: "idle" });
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="Artikel">Artikel</option>
            <option value="Resep">Resep</option>
            <option value="Tips">Tips</option>
          </select>
        </label>
        <label className="text-sm font-medium text-slate-600">
          Estimasi Baca
          <input
            value={form.readingTime}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, readingTime: event.target.value }));
              setStatus({ type: "idle" });
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="5 menit"
          />
        </label>
      </div>
      <label className="text-sm font-medium text-slate-600">
        Ringkasan
        <textarea
          rows={3}
          value={form.summary}
          onChange={(event) => {
            setForm((prev) => ({ ...prev, summary: event.target.value }));
            setStatus({ type: "idle" });
          }}
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Gambaran singkat konten..."
        />
      </label>
      <label className="text-sm font-medium text-slate-600">
        URL Hero Image (opsional)
        <input
          value={form.heroImageUrl}
          onChange={(event) => {
            setForm((prev) => ({ ...prev, heroImageUrl: event.target.value }));
            setStatus({ type: "idle" });
          }}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="https://..."
        />
      </label>
      <button
        type="submit"
        disabled={status.type === "loading"}
        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status.type === "loading" ? "Menyimpan..." : "Publikasikan Artikel"}
      </button>
      {status.type !== "idle" && status.message ? (
        <p className={status.type === "error" ? "text-sm font-medium text-red-600" : "text-sm font-medium text-blue-600"}>
          {status.message}
        </p>
      ) : null}
    </form>
  );
}

function TipForm() {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    detail: "",
    duration: "",
  });
  const { status, wrap, setStatus } = useAsyncStatus();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    wrap(async () => {
      await submitJson("/api/tips", {
        title: form.title,
        slug: form.slug || undefined,
        detail: form.detail,
        duration: form.duration,
      });
      setForm({ title: "", slug: "", detail: "", duration: "" });
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-600">
          Judul Tips
          <input
            required
            value={form.title}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, title: event.target.value }));
              setStatus({ type: "idle" });
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Cara menyimpan keripik"
          />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Slug (opsional)
          <input
            value={form.slug}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, slug: event.target.value }));
              setStatus({ type: "idle" });
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="tips-keripik"
          />
        </label>
      </div>
      <label className="text-sm font-medium text-slate-600">
        Detail Tips
        <textarea
          rows={3}
          value={form.detail}
          onChange={(event) => {
            setForm((prev) => ({ ...prev, detail: event.target.value }));
            setStatus({ type: "idle" });
          }}
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Langkah penyimpanan..."
        />
      </label>
      <label className="text-sm font-medium text-slate-600">
        Durasi / Catatan
        <input
          value={form.duration}
          onChange={(event) => {
            setForm((prev) => ({ ...prev, duration: event.target.value }));
            setStatus({ type: "idle" });
          }}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="3 menit baca"
        />
      </label>
      <button
        type="submit"
        disabled={status.type === "loading"}
        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status.type === "loading" ? "Menyimpan..." : "Tambah Tips"}
      </button>
      {status.type !== "idle" && status.message ? (
        <p className={status.type === "error" ? "text-sm font-medium text-red-600" : "text-sm font-medium text-blue-600"}>
          {status.message}
        </p>
      ) : null}
    </form>
  );
}

export function AdminQuickActions({ categories, defaultFolder }: QuickActionsProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Tambah Produk</h3>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            Katalog
          </span>
        </div>
        <ProductForm categories={categories} />
        <p className="mt-6 text-xs text-slate-500">
          Butuh upload gambar? Minta signature via <code className="rounded bg-slate-100 px-1 text-[11px]">/api/uploads/signature</code>.
          Folder default: <strong>{defaultFolder}</strong>.
        </p>
      </div>
      <div className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Publikasikan Artikel</h3>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            Edukasi
          </span>
        </div>
        <ArticleForm />
      </div>
      <div className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Tambah Tips Penyimpanan</h3>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            Tips
          </span>
        </div>
        <TipForm />
      </div>
    </div>
  );
}
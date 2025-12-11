"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddRecipePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageFile: null,
    difficulty: "Mudah",
    time: "",
    ingredients: [""],
    instructions: [""],
    relatedProductId: "",
  });

  // Cloudinary config
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "seasnacky";
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ddmtevdyv";

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, imageFile: e.target.files[0] });
    }
  };

  const handleArrayChange = (field, idx, value) => {
    setForm({
      ...form,
      [field]: form[field].map((item, i) => (i === idx ? value : item)),
    });
  };

  const addArrayField = (field) => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let imageUrl = "";
      if (form.imageFile) {
        const data = new FormData();
        data.append("file", form.imageFile);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: data,
        });
        const result = await res.json();
        if (!result.secure_url) throw new Error("Gagal upload gambar ke Cloudinary");
        imageUrl = result.secure_url;
      }
      const payload = {
        title: form.title,
        description: form.description,
        image: imageUrl,
        difficulty: form.difficulty,
        time: form.time,
        ingredients: form.ingredients.filter((i) => i.trim()),
        instructions: form.instructions.filter((i) => i.trim()),
        relatedProductId: form.relatedProductId,
      };
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal upload resep");
      alert("Resep berhasil ditambahkan!");
      router.push("/dashboard/seller/recipes");
    } catch (error) {
      alert("Error: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold mb-6">Tambah Resep Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Judul Resep</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            required
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            className="w-full p-2 border rounded-lg"
            rows={3}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Upload Gambar Resep</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded-lg"
            required
            onChange={handleImageChange}
          />
          <p className="text-xs text-gray-400 mt-1">*Gambar akan diupload ke Cloudinary</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tingkat Kesulitan</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          >
            <option value="Mudah">Mudah</option>
            <option value="Sedang">Sedang</option>
            <option value="Sulit">Sulit</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Estimasi Waktu</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Contoh: 30 Menit"
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bahan-bahan</label>
          {form.ingredients.map((item, idx) => (
            <input
              key={idx}
              type="text"
              className="w-full p-2 border rounded-lg mb-2"
              value={item}
              onChange={(e) => handleArrayChange("ingredients", idx, e.target.value)}
              placeholder={`Bahan ${idx + 1}`}
            />
          ))}
          <button type="button" className="text-blue-600 text-sm" onClick={() => addArrayField("ingredients")}>+ Tambah Bahan</button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Langkah-langkah</label>
          {form.instructions.map((item, idx) => (
            <textarea
              key={idx}
              className="w-full p-2 border rounded-lg mb-2"
              value={item}
              onChange={(e) => handleArrayChange("instructions", idx, e.target.value)}
              placeholder={`Langkah ${idx + 1}`}
              rows={2}
            />
          ))}
          <button type="button" className="text-blue-600 text-sm" onClick={() => addArrayField("instructions")}>+ Tambah Langkah</button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Produk Terkait (Opsional)</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="ID Produk yang direkomendasikan"
            onChange={(e) => setForm({ ...form, relatedProductId: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Menyimpan..." : "Upload Resep"}
        </button>
      </form>
    </div>
  );
}

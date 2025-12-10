'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast'; 
import Link from 'next/link';
import { uploadImageToCloudinary } from '@/lib/cloudinaryUpload'; 

// Component untuk Form Input Produk Baru
const CreateProductPage = () => {
  // --- STATE VARIABEL ---
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('makanan'); 
  const [countInStock, setCountInStock] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null); // State untuk FILE UPLOAD
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ==========================================================
  // ✅ FUNGSI handleFileChange (HARUS ADA DI SINI)
  // ==========================================================
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Mengambil file pertama dari input
      const file = e.target.files?.[0] || null;
      setImageFile(file);
  };
  // ==========================================================


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = '';

    try {
      // 1. Validasi Minimum
      if (!name || !price || !description || !category) {
          toast.error('Nama, Harga, Deskripsi, dan Kategori wajib diisi.');
          setLoading(false);
          return;
      }
      
      // 2. UPLOAD GAMBAR KE CLOUDINARY
      if (imageFile) {
        const uploadToastId = toast.loading('Mengunggah gambar...');
        // Memanggil fungsi helper dari '@/lib/cloudinaryUpload'
        imageUrl = await uploadImageToCloudinary(imageFile); 
        toast.dismiss(uploadToastId);
        toast.success('Gambar berhasil diunggah!');
      } else {
        imageUrl = '/images/default-product.jpg'; 
        toast('Menggunakan gambar default.', { icon: '🖼️' });
      }

      // 3. KIRIM DATA PRODUK KE API SERVER KITA
      const productData = {
        name,
        description,
        price: Number(price),
        category,
        countInStock: Number(countInStock),
        images: [imageUrl], // Menggunakan URL yang sudah diupload
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Produk "${result.name}" berhasil ditambahkan!`);
        router.push('/admin/products'); 
      } else {
        toast.error(`Gagal membuat produk: ${result.message}`);
      }
    } catch (error: any) {
      toast.dismiss();
      console.error('Submission Error:', error);
      toast.error(error.message || 'Terjadi kesalahan saat menyimpan produk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tambah Produk Baru</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        
        {/* Nama Produk */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Produk</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Harga */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min="0"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Stok */}
        <div>
          <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700">Stok</label>
          <input
            id="countInStock"
            type="number"
            value={countInStock}
            onChange={(e) => setCountInStock(Number(e.target.value))}
            min="0"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Kategori */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategori</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
          >
            <option value="makanan">Makanan Olahan</option>
            <option value="mentah">Bahan Mentah</option>
            <option value="aksesoris">Aksesoris</option>
          </select>
        </div>
        
        {/* --- INPUT FILE UPLOAD CLOUDINARY --- */}
        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Unggah Gambar Produk</label>
          <input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={handleFileChange} // <-- Memanggil fungsi yang sudah dideklarasikan di atas
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {imageFile && (
            <p className="mt-2 text-sm text-gray-600">File dipilih: {imageFile.name}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Link href="/admin/products" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;
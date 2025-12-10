// src/lib/cloudinaryUpload.ts

// Ambil variabel publik dari environment (diakses via NEXT_PUBLIC_)
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  // Pengecekan dasar, menggunakan nama variabel Anda (ddmtevdyv dan seasnacky)
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
      // Ini akan throw error jika .env.local belum di-restart atau variabel tidak ada
      throw new Error("Cloudinary configuration missing. Check NEXT_PUBLIC variables.");
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET); 
  
  // URL upload Cloudinary
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Memberikan pesan error yang jelas jika upload gagal (misal: format file salah)
      throw new Error(`Upload Failed: ${errorData.error.message || 'Error uploading file'}`);
    }

    const data = await response.json();
    
    // Kembalikan URL publik gambar
    return data.secure_url; 
    
  } catch (error) {
    console.error("Error during Cloudinary upload:", error);
    // Re-throw error agar bisa ditangkap oleh toast di form
    throw new Error("Gagal mengunggah gambar. Pastikan file adalah gambar.");
  }
};